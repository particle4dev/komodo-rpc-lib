import rpcFactory from "../index";

test("src/rpc/index", () => {
  const d = rpcFactory({
    bin: ""
  });
  expect(typeof d.rpc).toBe("function");
  expect(typeof d.getInfo).toBe("function");
  expect(typeof d.stop).toBe("function");
});
