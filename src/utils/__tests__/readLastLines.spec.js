import path from "path";
import readLastLines from "../readLastLines";

describe("lib/readLastLines", () => {
  const numberedfilePath = path.join(__dirname, "./numbered");
  const nonStandardfilePath = path.join(__dirname, "./non_standard_new_lines");

  it("return all lines when asked for more than the file has", async done => {
    try {
      const lines = await readLastLines({
        filePath: numberedfilePath,
        maxLineCount: 15
      });
      const { length } = lines.split(/\n|\r/);
      expect(length).toEqual(10);

      done();
    } catch (err) {
      done.fail(err);
    }
  });

  it("return last line when asked for 1", async done => {
    try {
      const lines = await readLastLines({
        filePath: numberedfilePath,
        maxLineCount: 1
      });
      const { length } = lines.split(/\n|\r/);
      const trimmedStringLength = lines.trim().length;
      expect(length).toEqual(1);
      expect(trimmedStringLength).toEqual(3);

      done();
    } catch (err) {
      done.fail(err);
    }
  });

  it("return last 2 lines when asked for 2", async done => {
    try {
      const lines = await readLastLines({
        filePath: numberedfilePath,
        maxLineCount: 2
      });
      const { length } = lines.split(/\n|\r/);
      const trimmedStringLength = lines.trim().length;
      expect(length).toEqual(2);
      expect(trimmedStringLength).toEqual(7);

      done();
    } catch (err) {
      done.fail(err);
    }
  });

  it("expect and error to be thrown if the file does not exist", async done => {
    try {
      await readLastLines({
        filePath: "non_existant_file_name"
      });

      done.fail(new Error("this test should not pass"));
    } catch (err) {
      expect(err.message).toEqual("file does not exist");
      done();
    }
  });

  it("should the new line characters used by the file, when using non standard new line characters", async done => {
    try {
      const lines = await readLastLines({
        filePath: nonStandardfilePath,
        maxLineCount: 30
      });
      const { length } = lines.split(/\n|\r/);
      expect(length).toEqual(6);
      done();
    } catch (err) {
      done.fail(err);
    }
  });
});
