import os from "os";
import { rpc as callRPC } from "../callRPC";
import stopFactory, { stop } from "../stop";

jest.mock("../callRPC");

function getOSFolder(platform = os.platform()) {
  if (platform === "darwin") {
    return "mac";
  }
  if (platform === "linux") {
    return "linux";
  }
  if (platform === "win32") {
    return "win";
  }
  return "";
}

describe("src/rpc/stop", () => {
  test("stop", async () => {
    callRPC.mockImplementation(config => Promise.resolve(config));
    const rs = await stop({});
    expect(rs).toEqual({ action: "stop" });
  });

  test("stopFactory", async () => {
    callRPC.mockImplementation(config => Promise.resolve(config));
    const info = stopFactory({
      coin: "KMDice",
      bin: ""
    });
    const rs = await info.stop({});
    expect(rs).toEqual({
      action: "stop",
      cli: `${getOSFolder()}/komodo-cli`,
      coin: "KMDice"
    });
  });
});
