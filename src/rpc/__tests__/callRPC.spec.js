import childProcess from "child_process";
import callRPC from "../callRPC";

describe("src/rpc/callRPC", () => {
  test("callRPC", async () => {
    childProcess.execFile = jest.fn((cli, argsRun, cb) => {
      cb(null, {
        cli,
        argsRun
      });
    });
    const rs = await callRPC({
      cli: "cli",
      coin: "coin",
      action: "action",
      args: {
        one: 1
      }
    });
    expect(rs).toEqual({
      cli: "cli",
      argsRun: ["-ac_name=coin", "action", '{"one":1}']
    });

    expect(childProcess.execFile.mock.calls.length).toBe(1); // Assert against the default
  });
});
