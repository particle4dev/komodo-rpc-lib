const isObj = value => {
  const type = typeof value;
  return value != null && (type === "object" || type === "function");
};

function getPathSegments(path) {
  const pathArr = path.split(".");
  const parts = [];

  for (let i = 0; i < pathArr.length; i += 1) {
    let p = pathArr[i];

    while (p[p.length - 1] === "\\" && pathArr[i + 1] !== undefined) {
      p = `${p.slice(0, -1)}.`;
      // eslint-disable-next-line no-plusplus
      p += pathArr[++i];
    }

    parts.push(p);
  }

  return parts;
}

export default {
  get(obj, path, value) {
    if (!isObj(obj) || typeof path !== "string") {
      return value === undefined ? obj : value;
    }

    const pathArr = getPathSegments(path);

    for (let i = 0; i < pathArr.length; i += 1) {
      if (!Object.prototype.propertyIsEnumerable.call(obj, pathArr[i])) {
        return value;
      }
      // eslint-disable-next-line no-param-reassign
      obj = obj[pathArr[i]];

      if (obj === undefined || obj === null) {
        // `obj` is either `undefined` or `null` so we want to stop the loop, and
        // if this is not the last bit of the path, and
        // if it did't return `undefined`
        // it would return `null` if `obj` is `null`
        // but we want `get({foo: null}, 'foo.bar')` to equal `undefined`, or the supplied value, not `null`
        if (i !== pathArr.length - 1) {
          return value;
        }

        break;
      }
    }

    return obj;
  },

  set(obj, path, value) {
    if (!isObj(obj) || typeof path !== "string") {
      return obj;
    }

    const root = obj;
    const pathArr = getPathSegments(path);

    pathArr.forEach((p, i) => {
      if (!isObj(obj[p])) {
        // eslint-disable-next-line no-param-reassign
        obj[p] = {};
      }

      if (i === pathArr.length - 1) {
        // eslint-disable-next-line no-param-reassign
        obj[p] = value;
      }

      // eslint-disable-next-line no-param-reassign
      obj = obj[p];
    });

    return root;
  },

  delete(obj, path) {
    if (!isObj(obj) || typeof path !== "string") {
      return;
    }

    const pathArr = getPathSegments(path);

    for (let i = 0; i < pathArr.length; i += 1) {
      const p = pathArr[i];

      if (i === pathArr.length - 1) {
        // eslint-disable-next-line no-param-reassign
        delete obj[p];
        return;
      }

      // eslint-disable-next-line no-param-reassign
      obj = obj[p];

      if (!isObj(obj)) {
        return;
      }
    }
  },

  has(obj, path) {
    if (!isObj(obj) || typeof path !== "string") {
      return false;
    }

    const pathArr = getPathSegments(path);

    for (let i = 0; i < pathArr.length; i += 1) {
      if (isObj(obj)) {
        if (!(pathArr[i] in obj)) {
          return false;
        }
        // eslint-disable-next-line no-param-reassign
        obj = obj[pathArr[i]];
      } else {
        return false;
      }
    }

    return true;
  }
};
