// @flow
import os from "os";

const formatBytes = (bytes, decimals) => {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const k = 1000;
  const dm = decimals + 1 || 3;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

type OSInfo = {
  cpuCores: number,
  totalmemBytes: number
};

export default function getOSInfo(system: Object = os): OSInfo {
  return {
    totalmemBytes: system.totalmem(),
    totalmemReadable: formatBytes(system.totalmem()),
    arch: system.arch(),
    cpu: system.cpus()[0].model,
    cpuCores: system.cpus().length,
    platform: system.platform(),
    osRelease: system.release(),
    osType: system.type()
  };
}
