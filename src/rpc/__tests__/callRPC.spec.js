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

    expect(childProcess.execFile.mock.calls.length).toBe(1);
  });

  test("callRPC throw error", async done => {
    childProcess.execFile = jest.fn((cli, argsRun, cb) => {
      cb(new Error("error message"));
    });
    try {
      await callRPC({
        cli: "cli",
        coin: "coin",
        action: "action",
        args: {
          one: 1
        }
      });
      done.fail(new Error("should throw new error here"));
    } catch (err) {
      expect(err.message).toBe("error message");
      done();
    }
  });
});
