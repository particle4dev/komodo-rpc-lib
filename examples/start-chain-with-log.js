/**
 * Use KomodoRPC to start KMDICE chain and read its log
 * How to run:
 *
 *     $ npm run devtest -- examples/start-chain-with-log.js
 */

import d from "debug";
import KomodoRPC from "../src";
import { kmdice } from "./config";

const logs = "kmdrpc:test";
const debug = d(`${logs}:start-chain-with-log`);
d.enable(`${logs}:*`);

function wait(delay) {
  return new Promise(resovle => {
    setTimeout(resovle, delay);
  });
}

(async () => {
  const application = "Agama";
  const { coin, args } = kmdice;

  try {
    // Step 1: create application
    const api = KomodoRPC(application);

    // Step 2: start the chain
    debug(`start ${coin} chain`);
    const komodod = await api.startDaemon(coin);
    const cpResult = await komodod.start({
      logs: true,
      args
    });

    debug(`cpResult = ${JSON.stringify(cpResult)}`);

    komodod.on("exit", (code, signal) => {
      debug(`child process terminated due to receipt of signal ${signal}`);
      setTimeout(() => {
        process.exit(0);
      }, 2000);
    });

    // Step 3: wait until ready
    debug(`waiting until ${coin} ready`);
    const waitUntilReady = await komodod.waitUntilReady();
    debug(`waitUntilReady = ${JSON.stringify(waitUntilReady)}`);

    debug(`waiting in 30s`);
    await wait(30 * 1000);

    const getLog = await komodod.getLog();
    debug(`getLog = ${getLog}`);

    const getErrorLog = await komodod.getErrorLog();
    debug(`getErrorLog = ${getErrorLog}`);

    // Step 4: stop daemon
    if (komodod.isRunning() === true) {
      const rs = await komodod.stop();
      debug(`rs.ok === done = ${rs.ok === "done"}`);
    }
  } catch (err) {
    debug(err.message);
    setTimeout(() => {
      process.exit(1);
    }, 2000);
  }
})();
