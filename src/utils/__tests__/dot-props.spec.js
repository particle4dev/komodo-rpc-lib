import m from "../dot-prop";

describe("lib/dot-props", () => {
  it("get", () => {
    const f1 = { foo: { bar: 1 } };
    expect(m.get(f1)).toEqual(f1);
    f1[""] = "foo";
    expect(m.get(f1, "")).toEqual("foo");
    expect(m.get(f1, "foo")).toEqual(f1.foo);
    expect(m.get({ foo: 1 }, "foo")).toEqual(1);
    expect(m.get({ foo: null }, "foo")).toEqual(null);
    expect(m.get({ foo: undefined }, "foo")).toEqual(undefined);
    expect(m.get({ foo: { bar: true } }, "foo.bar")).toEqual(true);
    expect(m.get({ foo: { bar: { baz: true } } }, "foo.bar.baz")).toEqual(true);
    expect(m.get({ foo: { bar: { baz: null } } }, "foo.bar.baz")).toEqual(null);
    expect(m.get({ foo: { bar: "a" } }, "foo.fake")).toEqual(undefined);
    expect(m.get({ foo: { bar: "a" } }, "foo.fake.fake2")).toEqual(undefined);
    expect(
      m.get({ foo: { bar: "a" } }, "foo.fake.fake2", "some value")
    ).toEqual("some value");
    expect(m.get({ "\\": true }, "\\")).toEqual(true);
    expect(m.get({ "\\foo": true }, "\\foo")).toEqual(true);
    expect(m.get({ "bar\\": true }, "bar\\")).toEqual(true);
    expect(m.get({ "foo\\bar": true }, "foo\\bar")).toEqual(true);
    expect(m.get({ "\\.foo": true }, "\\\\.foo")).toEqual(true);
    expect(m.get({ "bar\\.": true }, "bar\\\\.")).toEqual(true);
    expect(m.get({ "foo\\.bar": true }, "foo\\\\.bar")).toEqual(true);
    expect(m.get({ foo: 1 }, "foo.bar")).toEqual(undefined);

    const f2 = {};
    Object.defineProperty(f2, "foo", {
      value: "bar",
      enumerable: false
    });
    expect(m.get(f2, "foo")).toEqual(undefined);
    expect(m.get({}, "hasOwnProperty")).toEqual(undefined);

    function fn() {}
    fn.foo = { bar: 1 };
    expect(m.get(fn)).toEqual(fn);
    expect(m.get(fn, "foo")).toEqual(fn.foo);
    expect(m.get(fn, "foo.bar")).toEqual(1);

    const f3 = { foo: null };
    expect(m.get(f3, "foo.bar")).toEqual(undefined);
    expect(m.get(f3, "foo.bar", "some value")).toEqual("some value");

    expect(m.get({ "foo.baz": { bar: true } }, "foo\\.baz.bar")).toEqual(true);
    expect(m.get({ "fo.ob.az": { bar: true } }, "fo\\.ob\\.az.bar")).toEqual(
      true
    );

    expect(m.get(null, "foo.bar", false)).toEqual(false);
    expect(m.get("foo", "foo.bar", false)).toEqual(false);
    expect(m.get([], "foo.bar", false)).toEqual(false);
    expect(m.get(undefined, "foo.bar", false)).toEqual(false);
  });

  it("set", () => {
    const func = () => "test";
    let f1 = {};

    const o1 = m.set(f1, "foo", 2);
    expect(f1.foo).toEqual(2);
    expect(o1).toEqual(f1);

    f1 = { foo: { bar: 1 } };
    m.set(f1, "foo.bar", 2);
    expect(f1.foo.bar).toEqual(2);

    m.set(f1, "foo.bar.baz", 3);
    expect(f1.foo.bar.baz).toEqual(3);

    m.set(f1, "foo.bar", "test");
    expect(f1.foo.bar).toEqual("test");

    m.set(f1, "foo.bar", null);
    expect(f1.foo.bar).toEqual(null);

    m.set(f1, "foo.bar", false);
    expect(f1.foo.bar).toEqual(false);

    m.set(f1, "foo.bar", undefined);
    expect(f1.foo.bar).toEqual(undefined);

    m.set(f1, "foo.fake.fake2", "fake");
    expect(f1.foo.fake.fake2).toEqual("fake");

    m.set(f1, "foo.function", func);
    expect(f1.foo.function).toEqual(func);

    function fn() {}
    m.set(fn, "foo.bar", 1);
    expect(fn.foo.bar).toEqual(1);

    f1.fn = fn;
    m.set(f1, "fn.bar.baz", 2);
    expect(f1.fn.bar.baz).toEqual(2);

    const f2 = { foo: null };
    m.set(f2, "foo.bar", 2);
    expect(f2.foo.bar).toEqual(2);

    const f3 = {};
    m.set(f3, "", 3);
    expect(f3[""]).toEqual(3);

    m.set(f1, "foo\\.bar.baz", true);
    expect(f1["foo.bar"].baz).toEqual(true);

    m.set(f1, "fo\\.ob\\.ar.baz", true);
    expect(f1["fo.ob.ar"].baz).toEqual(true);

    const f4 = "noobject";
    const o4 = m.set(f4, "foo.bar", 2);
    expect(f4).toEqual("noobject");
    expect(o4).toEqual(f4);
  });

  it("delete", () => {
    const func = () => "test";
    func.foo = "bar";

    const inner = {
      a: "a",
      b: "b",
      c: "c",
      func
    };
    const f1 = {
      foo: {
        bar: {
          baz: inner
        }
      },
      top: {
        dog: "sindre"
      }
    };

    expect(f1.foo.bar.baz.c).toEqual("c");
    m.delete(f1, "foo.bar.baz.c");
    expect(f1.foo.bar.baz.c).toEqual(undefined);

    expect(f1.top.dog).toEqual("sindre");
    m.delete(f1, "top");
    expect(f1.top).toEqual(undefined);

    expect(f1.foo.bar.baz.func.foo).toEqual("bar");
    m.delete(f1, "foo.bar.baz.func.foo");
    expect(f1.foo.bar.baz.func.foo).toEqual(undefined);

    expect(f1.foo.bar.baz.func).toEqual(func);
    m.delete(f1, "foo.bar.baz.func");
    expect(f1.foo.bar.baz.func).toEqual(undefined);

    m.set(f1, "foo\\.bar.baz", true);
    expect(f1["foo.bar"].baz).toEqual(true);
    m.delete(f1, "foo\\.bar.baz");
    expect(f1["foo.bar"].baz).toEqual(undefined);

    const f2 = {};
    m.set(f2, "foo.bar\\.baz", true);
    expect(f2.foo["bar.baz"]).toEqual(true);
    m.delete(f2, "foo.bar\\.baz");
    expect(f2.foo["bar.baz"]).toEqual(undefined);

    f2.dotted = {
      sub: {
        "dotted.prop": "foo",
        other: "prop"
      }
    };
    m.delete(f2, "dotted.sub.dotted\\.prop");
    expect(f2.dotted.sub["dotted.prop"]).toEqual(undefined);
    expect(f2.dotted.sub.other).toEqual("prop");

    const f3 = { foo: null };
    m.delete(f3, "foo.bar");
    expect(f3).toEqual({ foo: null });

    expect(m.delete(null, "foo.bar")).toEqual(undefined);
    expect(m.delete(f3, null)).toEqual(undefined);
  });

  it("has", () => {
    const f1 = { foo: { bar: 1 } };
    expect(m.has(f1)).toEqual(false);
    expect(m.has(f1, "foo")).toEqual(true);
    expect(m.has({ foo: 1 }, "foo")).toEqual(true);
    expect(m.has({ foo: null }, "foo")).toEqual(true);
    expect(m.has({ foo: undefined }, "foo")).toEqual(true);
    expect(m.has({ foo: { bar: true } }, "foo.bar")).toEqual(true);
    expect(m.has({ foo: { bar: { baz: true } } }, "foo.bar.baz")).toEqual(true);
    expect(m.has({ foo: { bar: { baz: null } } }, "foo.bar.baz")).toEqual(true);
    expect(m.has({ foo: { bar: "a" } }, "foo.fake.fake2")).toEqual(false);
    expect(m.has({ foo: null }, "foo.bar")).toEqual(false);
    expect(m.has({ foo: "" }, "foo.bar")).toEqual(false);

    function fn() {}
    fn.foo = { bar: 1 };
    expect(m.has(fn)).toEqual(false);
    expect(m.has(fn, "foo")).toEqual(true);
    expect(m.has(fn, "foo.bar")).toEqual(true);
    expect(m.has({ "foo.baz": { bar: true } }, "foo\\.baz.bar")).toEqual(true);
    expect(m.has({ "fo.ob.az": { bar: true } }, "fo\\.ob\\.az.bar")).toEqual(
      true
    );
  });
});
