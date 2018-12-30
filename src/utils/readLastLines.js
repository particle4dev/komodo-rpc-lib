// @flow
import fs from "fs";
import util from "util";

const debug = require("debug")("kmdrpc:utils:getLastLines");

const fread = util.promisify(fs.read);
const fstat = util.promisify(fs.stat);
const fopen = util.promisify(fs.open);

/**
 * Read in the last `n` lines of a file
 * @param {Object} args args
 * @param  {string}   args.filePath        - file (direct or relative path to file.)
 * @param  {int}      args.maxLineCount    - max number of lines to read in.
 * @param  {encoding} args.encoding        - specifies the character encoding to be used, or 'buffer'. defaults to 'utf8'.
 *
 * @return {promise}  a promis resolved with the lines or rejected with an error.
 */

type GetLastLines = {
  filePath: string,
  maxLineCount?: number,
  encoding?: string
};

const NEW_LINE_CHARACTERS = ["\n", "\r"];

const readPreviousChar = (stat, file, currentCharacterCount) =>
  fread(
    file,
    Buffer.alloc(1),
    0,
    1,
    stat.size - 1 - currentCharacterCount
  ).then(bytesReadAndBuffer => {
    debug(bytesReadAndBuffer);
    return String.fromCharCode(bytesReadAndBuffer.buffer[0]);
  });

export default function getLastLines(config: GetLastLines): Promise<any> {
  return new Promise(async (resolve, reject) => {
    let file = null;
    try {
      // step 1: check if path exists
      const { filePath, maxLineCount, encoding = "utf8" } = config;
      debug(`read ${filePath} file`);
      if (!fs.existsSync(filePath)) {
        return reject(new Error("file does not exist"));
      }
      const stat = await fstat(filePath);
      file = await fopen(filePath, "r");

      let chars = 0;
      let lineCount = 0;
      let lines = "";
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const nextCharacter = await readPreviousChar(stat, file, chars);
        lines = nextCharacter + lines;
        if (NEW_LINE_CHARACTERS.includes(nextCharacter) && lines.length > 1) {
          lineCount += 1;
        }
        chars += 1;
        if (lines.length > stat.size) {
          lines = lines.substring(lines.length - stat.size);
        }
        if (
          lines.length >= stat.size ||
          (maxLineCount && lineCount >= maxLineCount)
        ) {
          break;
        }
      }

      if (NEW_LINE_CHARACTERS.includes(lines.substring(0, 1))) {
        lines = lines.substring(1);
      }
      // $FlowIgnore: suppressing this error
      if (file) fs.closeSync(file);
      if (encoding === "buffer") {
        return resolve(Buffer.from(lines, "binary"));
      }
      // $FlowIgnore: suppressing this error
      return resolve(Buffer.from(lines, "binary").toString(encoding));
    } catch (err) {
      // $FlowIgnore: suppressing this error
      if (file) fs.closeSync(file);

      return reject(err);
    }
  });
}
