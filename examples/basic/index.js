const path = require("path");
const os = require("os");
const KomodoRPC = require("kmd-rpc").default;

function getNodeModulePath() {
  return path.normalize(path.join(__dirname));
}

function getBinPath(
  nodeModulePath = getNodeModulePath()
) {
  return path.join(nodeModulePath, "bin");
}


const debug = require("debug")("kmdrpc:test:start-kmdice");

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
    const api = KomodoRPC(application, {
      bin: getBinPath()
    });

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
