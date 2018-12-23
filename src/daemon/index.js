// @flow

import configFactory from "./config";
import type { StateType } from "./schema";

const debug = require("debug")("kmdrpc:daemon:index");

export function Daemon(coin: string) {
  const state: StateType = {
    coin
  };
  return Object.assign(
    {},
    {
      quit() {}
    },
    configFactory(state)
  );
}

export default function daemonFactory() {
  return {
    startDaemon(coin: string) {
      debug(`initializing ${coin}`);
    },
    stopDaemon(coin: string) {
      debug(`stop ${coin}`);
    }
  };
}
