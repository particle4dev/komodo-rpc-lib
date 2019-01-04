// @flow

import path from "path";
import os from "os";

export function getCurrentWorkingDirectory(): string {
  return process.cwd();
}

export function getNodeModulePath(): string {
  return path.normalize(path.join(__dirname, "..", ".."));
}

export function getBinPath(
  nodeModulePath: string = getCurrentWorkingDirectory()
): string {
  return path.join(nodeModulePath, "bin");
}

export function getKomodod(
  bin: string = getBinPath(),
  platform: string = os.platform()
): string {
  const exe = "komodod";
  if (platform === "darwin") {
    return path.join(bin, "mac", exe);
  }
  if (platform === "linux") {
    return path.join(bin, "linux", exe);
  }
  if (platform === "win32") {
    return path.join(bin, "win", exe);
  }
  return "";
}

export function getKomodoCLI(
  bin: string = getBinPath(),
  platform: string = os.platform()
): string {
  const exe = "komodo-cli";
  if (platform === "darwin") {
    return path.join(bin, "mac", exe);
  }
  if (platform === "linux") {
    return path.join(bin, "linux", exe);
  }
  if (platform === "win32") {
    return path.join(bin, "win", exe);
  }
  return "";
}
