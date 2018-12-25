import { KomodoRPC } from "../src";

const debug = require("debug")("kmdrpc:test");

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
  // komodod -pubkey=c88a033b587244cd501e90709620c3ec58d9c3886e33c2e1db909d0451aa5833 -ac_name=COQUI -ac_supply=72000000 -ac_ccactivate=200000 -addnode=78.47.196.146 $1 &
  // const coin = "COQUI";
  // const args = {
  //   pubkey:
  //     "c88a033b587244cd501e90709620c3ec58d9c3886e33c2e1db909d0451aa5833",
  //   ac_supply: 72000000,
  //   ac_ccactivate: 200000,
  //   addnode: "78.47.196.146 "
  // };
  try {
    // Step 1: create application
    const api = KomodoRPC(application);

    // Step 2: start the chain
    const komodod = await api.startDaemon(coin);
    const samekomodod = await api.startDaemon(coin);

    debug(`komodod === samekomodod = ${samekomodod === komodod}`);

    const childProcess = await komodod.start({
      args
    });

    // add event via childProcess
    childProcess.on("exit", (code, signal) => {
      debug(`child process terminated due to receipt of signal ${signal}`);
    });

    // add event via darmon
    komodod.on("exit", (code, signal) => {
      debug(`child process terminated due to receipt of signal ${signal}`);
      setTimeout(() => {
        process.exit(0);
      }, 2000);
    });

    // Step 3: wait in 30s
    const isReady = await komodod.isReady();
    debug(`isReady = ${JSON.stringify(isReady)}`);
    const waitUntilReady = await komodod.waitUntilReady();
    debug(`waitUntilReady = ${JSON.stringify(waitUntilReady)}`);

    // Step 4: call rpc (komodo cli)

    // const help = await api.rpc({
    //   coin,
    //   action: "help"
    // });
    // debug(`help = ${help}`);
    const info = await komodod.getInfo();
    debug(`info = ${info}`);
    // const info = await api.getInfo({
    //   coin
    // });
    // debug(`info = ${info}`);
    // const info = await komodod.rpc({
    //   action: "getinfo"
    // });
    // debug(`info = ${info}`);
    // const info = await api.rpc({
    //   coin,
    //   action: "getinfo"
    // });
    // debug(`info = ${info}`);

    const getnewaddress = await api.rpc({
      coin,
      action: "getnewaddress"
    });
    debug(`getnewaddress = ${getnewaddress}`);

    const getaddressbalance = await api.rpc({
      coin,
      action: "getaddressbalance",
      args: {
        addresses: ["RLC7XBJYemEeJxCcocj2vjDTcyuS5uFdJw"]
      }
    });
    debug(`getaddressbalance = ${getaddressbalance}`);

    const validateaddress = await api.rpc({
      coin,
      action: "validateaddress",
      args: [getnewaddress]
    });
    debug(`validateaddress = ${validateaddress}`);

    // const unavailable = await api.rpc({
    //   coin,
    //   action: "unavailable"
    // });
    // debug(`unavailable = ${unavailable}`);

    // Step 5: stop daemon
    if (komodod.isRunning() === true) {
      // const rs = await komodod.stop();
      // or
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
