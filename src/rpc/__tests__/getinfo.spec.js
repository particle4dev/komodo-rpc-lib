import callRPC from "../callRPC";
import getInfoFactory, { getInfo } from "../getinfo";

jest.mock("../callRPC");

describe("src/rpc/getInfo", () => {
  test("getInfo", async () => {
    callRPC.mockImplementation(config => Promise.resolve(config));
    const rs = await getInfo({});
    expect(rs).toEqual({ action: "getinfo" });
  });

  test("getInfoFactory", async () => {
    callRPC.mockImplementation(config => Promise.resolve(config));
    const info = getInfoFactory("KMDice");
    const rs = await info.getInfo({});
    expect(rs).toEqual({ action: "getinfo", coin: "KMDice" });
  });
});
