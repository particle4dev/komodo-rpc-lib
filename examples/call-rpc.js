/**
 * Use KomodoRPC to start KMDICE chain and call rpc
 * How to run:
 *
 *     $ npm run devtest -- examples/call-rpc.js
 */

import KomodoRPC from "../src";
import { kmdice } from "./config";

const debug = require("debug")("kmdrpc:test:call-rpc");

(async () => {
  const application = "Agama";
  const { coin, args } = kmdice;
  try {
    // Step 1: create application
    const api = KomodoRPC(application);

    // Step 2: start the chain
    const komodod = await api.startDaemon(coin);

    const cpResult = await komodod.start({
      args
    });

    debug(`cpResult = ${JSON.stringify(cpResult)}`);

    // add event via darmon
    komodod.on("exit", (code, signal) => {
      debug(`child process terminated due to receipt of signal ${signal}`);
      setTimeout(() => {
        process.exit(0);
      }, 2000);
    });

    // Step 3: wait until ready
    const waitUntilReady = await komodod.waitUntilReady();
    debug(`waitUntilReady = ${JSON.stringify(waitUntilReady)}`);

    // Step 4: call rpc (komodo cli)

    const info = await komodod.getInfo();
    debug(`info = ${info}`);

    const getnewaddress = await api.rpc({
      coin,
      action: "getnewaddress"
    });
    debug(`getnewaddress = ${getnewaddress}`);

    const getaddressbalance = await komodod.rpc({
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
      const rs = await api.stop({
        coin
      });
      debug(`rs = ${rs}`);
    }
  } catch (err) {
    debug(err.message);
    setTimeout(() => {
      process.exit(1);
    }, 2000);
  }
})();
