// @flow

import fs from "fs";
import split2 from "split2";
import { spawn } from "child_process";
import chainDefaultParams from "../data/chainDefaultParams.json";
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
  detached?: boolean,
  args: ParamsType
};

type StopType = {
  force: boolean
};

function flatten(arr) {
  return arr.reduce(
    (flat, toFlatten) =>
      flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten),
    []
  );
}

export default function controlFactory(state: StateType) {
  debug(`setup control for ${state.coin}`);
  let childProcess = null;
  return {
    addDefaultParams(args: ParamsType): Array<any> {
      const params = Object.assign(
        {},
        args,
        chainDefaultParams[this.getCoin()]
      );
      const argsParam = Object.keys(params)
        .map(key => {
          if (key === "addnode" && Array.isArray(params[key])) {
            return params[key].map(v => `-addnode=${v}`);
          }
          return params[key] ? `-${key}=${params[key]}` : null;
        })
        .filter(v => v !== null);
      argsParam.push(`-ac_name=${this.getCoin()}`);

      return flatten(argsParam);
    },
    start(config: StartType): Promise<any> {
      debug(`start komodod for ${state.coin}`);
      // eslint-disable-next-line prefer-const
      const { komodod, args } = config;
      let komododFile = komodod;
      if (!komododFile) {
        komododFile = getKomodod();
      }
      const argsParam = this.addDefaultParams(args);
      // silent mod
      // argsParam.push('&');

      // eslint-disable-next-line consistent-return
      return new Promise(async (resolve, reject) => {
        try {
          // HOW TO DETECT IF PROCESS SPAWNED SUCCESSFULLY
          // https://github.com/nodejs/help/issues/1191
          // $FlowIgnore: suppressing this error
          if (childProcess && !childProcess.killed) {
            debug("child process is really started");
            return resolve({
              ok: "done"
            });
          }

          const options = {};
          if (config.detached) {
            options.detached = true;
          }

          // https://github.com/facebook/flow/issues/740
          // $FlowIgnore: suppressing this error
          childProcess = spawn(komododFile, argsParam, options);

          // https://nodejs.org/api/child_process.html#child_process_subprocess_unref
          if (config.detached) {
            childProcess.unref();
          }

          childProcess.on("error", error => {
            debug(error.message);
            reject(error);
          });

          childProcess.stdout.setEncoding("utf8");
          childProcess.stdout
            .pipe(split2())
            .on("data", data => debug(`LOG: ${data}`));
          if (config.logs) {
            const logStream = fs.createWriteStream(this.getLogFile(), {
              flags: "w"
            });
            childProcess.stdout.pipe(logStream);
          }

          childProcess.stderr.setEncoding("utf8");
          childProcess.stderr
            .pipe(split2())
            .on("data", data => debug(`ERROR: ${data}`));
          if (config.logs) {
            const errorLogStream = fs.createWriteStream(
              this.getErrorLogFile(),
              {
                flags: "w"
              }
            );
            childProcess.stderr.pipe(errorLogStream);
          }

          childProcess.on("exit", (code, signal) => {
            debug(
              `child process terminated due to receipt of signal ${signal} and code ${code}`
            );
            childProcess = null;
          });

          if (typeof childProcess.pid === "number") {
            resolve({
              ok: "done"
            });
          }
        } catch (err) {
          debug(err.message);
          reject(err);
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
          reject(new Error("Giving up trying to connect to komodod"));
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
