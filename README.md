# Phaser3WASjs -  a Phaser3 starter with WASjs

Simple PWA setup for [Phaser 3](https://phaser.io/) + [WickeyAppStore](https://github.com/wickeyware/wickeyappstore).

## Parts to update

A list of items to update for your app.

**favicon.ico**

- Update favicon.ico.

**assets/manifest.json**

- Update images, name, and colors.

**assets/wickeyappstore**

- Update icon, screenshots, and featured images.

**src/index.html**

- Update title and description.

**sw-precache-config.js**

- Add everything that needs to be cached by service worker. Uses: [sw-precache](https://github.com/GoogleChromeLabs/sw-precache).

**src/main.js**

- Add game!

## QuickStart

Prerequisite: [nodejs](https://nodejs.org) needs to be installed on your pc.

Clone repo.

Where `mywasapp` is the name of your app, replace with whatever is desired.
```bash
git clone https://github.com/wickeyware/phaser3wasjs.git mywasapp
```

Change to that directory
```bash
cd mywasapp/
```

Install project dependencies and run.

with [npm](https://nodejs.org).

NOTE: npm will already be installed if node is already installed.

```bash
npm install
npm run start
```

with [yarn](https://yarnpkg.com)

```bash
yarn
yarn run start
```

Now visit [localhost:4204](http://localhost:4204)

To build your app in preparation for deployment to the WickeyAppStore.

```bash
npm run build
```

```bash
yarn run build
```

The output `dist/` directory is what will be selected to deploy on: [developer.wickeyappstore.com](https://developer.wickeyappstore.com/)

To see that running locally.

```bash
npm run serve
```

```bash
yarn run serve
```

Now visit [localhost:8080](http://localhost:8080)
