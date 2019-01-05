/* eslint-disable no-param-reassign */
// @flow
// @doc
// https://developers.komodoplatform.com/basic-docs/komodo-api/control.html#getinfo
import { rpc as callRPC } from "./callRPC";
import { getKomodoCLI } from "../paths";

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

type RPCTypeFactory = {
  cli?: string,
  action: string,
  coin?: string,
  args?: Object
};

export default function getInfoFactory(options: {
  bin: string,
  coin?: string
}) {
  const { coin, bin } = options;
  return {
    getInfo(config: RPCTypeFactory = {}): Promise<any> {
      if (!config.cli) {
        // eslint-disable-next-line no-param-reassign
        config.cli = getKomodoCLI(bin);
      }
      config.action = "getinfo";
      if (coin) {
        config.coin = coin;
      }
      // $FlowIgnore: suppressing this error
      return callRPC(config);
    }
  };
}
/* eslint-enable no-param-reassign */
