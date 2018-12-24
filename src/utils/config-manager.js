import dotProp from "./dot-prop";

const Config = () => {
  // init
  let state = {};

  return Object.assign({
    get(key) {
      return dotProp.get(state, key);
    },
    set(key, value) {
      if (arguments.length === 1) {
        // eslint-disable-next-line no-restricted-syntax
        for (const k of Object.keys(key)) {
          dotProp.set(state, k, key[k]);
        }
      } else {
        dotProp.set(state, key, value);
      }
    },
    has(key) {
      return dotProp.has(state, key);
    },
    delete(key) {
      dotProp.delete(state, key);
    },
    clear() {
      state = {};
    }
  });
};

export default Config;
