import callRPC from "../callRPC";
import stopFactory, { stop } from "../stop";

jest.mock("../callRPC");

describe("src/rpc/stop", () => {
  test("stop", async () => {
    callRPC.mockImplementation(config => Promise.resolve(config));
    const rs = await stop({});
    expect(rs).toEqual({ action: "stop" });
  });

  test("stopFactory", async () => {
    callRPC.mockImplementation(config => Promise.resolve(config));
    const info = stopFactory("KMDice");
    const rs = await info.stop({});
    expect(rs).toEqual({ action: "stop", coin: "KMDice" });
  });
});
