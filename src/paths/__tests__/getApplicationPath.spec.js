import getApplicationPath, {
  getApplicationOSPath
} from "../getApplicationPath";

describe("src/path/getApplicationPath", () => {
  let home = null;
  let appdata = null;
  beforeAll(() => {
    home = process.env.HOME;
    appdata = process.env.APPDATA;
    process.env.HOME = "HOME";
    process.env.APPDATA = "APPDATA";
  });
  afterAll(() => {
    process.env.HOME = home;
    process.env.APPDATA = appdata;
  });
  it("getApplicationPath", () => {
    expect(getApplicationPath("agama", "home")).toEqual("home/agama");
  });

  it("getApplicationOSPath", () => {
    expect(getApplicationOSPath("darwin")).toEqual(
      "HOME/Library/Application Support"
    );
    expect(getApplicationOSPath("linux")).toEqual("HOME");
    expect(getApplicationOSPath("win32")).toEqual("APPDATA");
    expect(getApplicationOSPath("bin-path", "")).toEqual("");
  });
});
