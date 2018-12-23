// @flow
import daemonFactory from "./daemon";

/**
 * This function says hello.
 * @param name Some name to say hello for.
 * @returns The hello.
 */

// const sayHello = (name: string = "Haz"): string => `Hello, ${name}!`;

// const debug = require("debug")("kmdrpc:index");

export function KomodoRPC() {
  return Object.assign({}, daemonFactory());
}

export default function setup() {}
