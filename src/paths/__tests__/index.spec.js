import {
  getApplicationOSPath,
  getKomodoPath,
  getApplicationPath,
  getOSInfo,
  getNodeModulePath,
  getBinPath,
  getKomodod,
  getKomodoCLI
} from "../index";

test("src/daemon/index", () => {
  expect(typeof getApplicationOSPath).toBe("function");
  expect(typeof getKomodoPath).toBe("function");
  expect(typeof getApplicationPath).toBe("function");
  expect(typeof getOSInfo).toBe("function");
  expect(typeof getNodeModulePath).toBe("function");
  expect(typeof getBinPath).toBe("function");
  expect(typeof getKomodod).toBe("function");
  expect(typeof getKomodoCLI).toBe("function");
});
