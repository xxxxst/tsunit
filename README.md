# tsunit

a typescript unit test like csharp

[https://github.com/xxxxst/tsunit](https://github.com/xxxxst/tsunit)

[English](https://github.com/xxxxst/tsunit)
[简体中文](https://github.com/xxxxst/tsunit/doc/README-CN.md)

# speciality
- pretty API
- run in chrome
- easy to location the error
- support async test

<h2 align="center">Install</h2>

```bash
npm install tsunit
```

<h2 align="center">Config</h2>

- enable decortor
- enable source map

see more at the example

[https://github.com/xxxxst/example-tsunit](https://github.com/xxxxst/example-tsunit)

<h2 align="center">Usage</h2>

test file - ComTest.ts
```ts
@TestClass()
export default class ComTest {
    @Test()
    matchTest() {
        Assert.equal(1, 1);
        Assert.notEqual("aa", "bb");
    }

    @Ignore()
    @Test()
    ignoreTest() {
        Assert.equal(1, 2, "info");
    }

    @Test(1, 2)
    @Test("a", "b")
    noMatchTest(except, actual) {
        Assert.equal(except, actual, "info");
    }

    @AsyncTest()
    async asyncTest() {
        var rst = await this.getHttp();
        Assert.equal("data", rst);
    }

    async getHttp() {
        return new Promise(resolve => setTimeout(()=>{
            resolve("data");
        }, 0));
    }
}
```

test file - ComTest2.ts
```ts
@TestClass({autoRun:false})
export default class ComTest2 {
    constructor(arg1, arg2) {

    }
}
```

entry point file
```ts
// dont't need to create the test class
import './ComTest';

// second way to import
// make sure the class is used
import ComTest from './ComTest';
ComTest

// run test by yourself
import ComTest2 from './ComTest';
// ... your init code
setTimeout(()=>{
    // run test
    Assert.run(ComTest2, "arg1", "arg2");
}, 0);
```

open console to view test info

<img src="doc/resource/console_info.jpg"/>

<h2 align="center">API</h2>

## decorators

<p style="color:#25b4c0;">@TestClass(option?:{autoRun?:boolean}, ...args)</p>

- class decorator
- mark test class
- `autoRun` auto run test, default is `true`
- `args` test class constructor arguments

<p style="color:#25b4c0;">@Test(...args)</p>

- function decorator
- mark test function
- `args` arguments

<p style="color:#25b4c0;">@AsyncTest(...args)</p>

- function decorator
- mark asynchronous test function
- need to use `async/await`
- `args` arguments

<p style="color:#25b4c0;">@Ignore()</p>

- function decorator
- ignore (async) test function

## Assert

<p style="color:#25b4c0;">Assert.run(class, ...args)</p>

- run class by yourself
- need tu use `autoRun:false` in @TestClass()
- `class` test class
- &nbsp;`args` test class constructor arguments

<p style="color:#25b4c0;">Assert.setLang(obj)</p>

- set language, default is english
- `obj` language key/map, see more at source code
  + build-in language:
  + `Assert.lang_en_us` english
  + `Assert.lang_zh_cn` chinese

<p style="color:#25b4c0;">Assert.equal(expected:any, actual:any, desc: string = "")</p>

- assert if is equal, compare each param if is `object`
- `expected` expected value
- &nbsp;&nbsp;`actual` actual value
- &nbsp;&nbsp;&nbsp;&nbsp;`desc` describe info

orther assert

- Assert.equal&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(expected:any, actual:any, desc: string = "")
- Assert.notEqual&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(expected:any, actual:any, desc: string = "")
- Assert.strongEqual&nbsp;&nbsp;&nbsp;(expected:any, actual:any, desc: string = "")
- Assert.strongNotEqual(expected:any, actual:any, desc: string = "")
- Assert.same&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(expected:any, actual:any, desc: string = "")
- Assert.notSame&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(expected:any, actual:any, desc: string = "")
- Assert.isTrue&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(actual:any, desc: string = "")
- Assert.isFalse&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(actual:any, desc: string = "")
- Assert.isEmpty&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(actual:any, desc: string = "")
- Assert.isNotEmpty&nbsp;&nbsp;&nbsp;&nbsp;(actual:any, desc: string = "")
- Assert.isNull&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(actual:any, desc: string = "")
- Assert.isNotNull&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(actual:any, desc: string = "")
- Assert.isUndefined&nbsp;&nbsp;&nbsp;(actual:any, desc: string = "")
- Assert.isNotUndefined(actual:any, desc: string = "")
- Assert.isBool&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(actual:any, desc: string = "")
- Assert.isArray&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(actual:any, desc: string = "")
- Assert.isObject&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(actual:any, desc: string = "")
- Assert.isString&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(actual:any, desc: string = "")
- Assert.isNumber&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(actual:any, desc: string = "")
- Assert.success&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(desc: string = "")
- Assert.fail&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(desc: string = "")

assert usage

function|approximate expression|useage
:-|:-|:-
equal   | a==b(iterate over object) |Assert.equal(1,1) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> success<br/>Assert.equal(true,true) => success<br/>Assert.equal(1,'1') &nbsp;&nbsp;&nbsp;&nbsp;=> success<br/>Assert.equal({},{}) &nbsp;&nbsp;&nbsp;&nbsp;=> success<br/>Assert.equal([1],[1]) &nbsp;&nbsp;=> success
notEqual       |a!=b(iterate over object)
strongEqual    | typeof(a)==typeof(b) && equal(a,b) |Assert.strongEqual(1,'1') => failed
strongNotEqual | typeof(a)!=typeof(b) \|\| notEqual(a,b)
same           | a===b |Assert.same(1,'1') &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> failed<br/>Assert.same({},{}) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> failed<br/>a=b={},Assert.same(a,b) &nbsp;=> success
notSame        | a!==b
isTrue         | !!a | Assert.isTrue(0) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> failed<br/>Assert.isTrue(false) &nbsp;&nbsp;&nbsp;&nbsp;=> failed<br/>Assert.isTrue("") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> failed<br/> Assert.isTrue(null) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> failed<br/> Assert.isTrue(undefined) => failed
isFalse        | !a
isEmpty        | !a  |Assert.isEmpty("") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> success
isNotEmpty     | !!a
isNull         | a===null | Assert.isNull(null) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> success<br/> Assert.isNull(undefined) => failed
isNotNull      | a!==null
isUndefined    | a===undefined | Assert.isUndefined(undefined) => success<br/> Assert.isUndefined(null) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> failed
isNotUndefined | a!==undefined
isBool         | typeof(a)=="boolean" | Assert.isBool(undefined) => failed<br/> Assert.isBool(null) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> failed<br/> Assert.isBool(0) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> failed<br/> Assert.isBool("") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> failed
isArray        | Array.isArray(a) |  Assert.isArray([]) &nbsp;=> success<br/>  Assert.isArray({}) &nbsp;=> failed
isObject       | a!=null && typeof(a)=="object" && <br/>!Array.isArray(a) |  Assert.isObject({}) => success<br/>  Assert.isObject([]) => failed
isString       | typeof(a)=="string" | Assert.isString("") => success
isNumber       | typeof(a)=="number" | Assert.isString(1) &nbsp;=> success
success        | true | Assert.success() &nbsp;&nbsp;&nbsp;=> success
fail           | false | Assert.fail() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> failed

<h2 align="center">Example</h2>

base on webpack + typescript + vue(ui test)

[https://github.com/xxxxst/example-tsunit](https://github.com/xxxxst/example-tsunit)

