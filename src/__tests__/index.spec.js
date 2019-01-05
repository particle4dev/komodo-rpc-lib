import KomodoRPC from "../index";

test("src/index", () => {
  const d = KomodoRPC("applicationName", {
    bin: ""
  });
  expect(typeof d.startDaemon).toBe("function");
  expect(typeof d.stopDaemon).toBe("function");
  expect(typeof d.rpc).toBe("function");
  expect(typeof d.getInfo).toBe("function");
  expect(typeof d.stop).toBe("function");
});
