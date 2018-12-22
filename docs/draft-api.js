// @flow
import KomodoRPC from "komodo-rpc";

let api = null;

function setup() {
  if (api) return api;

  api = KomodoRPC({});

  return api;
}

export default setup();
