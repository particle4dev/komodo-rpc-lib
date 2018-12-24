// @flow
import { execFileSync } from "child_process";

export default function killProcess(name: string) {
  try {
    if (process.platform === "win32") {
      execFileSync("taskkill", ["/f", "/im", `${name}.exe`]);
    } else {
      execFileSync("killall", ["-9", name]);
    }
    // eslint-disable-next-line no-empty
  } catch (_) {}
}
