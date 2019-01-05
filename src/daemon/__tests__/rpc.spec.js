import rpcFactory from "../rpc";

test("src/daemon/rpc", () => {
  const rpc = rpcFactory({
    coin: "KMD",
    applicationName: "Agama",
    options: {
      bin: ""
    }
  });
  expect(typeof rpc.rpc).toBe("function");
  expect(typeof rpc.getInfo).toBe("function");
  expect(typeof rpc.stop).toBe("function");
});
