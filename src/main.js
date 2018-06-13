import 'phaser';

const wickeyappstore = document.querySelector('wickey-appstore');

var game;
var phaserThis = null;
var gameInited = false;
var gamePaused = false;
var userService = window.WAS.userService;
var wasDataService = window.WAS.dataService;
// userService.loginChange.subscribe((_isLogged) => {
//     console.log('Breakout: loginChange: loggedin: ', _isLogged);
// })
// // Check if purchased (where 10 is your purchase item id).
// userService.checkIfPurchased(10).subscribe(isPurch => {
//     console.log('checkIfPurchased', isPurch);
// });
// Load save data on or before game start
wasDataService.restore().subscribe(mydata => {
    console.log('window.WAS.dataService.restore', mydata);
}, (error) => {
    console.warn('window.WAS.dataService.restore:error', error);
});
// In game, after restored:
// var highScore = wasDataService.get('highScore');
// wasDataService.save('highScore', highScore);
// // Then after game over, persist to cloud
// wasDataService.persist();

// game code from: https://phaser.io/tutorials/getting-started-phaser3/part5
function preload() {
    this.load.setBaseURL('http://labs.phaser.io');

    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
}

function create() {
    this.add.image(400, 300, 'sky');

    var particles = this.add.particles('red');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });

    var logo = this.physics.add.image(400, 100, 'logo');

    logo.setVelocity(100, 200);
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
function pauseGame() {
    if (!gamePaused) {
        gamePaused = true;
        phaserThis.physics.pause();
    }
}
function unpauseGame() {
    if (gamePaused) {
        gamePaused = false;
        phaserThis.physics.resume();
    }
}
// Phaser game config
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 1420,
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
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
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
// Wait to window loads to start game
window.onload = function () {
    startGame();
}
