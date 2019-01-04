/**
 * Use KomodoRPC to start KMDICE chain and call rpc
 * How to run:
 *
 *     $ npm run devtest -- examples/app.js
 */
import d from "debug";
import KomodoRPC from "../src";
import { kmdice, getBinPath } from "./config";

const logs = "kmdrpc:test";
const debug = d(`${logs}:app`);
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
    debug("Step 1: create application");
    const app1 = KomodoRPC(application, {
      bin: getBinPath(),
    });
    const app2 = KomodoRPC(application, {
      bin: getBinPath(),
    });

    // Step 2: start the chain with api1
    debug("Step 2: start the chain with api1");
    const komodod1 = await app1.startDaemon(coin);

    let startResult1 = await komodod1.start({
      args
    });

    debug(`startResult1 = ${JSON.stringify(startResult1)}`);

    startResult1 = await komodod1.start({
      args
    });

    debug(`startResult1 = ${JSON.stringify(startResult1)}`);

    // add event via darmon
    komodod1.on("exit", (code, signal) => {
      debug(`child process 1 terminated due to receipt of signal ${signal}`);
    });

    // Step 3: wait until api1 ready'
    debug("Step 3: wait until api1 ready");
    const isReady1 = await komodod1.isReady();
    debug(`isReady1 = ${JSON.stringify(isReady1)}`);

    const waitUntilReady1 = await komodod1.waitUntilReady();
    debug(`waitUntilReady1 = ${JSON.stringify(waitUntilReady1)}`);

    // Step 4: start the chain with app2 but it will be failed
    debug("Step 4: start the chain with app2 but it will be failed");
    const komodod2 = await app2.startDaemon(coin);
    let startResult2 = await komodod2.start({
      args
    });
    debug(`startResult2 = ${JSON.stringify(startResult2)}`);

    // add event via darmon
    komodod2.on("exit", (code, signal) => {
      debug(`child process 2 terminated due to receipt of signal ${signal}`);
    });

    // Step 5: stop app1 daemon
    debug(`Step 5: stop app1 daemon`);
    debug(`wait in 15s`);
    await wait(15 * 1000);

    if (komodod1.isRunning() === true) {
      const rs = await komodod1.stop();
      debug(`rs.ok === done = ${rs.ok === "done"}`);
    }

    // Step 6: start daemon with komodod2
    debug(`Step 6: start daemon with komodod2`);
    debug(`komodod2.isRunning() === ${komodod2.isRunning()}`);
    debug(`wait in 15s`);
    await wait(15 * 1000);

    startResult2 = await komodod2.start({
      args
    });
    debug(`startResult2 = ${JSON.stringify(startResult2)}`);
    komodod2.on("exit", (code, signal) => {
      debug(`child process 2 terminated due to receipt of signal ${signal}`);
      setTimeout(() => {
        process.exit(0);
      }, 2000);
    });

    // Step 7: wait until ready
    const waitUntilReady2 = await komodod2.waitUntilReady();
    debug(`waitUntilReady2 = ${JSON.stringify(waitUntilReady2)}`);

    if (komodod2.isRunning() === true) {
      const rs2 = await app2.stopDaemon(coin);
      debug(`rs2.ok === done = ${rs2.ok === "done"}`);
    }
  } catch (err) {
    debug(err.message);
    setTimeout(() => {
      process.exit(1);
    }, 2000);
  }
})();
