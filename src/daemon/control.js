// @flow
import type { StateType } from "./schema";

const debug = require("debug")("kmdrpc:daemon:control");

export default function controlFactory(state: StateType) {
  debug(`setup control for ${state.coin}`);
  return {
    quit() {}
  };
}
