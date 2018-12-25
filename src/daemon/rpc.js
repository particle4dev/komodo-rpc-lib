/* eslint-disable no-param-reassign */

// @flow
import callRPC from "../rpc/callRPC";
import type { StateType } from "./schema";

const debug = require("debug")("kmdrpc:daemon:rpc");

type RPCType = {
  cli?: string,
  action: string,
  args?: Object
};

export default function rpcFactory(state: StateType) {
  debug(`setup config for ${state.coin}`);
  return {
    rpc(config: RPCType): Promise<any> {
      // $FlowIgnore: suppressing this error
      config.coin = state.coin;
      // $FlowIgnore: suppressing this error
      return callRPC(config);
    }
  };
}
/* eslint-enable no-param-reassign */
