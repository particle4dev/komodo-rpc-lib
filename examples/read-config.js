/**
 * Use KomodoRPC to start KMDICE chain and read its config
 * How to run:
 *
 *     $ npm run devtest -- examples/read-config.js
 */

import KomodoRPC from "../src";
import { kmdice, getBinPath } from "./config";

const debug = require("debug")("kmdrpc:test:read-config");

(async () => {
  const application = "Agama";
  const { coin, args } = kmdice;

  try {
    // Step 1: create application
    const api = KomodoRPC(application, {
      bin: getBinPath()
    });

    // Step 2: start the chain
    const komodod = await api.startDaemon(coin);

    const cpResult = await komodod.start({
      args
    });

    debug(`cpResult = ${JSON.stringify(cpResult)}`);

    // add event via childProcess
    komodod.on("exit", (code, signal) => {
      debug(`child process terminated due to receipt of signal ${signal}`);
      setTimeout(() => {
        process.exit(0);
      }, 2000);
    });

    // Step 3: wait until ready
    const waitUntilReady = await komodod.waitUntilReady();
    debug(`waitUntilReady = ${JSON.stringify(waitUntilReady)}`);

    const config = await komodod.getConfig();
    debug(`config = ${JSON.stringify(config)}`);

    // Step 4: stop daemon
    if (komodod.isRunning() === true) {
      const rs = await api.stopDaemon(coin);
      debug(`rs.ok === done = ${rs.ok === "done"}`);
    }
  } catch (err) {
    debug(err.message);
    setTimeout(() => {
      process.exit(1);
    }, 2000);
  }
})();
