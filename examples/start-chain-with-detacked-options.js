/**
 * Use KomodoRPC to start KMDICE chain with detached option
 * This is for debug purposes. Recommend not run it in production
 * How to run:
 *
 *     $ npm run devtest -- examples/start-chain-with-detacked-options.js
 */

import KomodoRPC from "../src";

const debug = require("debug")("kmdrpc:test:start-chain-with-detacked-options");

(async () => {
  const application = "Agama";
  const coin = "KMDICE";
  const args = {
    pubkey:
      "035178457d4bcab8e221ddbc2cf3814bf704bb261be50f8f0e31b5fbf55cd77310",
    ac_supply: 10500000,
    ac_reward: 2500000000,
    ac_halving: 210000,
    ac_cc: 2,
    addressindex: 1,
    spentindex: 1,
    addnode: "144.76.217.232"
  };
  try {
    // Step 1: create application
    const api = KomodoRPC(application);

    // Step 2: start the chain
    const komodod = await api.startDaemon(coin);
    await komodod.start({
      detached: true,
      args
    });

    // Step 3: wait until ready
    const waitUntilReady = await komodod.waitUntilReady();
    debug(`waitUntilReady = ${JSON.stringify(waitUntilReady)}`);

    // Step 4: stop application
    setTimeout(() => {
      process.exit(0);
    }, 2000);

    // Step 5: open new terminal and
    // run `ps -ax | grep komodod`
    // you will still see komodod is running
  } catch (err) {
    debug(err.message);
    setTimeout(() => {
      process.exit(1);
    }, 2000);
  }
})();
