// @flow

import configFactory from "./config";
import type { StateType } from "./schema";

const debug = require("debug")("kmdrpc:daemon:index");

export default function startDaemon(coin: string) {
  debug(`initializing ${coin}`);
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
