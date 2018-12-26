// @flow
import daemonFactory from "./daemon";
import rpcFactory from "./rpc";

/**
 * This function says hello.
 * @param name Some name to say hello for.
 * @returns The hello.
 */

// const sayHello = (name: string = "Haz"): string => `Hello, ${name}!`;

const debug = require("debug")("kmdrpc:index");

export function KomodoRPC(applicationName: string) {
  return Object.assign({}, daemonFactory(applicationName), rpcFactory());
}

export default function setup() {
  debug("setup KomodoRPC");
}
