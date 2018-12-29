// @flow

import fs from "fs";
import split2 from "split2";
import { spawn } from "child_process";
import { getKomodod } from "../paths";
import { stop } from "../rpc/stop";
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
  logs?: boolean,
  ignore?: boolean,
  args: ParamsType
};

type StopType = {
  force: boolean
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
      // silent mod
      // argsParam.push('&');

      return new Promise(async (resolve, reject) => {
        // HOW TO DETECT IF PROCESS SPAWNED SUCCESSFULLY
        // https://github.com/nodejs/help/issues/1191
        //
        const isReady = await this.isReady();

        // console.log(isReady, "isReady");
        if (!config.ignore && isReady.ok === "done") {
          await this.stop({
            force: true
          });
        }
        // https://github.com/facebook/flow/issues/740
        // $FlowIgnore: suppressing this error
        childProcess = spawn(komododFile, argsParam);
        childProcess.on("error", error => {
          debug(error.message);
          reject(error);
        });

        const logStream = fs.createWriteStream(this.getLogFile(), {
          flags: "w"
        });
        const errorLogStream = fs.createWriteStream(this.getErrorLogFile(), {
          flags: "w"
        });

        childProcess.stdout.setEncoding("utf8");
        childProcess.stdout
          .pipe(split2())
          .on("data", data => debug(`LOG: ${data}`));
        if (config.logs) {
          childProcess.stdout.pipe(logStream);
        }

        childProcess.stderr.setEncoding("utf8");
        childProcess.stderr
          .pipe(split2())
          .on("data", data => debug(`ERROR: ${data}`));
        if (config.logs) {
          childProcess.stderr.pipe(errorLogStream);
        }

        if (typeof childProcess.pid === "number") {
          resolve({
            ok: "done"
          });
        }
      });
    },
    stop(
      config: StopType = {
        force: false
      }
    ): Promise<any> {
      debug(`stop komodod for ${state.coin}`);
      // return new Promise((resolve, reject) => {
      return new Promise(resolve => {
        if (childProcess) {
          childProcess.kill();
        }

        childProcess = null;
        if (config.force) {
          stop({
            coin: state.coin
          });
        }
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
