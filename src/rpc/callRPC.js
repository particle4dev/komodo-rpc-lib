// @flow
import { execFile } from "child_process";
import { getKomodoCLI } from "../paths";
import isObject from "../utils/isObject";

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

function covertObjectToParams(params: Object) {
  return Object.keys(params).map(key =>
    params[key] ? `-${key}=${params[key]}` : `-${key}`
  );
}

// function covertArrayToParams(params: Array<*>) {}

export function rpc(config: CallRPCType): Promise<any> {
  const { cli, coin, action, args } = config;
  let argsRun = [];
  argsRun.push(`-ac_name=${coin}`);
  argsRun.push(action);
  if (Array.isArray(args)) {
    argsRun = argsRun.concat(args);
  } else if (isObject(args)) {
    argsRun = argsRun.concat(covertObjectToParams(args));
  } else if (typeof args === "string") argsRun.push(args);
  else if (args) argsRun.push(JSON.stringify(args));

  return new Promise(async (resolve, reject) => {
    // execFile(cli, argsRun, (error, stdout, stderr) => {
    execFile(cli, argsRun, (error, stdout) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
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
