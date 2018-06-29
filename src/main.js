import 'phaser';

const wickeyappstore = document.querySelector('wickey-appstore');

let game;
let phaserThis = null;
let gameInited = false;
let gamePaused = false;
const userService = window.WAS.userService;
const wasDataService = window.WAS.dataService;
// In game, after restored:
// let highScore = wasDataService.get('highScore');
// wasDataService.save('highScore', highScore);
// // Then after game over, persist to cloud
// wasDataService.persist();

const gameOptions = {
    width: 800,
    height: 1420,
    scale: 1,
    emitterSpeed: 100,
    logoVelocityX: 100,
    logoVelocityY: 200
}

let leaderboardObj_list = [];
let leaderboardText_list = [];
let pause2Text;
let pauseText;
let leaderboard_bg;
let leaderboardHudBG;
let leaderboardTitle;
let leaderboard;
let myrank;
let shade;

// game code from: https://phaser.io/tutorials/getting-started-phaser3/part5
function preload() {
    this.load.setBaseURL('http://labs.phaser.io');

    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
    this.load.bitmapFont('clarendon', 'assets/fonts/bitmap/clarendon.png', 'assets/fonts/bitmap/clarendon.xml');

    leaderboardObj_list = [];
    leaderboardText_list = [];
}

function create() {
    this.add.image(400, 300, 'sky');

    let particles = this.add.particles('red');

    let emitter = particles.createEmitter({
        speed: gameOptions.emitterSpeed,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });

    let logo = this.physics.add.image(400, 100, 'logo');

    logo.setVelocity(gameOptions.logoVelocityX, gameOptions.logoVelocityY);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
    this.input.on('pointerup', function (pointer) {
        if (gamePaused == true) {
            unpauseGame();
        }
    }, this);
    phaserThis = this;
}

function makeShade() {
    // Puts a shade on the stage for the game over and pause screens
    shade = phaserThis.add.graphics();
    shade.fillStyle(0x000000, 0.8);
    shade.fillRect(0, 0, gameOptions.width, gameOptions.height);
    shade.inputEnabled = true;
    shade.setInteractive();
}

// Example of adding to leaderboard. This uses prompt for speed (writing), use your own prompt that looks good in your app/game.
function addToLeaderboard (_alreadyTaken, _highScore) {
    let _showMsg = null;
    if (_alreadyTaken === true) {
        _showMsg = 'Username already taken! Enter username for leaderboard';
    } else {
        _showMsg = 'Enter username for leaderboard';
    }
    // Ask for username for leaderboard
    let _username;
    if (userService.userObject.username === userService.userObject.user_id) {
        _username = prompt(_showMsg);
    } else {
        _username = prompt(_showMsg, userService.userObject.username);
    }
    if (_username !== null && _username !== '') {
        userService.updateUsername(_username).subscribe(usr => {
            // Updated username
            userService.setHighscore(_highScore);
        }, (error) => {
            console.warn('username', error);
            if (error === 'Username already taken') {
                addToLeaderboard(true);
            }
        });
    }
}

