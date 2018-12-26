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

// https://github.com/KomodoPlatform/Agama/blob/master/routes/api/paths.js#L31
export function getKomodoPath(
  platform: string = os.platform(),
  home: string = getApplicationOSPath(os.platform())
): string {
  if (platform === "darwin") {
    return path.normalize(`${home}/Komodo`);
  }
  if (platform === "linux") {
    return path.normalize(`${home}/.komodo`);
  }
  if (platform === "win32") {
    return path.normalize(`${home}/Komodo`);
  }
  return "";
}

export function getApplicationPath(
  application: string,
  home: string = getApplicationOSPath()
): string {
  return path.normalize(`${home}/${application}`);
}
