import { KomodoRPC } from "../src";

const debug = require("debug")("kmdrpc:test:readConfig");

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

    const childProcess = await komodod.start({
      args
    });

    // add event via childProcess
    childProcess.on("exit", (code, signal) => {
      debug(`child process terminated due to receipt of signal ${signal}`);
      setTimeout(() => {
        process.exit(0);
      }, 2000);
    });

    // Step 3: wait until ready
    const config = await komodod.getConfig();
    debug(`config = ${JSON.stringify(config)}`);

    // Step 4: stop daemon
    if (komodod.isRunning() === true) {
      const rs = await api.stopDaemon(coin);
      debug(`rs.ok === done = ${rs.ok === "done"}`);
    }
  } catch (err) {
    debug(JSON.stringify(err));
    setTimeout(() => {
      process.exit(1);
    }, 2000);
  }
})();
