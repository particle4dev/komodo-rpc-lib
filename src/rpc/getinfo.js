/* eslint-disable no-param-reassign */
// @flow
// @doc
// https://developers.komodoplatform.com/basic-docs/komodo-api/control.html#getinfo
import callRPC from "./callRPC";

type RPCType = {
  cli?: string,
  coin: string,
  args?: Object
};

export function getInfo(config: RPCType): Promise<any> {
  // $FlowIgnore: suppressing this error
  config.action = "getinfo";
  // $FlowIgnore: suppressing this error
  return callRPC(config);
}

export default function getInfoFactory() {}
/* eslint-enable no-param-reassign */
