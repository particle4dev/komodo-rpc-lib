// @flow

import split2 from "split2";
import { execFile } from "child_process";
import { getKomodod } from "../paths";
import killProcess from "./killprocess";
import type { StateType } from "./schema";

const debug = require("debug")("kmdrpc:daemon:control");

const TIMEOUT = 60 * 1000;

type ParamsType = {
  ac_supply: number,
  addnode: string,
  pubkey?: string
};

type StartType = {
  komodod?: string,
  args: ParamsType
};

export default function controlFactory(state: StateType) {
  debug(`setup control for ${state.coin}`);
  let childProcess = null;
  return {
    start(config: StartType): Promise<any> {
      debug(`start komodod for ${state.coin}`);
      // eslint-disable-next-line prefer-const
      const { komodod, args } = config;
      let komododFile = komodod;
      if (!komododFile) {
        komododFile = getKomodod();
      }
      const argsParam = Object.keys(args)
        .map(key => (args[key] ? `-${key}=${args[key]}` : null))
        .filter(v => v !== null);
      argsParam.push(`-ac_name=${this.getCoin()}`);

      return new Promise(async (resolve, reject) => {
        // HOW TO DETECT IF PROCESS SPAWNED SUCCESSFULLY
        // https://github.com/nodejs/help/issues/1191
        //
        await this.stop();
        // https://github.com/facebook/flow/issues/740
        // $FlowIgnore: suppressing this error
        childProcess = execFile(komododFile, argsParam, {
          maxBuffer: 1024 * 1000000 // 1000 mb
        });
        childProcess.on("error", error => {
          debug(error.message);
          reject(error);
        });
        childProcess.stdout.setEncoding("utf8");
        childProcess.stdout.pipe(split2()).on("data", data => debug(data));

        childProcess.stderr.setEncoding("utf8");
        childProcess.stderr.pipe(split2()).on("data", data => debug(data));
        if (typeof childProcess.pid === "number") {
          resolve(childProcess);
        }
      });
    },
    stop(): Promise<any> {
      debug(`stop komodod for ${state.coin}`);
      // return new Promise((resolve, reject) => {
      return new Promise(resolve => {
        if (childProcess) {
          childProcess.kill();
        }

        childProcess = null;
        killProcess("komodod");
        resolve({
          ok: "done"
        });
      });
    },
    isRunning(): boolean {
      return !!childProcess;
    },
    isReady(): Promise<any> {
      return new Promise(async resolve => {
        try {
          await this.getInfo();
          resolve({
            ok: "done"
          });
        } catch (err) {
          debug(err.message);
          resolve({
            ok: "failed"
          });
        }
      });
    },
    waitUntilReady(time: number = TIMEOUT): Promise<any> {
      return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
          try {
            await this.getInfo();
            clearInterval(interval);
            resolve({
              ok: "done"
            });
            // eslint-disable-next-line no-empty
          } catch (_) {}
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          reject(new Error("Giving up trying to connect to marketmaker"));
        }, time);
      });
    },
    on(event: string, callback: Function): null {
      debug(`add ${event} event for ${state.coin}`);
      if (childProcess) {
        childProcess.on(event, callback);
      }
      return null;
    }
  };
}
