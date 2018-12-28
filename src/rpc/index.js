// @flow
import callRPC from "./callRPC";
import { getInfo } from "./getinfo";
import { stop } from "./stop";

export default function rpcFactory() {
  return {
    rpc: callRPC,
    getInfo,
    stop
  };
}
