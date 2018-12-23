// @flow
import KomodoRPC from "komodo-rpc";

let api = null;

function setup() {
  if (api) return api;

  api = KomodoRPC({
    
  });

  // start daemon
  const kmdd = api.startDaemon({
    coin: 'KMD'
  });

  // stop daemon 
  // kmdd.quit();
  // or
  // api.stopDaemon({
    // coin: 'KMD'
  // });

  return api;
}

export default setup();
