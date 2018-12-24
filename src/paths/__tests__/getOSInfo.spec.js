import getOSInfo from "../getOSInfo";

const data = {
  arch: "x64",
  cpu: "Intel(R) Core(TM) i5-3210M CPU @ 2.50GHz",
  cpuCores: 4,
  osRelease: "18.0.0",
  osType: "Darwin",
  platform: "darwin",
  totalmemBytes: 8589934592,
  totalmemReadable: "8.59 GB"
};

const os = {
  totalmem() {
    return data.totalmemBytes;
  },
  arch() {
    return data.arch;
  },
  cpus() {
    return [
      {
        model: "Intel(R) Core(TM) i5-3210M CPU @ 2.50GHz",
        speed: 2500,
        times: { user: 8927160, nice: 0, sys: 5161820, idle: 33443910, irq: 0 }
      },
      {
        model: "Intel(R) Core(TM) i5-3210M CPU @ 2.50GHz",
        speed: 2500,
        times: { user: 5045200, nice: 0, sys: 2082460, idle: 40397400, irq: 0 }
      },
      {
        model: "Intel(R) Core(TM) i5-3210M CPU @ 2.50GHz",
        speed: 2500,
        times: { user: 9013630, nice: 0, sys: 4087370, idle: 34424080, irq: 0 }
      },
      {
        model: "Intel(R) Core(TM) i5-3210M CPU @ 2.50GHz",
        speed: 2500,
        times: { user: 4879750, nice: 0, sys: 1855080, idle: 40790210, irq: 0 }
      }
    ];
  },
  platform() {
    return data.platform;
  },
  release() {
    return data.osRelease;
  },
  type() {
    return data.osType;
  }
};

describe("src/path/getOSInfo", () => {
  it("getOSInfo", () => {
    expect(getOSInfo(os)).toEqual(data);
    expect(
      getOSInfo(
        Object.assign(os, {
          totalmem() {
            return 0;
          }
        })
      )
    ).toEqual(
      Object.assign({}, data, {
        totalmemBytes: 0,
        totalmemReadable: "0 Bytes"
      })
    );
  });
});
