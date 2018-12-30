import path from "path";
import configFactory from "../config";
import { getApplicationPath } from "../../paths";

describe("src/daemon/config", () => {
  const dir = __dirname;

  test("KMDICE", async () => {
    const state = {
      coin: "KMDICE",
      applicationName: "Agama"
    };

    const config = configFactory(state);

    expect(config.getApplicationPath()).toBe(getApplicationPath("Agama"));
    expect(config.getLogFile()).toBe(
      path.join(config.getApplicationPath(), "KMDICE.log")
    );
    expect(config.getErrorLogFile()).toBe(
      path.join(config.getApplicationPath(), "KMDICE_error.log")
    );
    expect(config.getCoin()).toBe("KMDICE");
    expect(config.getApplicationName()).toBe("Agama");
    expect(config.getConfigFile(dir)).toBe(`${dir}/KMDICE/KMDICE.conf`);
    expect(await config.getConfig(config.getConfigFile(dir))).toEqual({});
  });

  test("komodo", async () => {
    const state = {
      coin: "komodo",
      applicationName: "Agama"
    };
    const config = configFactory(state);

    expect(config.getCoin()).toBe("komodo");
    expect(config.getApplicationName()).toBe("Agama");
    expect(config.getConfigFile(dir)).toBe(`${dir}/komodo.conf`);
    expect(await config.getConfig(config.getConfigFile(dir))).toEqual({
      server: "1",
      rpcport: "7771",
      addnode: ["78.47.196.146", "127.0.0.1", "144.76.94.3%"]
    });
  });

  test("MAC", async () => {
    const state = {
      coin: "MAC",
      applicationName: "Agama"
    };

    const config = configFactory(state);

    expect(config.getCoin()).toBe("MAC");
    expect(config.getApplicationName()).toBe("Agama");
    expect(config.getConfigFile(dir)).toBe(`${dir}/MAC/MAC.conf`);
    expect(await config.getConfig(config.getConfigFile(dir))).toEqual({
      addnode: "78.47.196.146",
      pass: "",
      rpcport: "7771",
      server: "1",
      user: undefined
    });
  });

  test("COQUI", async done => {
    const state = {
      coin: "COQUI",
      applicationName: "Agama"
    };

    const config = configFactory(state);
    try {
      expect(config.getCoin()).toBe("COQUI");
      expect(config.getApplicationName()).toBe("Agama");
      expect(config.getConfigFile(dir)).toBe(`${dir}/COQUI/COQUI.conf`);
      await config.getConfig(config.getConfigFile(dir));

      done.fail(new Error("should throw new error here"));
    } catch (err) {
      expect(err.message).toBe(
        `not found config file in ${config.getConfigFile(dir)}`
      );
      done();
    }
  });
});
