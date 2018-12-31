/**
 * Use KomodoRPC to start KMDICE chain with detached option
 * This is for debug purposes, recommend not run it in production
 * How to run:
 *
 *     $ npm run devtest -- examples/start-chain-with-detacked-options.js
 */

import KomodoRPC from "../src";
import { kmdice } from "./config";

const debug = require("debug")("kmdrpc:test:start-chain-with-detacked-options");

(async () => {
  const application = "Agama";
  const { coin, args } = kmdice;

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
    // you will still see komodod is still running
  } catch (err) {
    debug(err.message);
    setTimeout(() => {
      process.exit(1);
    }, 2000);
  }
})();
