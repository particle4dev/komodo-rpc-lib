// @flow

import ConfigManager from "../utils/config-manager";
import configFactory from "./config";
import controlFactory from "./control";
import type { StateType } from "./schema";

const debug = require("debug")("kmdrpc:daemon:index");

export function Daemon(coin: string) {
  debug(`initializing ${coin}`);
  const state: StateType = {
    coin
  };
  return Object.assign({}, controlFactory(state), configFactory(state));
}

export default function daemonFactory() {
  const state = ConfigManager();
  return {
    startDaemon(coin: string) {
      // step one: find coin in state manager
      let d = state.get(coin);
      // step two: if found, return it
      if (d) return d;
      // step three: if not found, start daemon
      d = Daemon(coin);
      // step four: register it in state
      state.set(coin, d);
      // step five: return it
      return d;
    },
    stopDaemon(coin: string) {
      debug(`stop ${coin}`);
    }
  };
}
