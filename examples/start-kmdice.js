/**
 * Use KomodoRPC to start KMDICE chain
 * How to run:
 *
 *     $ npm run devtest -- examples/start-kmdice.js
 */

import KomodoRPC from "../src";
import { kmdice } from "./config";

const debug = require("debug")("kmdrpc:test:start-kmdice");

(async () => {
  const application = "Agama";
  const { coin, args } = kmdice;

  try {
    // Step 1: create application
    const api = KomodoRPC(application);

    // Step 2: start the chain
    const komodod = await api.startDaemon(coin);
    await komodod.start({
      args
    });

    // Step 3: wait until ready
    const waitUntilReady = await komodod.waitUntilReady();
    debug(`waitUntilReady = ${JSON.stringify(waitUntilReady)}`);

    // Step 4: stop daemon
    if (komodod.isRunning() === true) {
      const rs = await komodod.stop();
      debug(`rs.ok === done = ${rs.ok === "done"}`);
    }

    setTimeout(() => {
      process.exit(0);
    }, 2000);
  } catch (err) {
    debug(err.message);
    setTimeout(() => {
      process.exit(1);
    }, 2000);
  }
})();
