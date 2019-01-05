// @flow

import callRPCFactory from "./callRPC";
import getInfoFactory from "./getinfo";
import stopFactory from "./stop";
import type { RPCType } from "./schema";

type OptionsInfo = {
  bin: string
};

export default function rpcFactory(options: OptionsInfo): RPCType {
  return Object.assign(
    {},
    {
      rpc: callRPCFactory(options)
    },
    getInfoFactory({
      bin: options.bin
    }),
    stopFactory({
      bin: options.bin
    })
  );
}
