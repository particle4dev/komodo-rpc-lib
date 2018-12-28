import { KomodoRPC } from "../src";

const debug = require("debug")("kmdrpc:test:startMutilChain");

// function wait(delay) {
//   return new Promise(resovle => {
//     setTimeout(resovle, delay);
//   });
// }

(async () => {
  const application = "Agama";
  const kmdice = "KMDICE";
  const kmdiceargs = {
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

  const coqui = "COQUI";
  const coquiargs = {
    pubkey: "c88a033b587244cd501e90709620c3ec58d9c3886e33c2e1db909d0451aa5833",
    ac_supply: 72000000,
    ac_ccactivate: 200000,
    addnode: "78.47.196.146"
  };

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
    const api = KomodoRPC(application);

    // Step 2: start the chain
    const kmdiced = await api.startDaemon(kmdice);

    await kmdiced.start({
      args: kmdiceargs
    });

    const coquid = await api.startDaemon(coqui);

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
    debug(JSON.stringify(err));
    setTimeout(() => {
      process.exit(1);
    }, 2000);
  }
})();
