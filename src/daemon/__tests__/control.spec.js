import path from "path";
import configFactory from "../config";
import controlFactory from "../control";

describe("src/daemon/control", () => {
  const state = {
    coin: "KMDICE",
    applicationName: "Agama"
  };

  const control = Object.assign(
    {},
    configFactory(state),
    controlFactory(state)
  );

  test("check methods", () => {
    expect(typeof control.addDefaultParams).toBe("function");
    expect(typeof control.start).toBe("function");
    expect(typeof control.stop).toBe("function");
    expect(typeof control.isRunning).toBe("function");
    expect(typeof control.isReady).toBe("function");
    expect(typeof control.waitUntilReady).toBe("function");
    expect(typeof control.waitUntilStopped).toBe("function");
    expect(typeof control.on).toBe("function");
  });

  test("should handle it correctly", async done => {
    // before
    control.getInfo = () => Promise.reject(new Error("not ready"));

    const resultStart = await control.start({
      komodod: path.join(__dirname, "app"),
      args: {
        ac_supply: "ac_supply",
        addnode: "addnode",
        pubkey: "pubkey"
      }
    });
    expect(resultStart).toEqual({ ok: "done" });
    expect(control.isRunning()).toEqual(true);
    expect(await control.isReady()).toEqual({ ok: "failed" });

    control.getInfo = () => Promise.resolve({});
    expect(await control.waitUntilReady()).toEqual({ ok: "done" });

    control.on("exit", (code, signal) => {
      expect(signal).toEqual("SIGTERM");
      done();
    });

    const resultStop = await control.stop();
    expect(resultStop).toEqual({ ok: "done" });

    control.getInfo = undefined;
  });

  test("addDefaultParams", () => {
    expect(
      control.addDefaultParams({
        addnode: [1, 2, 3]
      })
    ).toEqual([
      "-addnode=1",
      "-addnode=2",
      "-addnode=3",
      "-ac_supply=10500000",
      "-ac_reward=2500000000",
      "-ac_halving=210000",
      "-ac_cc=2",
      "-addressindex=1",
      "-spentindex=1",
      "-genproclimit=true",
      "-ac_name=KMDICE"
    ]);
  });
});
