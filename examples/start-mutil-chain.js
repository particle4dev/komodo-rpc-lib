/**
 * Use KomodoRPC to start COQUI and KMDICE chain
 * How to run:
 *
 *     $ npm run devtest -- examples/start-mutil-chain.js
 */

import KomodoRPC from "../src";
import { coqui, kmdice, getBinPath } from "./config";

const debug = require("debug")("kmdrpc:test:start-mutil-chain");

// function wait(delay) {
//   return new Promise(resovle => {
//     setTimeout(resovle, delay);
//   });
// }

(async () => {
  const application = "Agama";

  const kmdiceCoin = kmdice.coin;
  const kmdiceargs = kmdice.args;
  const coquiCoin = coqui.coin;
  const coquiargs = coqui.args;

  let i = 0;

  function end(code, signal) {
    debug(`child process terminated due to receipt of signal ${signal}`);
    i += 1;
    setTimeout(() => {
      if (i >= 2) {
        process.exit(0);
      }
    }, 2000);
  }
  try {
    // Step 1: create application
    const api = KomodoRPC(application, {
      bin: getBinPath()
    });

    // Step 2: start the chain
    const kmdiced = await api.startDaemon(kmdiceCoin);

    await kmdiced.start({
      args: kmdiceargs
    });

    const coquid = await api.startDaemon(coquiCoin);
    await coquid.start({
      args: coquiargs
    });

    // add event via darmon
    kmdiced.on("exit", end);
    coquid.on("exit", end);

    // Step 3: wait until ready
    const kmdicedReady = await kmdiced.waitUntilReady();
    debug(`kmdicedReady = ${JSON.stringify(kmdicedReady)}`);

    const coquidReady = await coquid.waitUntilReady();
    debug(`coquidReady = ${JSON.stringify(coquidReady)}`);

    const infoKmdiced = await kmdiced.getInfo();
    debug(`infoKmdiced = ${infoKmdiced}`);

    const infoCoquid = await coquid.getInfo();
    debug(`infoCoquid = ${infoCoquid}`);

    // Step 4: stop daemon
    let rs = null;
    if (kmdiced.isRunning() === true) {
      rs = await kmdiced.stop();
      debug(`rs.ok === done = ${rs.ok === "done"}`);
    }

    if (coquid.isRunning() === true) {
      rs = await coquid.stop();
      debug(`rs.ok === done = ${rs.ok === "done"}`);
    }
  } catch (err) {
    debug(err.message);
    setTimeout(() => {
      process.exit(1);
    }, 2000);
  }
})();
