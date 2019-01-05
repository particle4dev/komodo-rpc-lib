// @flow
import daemonFactory from "./daemon";
import rpcFactory from "./rpc";

/**
 * This function says hello.
 * @param name Some name to say hello for.
 * @returns The hello.
 */

type OptionsInfo = {
  bin: string
};

const debug = require("debug")("kmdrpc:index");

export default function KomodoRPC(
  applicationName: string,
  options: OptionsInfo
) {
  debug(`creating ${applicationName} application`);
  return Object.assign(
    {},
    daemonFactory(applicationName, options),
    rpcFactory(options)
  );
}
