module.exports = {
  // verbose: true,
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  moduleDirectories: ["node_modules"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  testRegex: "(/__tests__/.*)\\.jsx?$",
  transform: {
    "\\.(j|t)sx?$": "babel-jest"
  },
  testURL: "http://localhost/"
};
