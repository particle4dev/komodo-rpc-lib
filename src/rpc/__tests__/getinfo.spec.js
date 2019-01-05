import os from "os";
import { rpc as callRPC } from "../callRPC";
import getInfoFactory, { getInfo } from "../getinfo";

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

describe("src/rpc/getInfo", () => {
  test("getInfo", async () => {
    callRPC.mockImplementation(config => Promise.resolve(config));
    const rs = await getInfo({});
    expect(rs).toEqual({ action: "getinfo" });
  });

  test("getInfoFactory", async () => {
    callRPC.mockImplementation(config => Promise.resolve(config));
    const info = getInfoFactory({
      coin: "KMDice",
      bin: ""
    });
    const rs = await info.getInfo({});
    expect(rs).toEqual({
      action: "getinfo",
      cli: `${getOSFolder()}/komodo-cli`,
      coin: "KMDice"
    });
  });
});
