// @flow
import callRPC from "./callRPC";
import { getInfo } from "./getinfo";

export default function rpcFactory() {
  return {
    rpc: callRPC,
    getInfo
  };
}
