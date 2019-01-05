<p align="center">
  <img src="./logo.png" width="150" />
</p>

<p align="center">
  Komodo RPC Library for modern JavaScript
</p>

<div align="center">

[![Dependency Status](https://david-dm.org/particle4dev/komodo-rpc-lib.svg)](https://david-dm.org/particle4dev/komodo-rpc-lib)
[![devDependency Status](https://david-dm.org/particle4dev/komodo-rpc-lib/dev-status.svg)](https://david-dm.org/particle4dev/komodo-rpc-lib#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/github/particle4dev/komodo-rpc-lib/badge.svg?branch=master)](https://coveralls.io/github/particle4dev/komodo-rpc-lib?branch=master)
[![GitHub Issues](https://img.shields.io/github/issues/particle4dev/komodo-rpc-lib.svg)](https://github.com/particle4dev/komodo-rpc-lib/issues)
[![Build Status](https://travis-ci.com/particle4dev/komodo-rpc-lib.svg?branch=master)](https://travis-ci.com/particle4dev/komodo-rpc-lib)
[![NPM version](https://img.shields.io/npm/v/kmd-rpc.svg)](https://npmjs.org/package/kmd-rpc)

</div>

**This package doesn't include [Komodo Binary](https://github.com/KomodoPlatform/komodo/releases) because of security reason. Please setup [Komodo Binary](https://github.com/KomodoPlatform/komodo/releases) in your local first before run this package.**

**This project is bound by a [Code of Conduct][].**

## Quickstart

### Prerequisites

- Nodejs: v10.13.0 or newer

- Yarn: v1.9.4 or newer

- Npm: v6.3.0 or newer

### Install

Install the package via `yarn`:

```sh
yarn add kmd-rpc
```

or via `npm`:

```sh
npm install kmd-rpc --save
```

To setup the Komodo daemon, download and unzip it [here](https://github.com/KomodoPlatform/komodo/releases). Please follow this directory structure.

```
Your Project
├── bin
│   ├── mac
│   ├── linux
│   └── win
└── src
```

Create an application.

```js
const path = require("path");
const KomodoRPC = require("kmd-rpc").default;

function getBinPath() {
  return path.join(__dirname, "bin");
}

const api = KomodoRPC(application, {
  bin: getBinPath()
});
```

Launch [the daemon](https://github.com/jl777/komodo/blob/master/src/assetchains.old), we will launch KMDice for example.

```js
const coin = "KMDICE";
const args = {
  ac_supply: 10500000,
  ac_reward: 2500000000,
  ac_halving: 210000,
  ac_cc: 2,
  addressindex: 1,
  spentindex: 1,
  addnode: "144.76.217.232"
};

const komodod = await api.startDaemon(coin);

await komodod.start({
  args
});
```

Wait until the daemon launches and start interact with it.

```js
await komodod.waitUntilReady();

const getnewaddress = await api.rpc({
  coin,
  action: "getnewaddress"
});
debug(`getnewaddress = ${getnewaddress}`);
```

Stop the daemon.

```js
if (komodod.isRunning() === true) {
  const rs = await api.stop({
    coin
  });
}
```

## Examples

-   [Basic example](examples/basic)
-   [Start KMDice chain](examples/start-kmdice.js)
-   [Start mutil chain](examples/start-mutil-chain.js)
-   [Start a chain and call RPC](examples/start-mutil-chain.js)
-   [Start a chain and read its config](examples/read-config.js)
-   [Start a chain with log options](examples/start-chain-with-log.js)

## Documentation

## Contributing

Familiarize yourself with contributing on github <https://guides.github.com/activities/contributing-to-open-source/>

1. **Fork** the repo on GitHub
2. **Clone** the project to your own machine
3. **Commit** changes to your own branch
4. **Push** your work back up to your fork
5. Submit a **Pull request** so that we can review your changes

## Issues

Feel free to submit issues and enhancement requests.

## Credits

- **pbca26** - _Initial work_ - [pbca26](https://github.com/pbca26)
- **Nam Hoang** - _Maintainer_ - [particle4dev](https://github.com/particle4dev)

See also the list of [contributors](/AUTHORS.md) who participated in this project.

## License

This project is licensed under the MIT license, Copyright (c) 2018 Komodo. For more information see `LICENSE.md`.
