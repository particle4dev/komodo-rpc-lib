// @flow

import callRPCFactory from "./callRPC";
import { getInfo } from "./getinfo";
import { stop } from "./stop";
import type { RPCType } from "./schema";

type OptionsInfo = {
  bin: string
};

export default function rpcFactory(options: OptionsInfo): RPCType {
  return Object.assign(
    {},
    {
      rpc: callRPCFactory(options),
      getInfo,
      stop
    }
  );
}
