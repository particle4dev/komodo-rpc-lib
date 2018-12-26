// @flow
import type { StateType } from "./schema";

const debug = require("debug")("kmdrpc:daemon:config");

export default function configFactory(state: StateType) {
  debug(`setup config for ${state.coin}`);
  return {
    getConfig() {
      throw new Error("not implement yet");
    },
    getApplicationName() {
      return state.applicationName;
    },
    getCoin() {
      return state.coin;
    },
    getKomodoDir() {
      throw new Error("not implement yet");
    }
  };
}
