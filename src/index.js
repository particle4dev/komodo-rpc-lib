// @flow
import daemonFactory from "./daemon";
import rpcFactory from "./rpc";

/**
 * This function says hello.
 * @param name Some name to say hello for.
 * @returns The hello.
 */

const debug = require("debug")("kmdrpc:index");

export default function KomodoRPC(applicationName: string) {
  debug(`creating ${applicationName} application`);
  return Object.assign({}, daemonFactory(applicationName), rpcFactory());
}
