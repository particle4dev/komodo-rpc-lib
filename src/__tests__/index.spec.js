import { KomodoRPC } from "../index";

test("sayHello", () => {
  const d = KomodoRPC();
  expect(typeof d.startDaemon).toBe("function");
  expect(typeof d.stopDaemon).toBe("function");
  expect(typeof d.rpc).toBe("function");
});