function pauseGame() {
    if (!gamePaused) {
        gamePaused = true;
        phaserThis.physics.pause();
        makeShade();

        pauseText = phaserThis.add.text(
            phaserThis.physics.world.bounds.width * .5, 0,
            'PAUSED', { font: '64px Arial', fill: '#00BFFF', align: 'center' }
        );
        pauseText.setOrigin(.5, 0);
        pauseText.setInteractive();
        pause2Text = phaserThis.add.text(
            pauseText.x, pauseText.y + pauseText.height + 10,
            'touch/click anywhere to unpause.', { font: '34px Arial', fill: '#00BFFF', align: 'center' }
        );
        pause2Text.setOrigin(.5, .5);
        pause2Text.setInteractive();
        // Make pause text blink
        phaserThis.tweens.add({
            targets: pauseText,
            alpha: 0,
            ease: 'Sine.easeInOut',
            duration: 300,
            delay: 100,
            repeat: -1,
            yoyo: true,
            repeatDelay: 500
        });

        // leaderboard
        const ldcolor = 0xFFFFFF;
        const ldalpha = .9;
        const lead_bg_height = gameOptions.height - (pause2Text.y + pause2Text.height);
        const lead_hudbg_height = 80;

        // Update and show leaderboard
        userService.getLeaderboard(userService.userObject.username).subscribe(res => {
            leaderboard = res.leaderboard;
            myrank = res.rank;

            leaderboard_bg = phaserThis.add.graphics();
            leaderboard_bg.fillStyle(ldcolor, ldalpha);
            leaderboard_bg.fillRect(0, 0, gameOptions.width - 50, lead_bg_height);
            leaderboard_bg.inputEnabled = true;
            leaderboard_bg.setInteractive();
            leaderboard_bg.setX(25);
            leaderboard_bg.setY(pause2Text.y + pause2Text.height);

            leaderboardHudBG = phaserThis.add.graphics();
            leaderboardHudBG.fillStyle(0X38AFE5, 1.0);
            leaderboardHudBG.fillRect(0, 0, gameOptions.width - 60, lead_hudbg_height);
            leaderboardHudBG.setPosition(leaderboard_bg.x + 5, leaderboard_bg.y + 5)

            leaderboardTitle = phaserThis.add.bitmapText(0, 0, 'clarendon', 'High Scores', 40);
            leaderboardTitle.setOrigin(.5, 0);
            leaderboardTitle.setPosition(pauseText.x, leaderboardHudBG.y + 15);
            leaderboardTitle.setInteractive();

            const _entry_width = gameOptions.width - 60;
            const _entry_height = 80;
            let start_x = leaderboardHudBG.x;
            let start_y = leaderboardHudBG.y + lead_hudbg_height * .5 + _entry_height *.5 + 10;
            let entryObj;
            let entryText;
            let entryText2;
            let entryText3;
            let entryText4;
            let showEntryCount = 20;
            if (leaderboard.length < 20) {
                showEntryCount = leaderboard.length;
            }
            for (let i = 0; i < showEntryCount; ++i)
            {
                entryObj = phaserThis.add.graphics({});
                entryObj.fillStyle(0xEE383E, 1.0);
                entryObj.fillRect(0, 0, _entry_width, _entry_height);
                entryObj.setX(start_x);
                entryObj.setY(start_y);
                entryText = phaserThis.add.bitmapText(0, 0, 'clarendon', `${leaderboard[i].username}`, 24);
                entryText.setX(start_x + 10);
                entryText.setY(start_y + 5);
                entryText2 = phaserThis.add.bitmapText(0, 0, 'clarendon', `Score: ${leaderboard[i].score}`, 22);
                entryText2.setX(start_x + 10);
                entryText2.setY(start_y + _entry_height - entryText2.height - 15);
                entryText3 = phaserThis.add.bitmapText(0, 0, 'clarendon', `Rank`, 22);
                entryText3.setX(start_x + _entry_width - entryText3.width - 10);
                entryText3.setY(start_y + 5);
                entryText4 = phaserThis.add.bitmapText(0, 0, 'clarendon', `${i+1}`, 40);
                entryText4.setX(entryText3.x + entryText3.width * .25);
                entryText4.setY(start_y + _entry_height - entryText4.height - 20);
                leaderboardObj_list.push(entryObj);
                leaderboardText_list.push(entryText);
                leaderboardText_list.push(entryText2);
                leaderboardText_list.push(entryText3);
                leaderboardText_list.push(entryText4);
                start_y += _entry_height + 5;
            }
        });
    }
}
function unpauseGame() {
    if (gamePaused) {
        console.log('unpauseGame');
        shade.clear();
        pauseText.destroy();
        pause2Text.destroy();

        leaderboard_bg.clear();
        leaderboardHudBG.clear();
        leaderboardTitle.destroy();
        for (let i = 0; i < leaderboardObj_list.length; ++i)
        {
            leaderboardObj_list[i].clear();
        }
        for (let i = 0; i < leaderboardText_list.length; ++i)
        {
            leaderboardText_list[i].destroy();
        }
        leaderboardObj_list = [];
        leaderboardText_list = [];
        gamePaused = false;
        phaserThis.physics.resume();
    }
}
// Phaser game config
let config = {
    type: Phaser.AUTO,
    width: gameOptions.width,
    height: gameOptions.height,
    parent: 'phaser-game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

// Resize window automatically, but keep aspect ratio of initial config width x height.
// http://www.emanueleferonato.com/2018/02/09/phaser-3-version-of-the-html5-swipe-controlled-sokoban-game/
function resize() {
    let canvas = document.querySelector("canvas");
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowRatio = windowWidth / windowHeight;
    const gameRatio = game.config.width / game.config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}

function startGame() {
    // Ensure only one instance runs
    if (gameInited) {
        console.log('game already initialized');
    } else {
        gameInited = true;
        console.log('startGame');
        game = new Phaser.Game(config);
        resize();
        window.addEventListener("resize", resize, false);

        wickeyappstore.addEventListener('open', (event) => {
            console.log('WickeyAppStore menu opened');
            pauseGame();
        });
    }
}
function onSaveConflict(localSave, cloudSave) {
    let keepSave = localSave;
    if (localSave && cloudSave) {
        if (cloudSave.highScore > localSave.highScore) {
            keepSave = cloudSave;
        }
    }
    return keepSave;
}
let initRestored = false;
function restoreSave() {
    console.warn('restoreSave');
    wasDataService.restore(onSaveConflict).subscribe(mydata => {
        initRestored = true;
        console.log('dataService.restore', mydata);
        // Update running game with save data (i.e. If game is running, can update high score text).
        if (phaserThis) {
            let _hScore = wasDataService.get('highScore');
            if (_hScore == null) {
                _hScore = 0;
            }
            console.log('update highScore', _hScore);
        }
    }, (error) => {
        console.warn('dataService.restore:error', error);
    });
}

restoreSave();
userService.loginChange.subscribe((_isLogged) => {
    console.log('Breakout: loginChange: loggedin: ', _isLogged);
    if (initRestored == true) {
        console.warn('Breakout: login changed, restore save');
        restoreSave();
    }
})

// NOTE: Add a small wait then start game or onload, whichever is first. Offline does not work if startGame is only in onload.
window.onload = function () {
    console.log('window.onload');
    startGame();
}
// Call resize again after to ensure proper size (this should be done after window loaded completely, this is just a temp workaround).
setTimeout(() => {
    resize();
}, 3000);
setTimeout(() => {
    console.log('setTimeout');
    startGame();
}, 1000);
