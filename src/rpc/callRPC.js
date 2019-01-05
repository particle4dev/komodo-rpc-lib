// @flow
import { execFile } from "child_process";
import { getKomodoCLI } from "../paths";

type CallRPCType = {
  cli: string,
  coin: string,
  action: string,
  args?: Object
};

type RPCType = {
  cli?: string,
  coin: string,
  action: string,
  args?: Object
};

type OptionsInfo = {
  bin: string
};

export function rpc(config: CallRPCType): Promise<any> {
  const { cli, coin, action, args } = config;
  const argsRun = [];
  argsRun.push(`-ac_name=${coin}`);
  argsRun.push(action);
  if (args) {
    argsRun.push(JSON.stringify(args));
  }

  return new Promise(async (resovle, reject) => {
    // execFile(cli, argsRun, (error, stdout, stderr) => {
    execFile(cli, argsRun, (error, stdout) => {
      if (error) {
        reject(error);
      } else {
        resovle(stdout);
      }
    });
  });
}

export default function rpcFactory(options: OptionsInfo) {
  return (config: RPCType): Promise<any> => {
    if (!config.cli) {
      // eslint-disable-next-line no-param-reassign
      config.cli = getKomodoCLI(options.bin);
    }
    // $FlowIgnore: suppressing this error
    return rpc(config);
  };
}
