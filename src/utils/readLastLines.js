// @flow
import fs from "fs";

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

export default function getLastLines(config: GetLastLines): Promise<any> {
  return new Promise(async (resolve, reject) => {
    // step 1: check if path exists
    const { filePath } = config;
    if (!fs.existsSync(filePath)) {
      return reject(new Error("file does not exist"));
    }
    return resolve({});
  });
}
