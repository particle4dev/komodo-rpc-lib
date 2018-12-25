/* eslint-disable no-param-reassign */

// @flow
import callRPC from "../rpc/callRPC";
import getinfoFactory from "../rpc/getinfo";
import type { StateType } from "./schema";

const debug = require("debug")("kmdrpc:daemon:rpc");

type RPCType = {
  cli?: string,
  action: string,
  args?: Object
};

export default function rpcFactory(state: StateType) {
  debug(`setup config for ${state.coin}`);
  // $FlowIgnore: suppressing this error
  return Object.assign(
    {
      rpc(config: RPCType): Promise<any> {
        // $FlowIgnore: suppressing this error
        config.coin = state.coin;
        // $FlowIgnore: suppressing this error
        return callRPC(config);
      }
    },
    getinfoFactory(state.coin)
  );
}
/* eslint-enable no-param-reassign */
