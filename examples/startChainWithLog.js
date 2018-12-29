import d from "debug";
import KomodoRPC from "../src";

const logs = "kmdrpc:test";
const debug = d(`${logs}:startChainWithLog`);
d.enable(`${logs}:*`);

function wait(delay) {
  return new Promise(resovle => {
    setTimeout(resovle, delay);
  });
}

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
