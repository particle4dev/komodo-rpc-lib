// @flow

import split2 from "split2";
import { execFile } from "child_process";
import { getKomodod } from "../paths";
import killProcess from "./killprocess";
import type { StateType } from "./schema";

const debug = require("debug")("kmdrpc:daemon:control");

type StartType = {
  komodod: string
};

export default function controlFactory(state: StateType) {
  debug(`setup control for ${state.coin}`);
  let childProcess = null;
  return {
    start(
      config: StartType = {
        komodod: getKomodod()
      }
    ): Promise<any> {
      debug(`start komodod for ${state.coin}`);
      // return new Promise(async (resovle, reject) => {
      return new Promise(async resovle => {
        await this.stop();
        childProcess = execFile(
          config.komodod,
          [
            `-ac_name=${this.getCoin()}`,
            "-pubkey=035178457d4bcab8e221ddbc2cf3814bf704bb261be50f8f0e31b5fbf55cd77310",
            "-ac_supply=10500000",
            "-ac_reward=2500000000",
            "-ac_halving=210000",
            "-ac_cc=2",
            "-addressindex=1",
            "-spentindex=1",
            "-addnode=144.76.217.232"
          ],
          {
            maxBuffer: 1024 * 1000000 // 1000 mb
          }
          // (error, stdout, stderr) => {
          // callback <Function> Called with the output when process terminates.
          // }
        );
        // The 'error' event is emitted whenever:
        //  The process could not be spawned, or
        //   The process could not be killed, or
        //  Sending a message to the child process failed.
        childProcess.on("error", error => {
          debug(error.message);
          throw error;
        });
        childProcess.stdout.setEncoding("utf8");
        childProcess.stdout.pipe(split2()).on("data", data => debug(data));

        childProcess.stderr.setEncoding("utf8");
        childProcess.stderr.pipe(split2()).on("data", data => debug(data));
        resovle(childProcess);
      });
    },
    stop(): Promise<any> {
      debug(`stop komodod for ${state.coin}`);
      // return new Promise((resovle, reject) => {
      return new Promise(resovle => {
        if (childProcess) {
          childProcess.kill();
        }

        childProcess = null;
        killProcess("komodod");
        resovle({
          ok: "done"
        });
      });
    },
    isRunning(): boolean {
      return !!childProcess;
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
