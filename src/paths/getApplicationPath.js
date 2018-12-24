// @flow
import os from "os";
import path from "path";

export function getApplicationOSPath(platform: string = os.platform()): string {
  if (platform === "darwin") {
    return process.env.HOME
      ? path.normalize(`${process.env.HOME}/Library/Application Support`)
      : "";
  }
  if (platform === "linux") {
    return process.env.HOME ? path.normalize(`${process.env.HOME}`) : "";
  }
  if (platform === "win32") {
    return process.env.APPDATA ? path.normalize(`${process.env.APPDATA}`) : "";
  }
  return "";
}

export default function getApplicationPath(
  application: string,
  home: string = getApplicationOSPath()
): string {
  return path.normalize(`${home}/${application}`);
}
