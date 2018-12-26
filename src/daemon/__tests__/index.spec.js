import { Daemon } from "../index";

test("src/daemon/index", () => {
  const d = Daemon();
  expect(typeof d.start).toBe("function");
  expect(typeof d.stop).toBe("function");
  expect(typeof d.isRunning).toBe("function");
  expect(typeof d.isReady).toBe("function");
  expect(typeof d.on).toBe("function");
  expect(typeof d.getConfig).toBe("function");
  expect(typeof d.getCoin).toBe("function");
  expect(typeof d.getApplicationName).toBe("function");
  expect(typeof d.getKomodoDir).toBe("function");
  expect(typeof d.rpc).toBe("function");
  expect(typeof d.getInfo).toBe("function");
});
