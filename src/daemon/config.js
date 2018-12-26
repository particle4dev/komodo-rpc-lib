// @flow
import fs from "fs";
import readline from "readline";
import { getKomodoPath } from "../paths";
import type { StateType } from "./schema";

const debug = require("debug")("kmdrpc:daemon:config");

export default function configFactory(state: StateType) {
  debug(`setup config for ${state.coin}`);
  return {
    getConfigFile(komodoPath: string = getKomodoPath()) {
      const coin = this.getCoin();
      return coin !== "komodo"
        ? `${komodoPath}/${coin}/${coin}.conf`
        : `${komodoPath}/komodo.conf`;
    },
    getConfig(): Promise<any> {
      const config = this.getConfigFile();
      return new Promise(async (resolve, reject) => {
        if (!fs.existsSync(config)) {
          reject(new Error(`not found config file in ${config}`));
        } else {
          const result = {};
          const lineReader = readline.createInterface({
            input: fs.createReadStream(config)
          });

          lineReader.on("line", line => {
            if (line && line.length > 0) {
              const [v1, v2] = line.split("=");
              result[v1] = v2;
            }
          });

          lineReader.on("close", () => {
            resolve(result);
          });
        }
      });
    },
    getApplicationName() {
      return state.applicationName;
    },
    getCoin() {
      return state.coin;
    },
    getKomodoDir() {
      throw new Error("not implement yet");
    }
  };
}
