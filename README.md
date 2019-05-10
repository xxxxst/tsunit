# tsunit

a typescript unit test like csharp

[https://github.com/xxxxst/tsunit](https://github.com/xxxxst/tsunit)

[English](https://github.com/xxxxst/tsunit)
[简体中文](https://github.com/xxxxst/tsunit/blob/master/doc/README-CN.md)

# speciality
- pretty API
- run in chrome
- easy to locate the error
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
import ComTest2 from './ComTest2';
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

@TestClass(option?:{autoRun?:boolean}, ...args)

- class decorator
- mark test class
- `autoRun` auto run test, default is `true`
- `args` test class constructor arguments

@Test(...args)

- function decorator
- mark test function
- `args` arguments

@AsyncTest(...args)

- function decorator
- mark asynchronous test function
- need to use `async/await`
- `args` arguments

@Ignore()

- function decorator
- ignore (async) test function

## Assert

Assert.run(class, ...args)

- run class by yourself
- need tu use `autoRun:false` in @TestClass()
- `class` test class
- &nbsp;`args` test class constructor arguments

Assert.setLang(obj)

- set language, default is english
- `obj` language key/map, see more at source code
  + build-in language:
  + `Assert.lang_en_us` english
  + `Assert.lang_zh_cn` chinese

Assert.equal(expected:any, actual:any, desc: string = "")

- assert if is equal, compare each param if is `object`
- `expected` expected value
- `actual` actual value
- `desc` describe info

orther assert

-|-
:-|:-
Assert.equal          | (expected:any, actual:any, desc: string = "")
Assert.notEqual       | (expected:any, actual:any, desc: string = "")
Assert.strongEqual    | (expected:any, actual:any, desc: string = "")
Assert.strongNotEqual | (expected:any, actual:any, desc: string = "")
Assert.same           | (expected:any, actual:any, desc: string = "")
Assert.notSame        | (expected:any, actual:any, desc: string = "")
Assert.isTrue         | (actual:any, desc: string = "")
Assert.isFalse        | (actual:any, desc: string = "")
Assert.isEmpty        | (actual:any, desc: string = "")
Assert.isNotEmpty     | (actual:any, desc: string = "")
Assert.isNull         | (actual:any, desc: string = "")
Assert.isNotNull      | (actual:any, desc: string = "")
Assert.isUndefined    | (actual:any, desc: string = "")
Assert.isNotUndefined | (actual:any, desc: string = "")
Assert.isBool         | (actual:any, desc: string = "")
Assert.isArray        | (actual:any, desc: string = "")
Assert.isObject       | (actual:any, desc: string = "")
Assert.isString       | (actual:any, desc: string = "")
Assert.isNumber       | (actual:any, desc: string = "")
Assert.success        | (desc: string = "")
Assert.fail           | (desc: string = "")

assert usage

<table>
<thead>
    <tr>
        <th align="center">function</th>
        <th align="center">approximate expression</th>
        <th align="center" colspan="2">useage</th>
    </tr>
</thead>
<tbody>
    <tr>
        <td>equal</td>
        <td>a==b(iterate over object)</td>
        <td>Assert.equal(1,1)<br/>Assert.equal(true,true)<br/>Assert.equal(1,'1')<br/>Assert.equal({},{})<br/>Assert.equal([1],[1])</td>
        <td>=> success<br/>=> success<br/>=> success<br/>=> success<br/>=> success</td>
    </tr>
    <tr>
        <td>notEqual</td>
        <td>a!=b(iterate over object)</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>strongEqual</td>
        <td>typeof(a)==typeof(b) && equal(a,b)</td>
        <td>Assert.strongEqual(1,'1')</td>
        <td>=> failed</td>
    </tr>
    <tr>
        <td>strongNotEqual</td>
        <td>!strongEqual(a,b)</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>same</td>
        <td>a===b</td>
        <td>Assert.same(1,'1')<br/>Assert.same({},{})<br/>a=b={},Assert.same(a,b)</td>
        <td>=> failed<br/>=> failed<br/>=> success</td>
    </tr>
    <tr>
        <td>notSame</td>
        <td>a!==b</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>isTrue</td>
        <td>!!a</td>
        <td>Assert.isTrue(0)<br/>Assert.isTrue(false)<br/>Assert.isTrue("")<br/>Assert.isTrue(null)<br/>Assert.isTrue(undefined)</td>
        <td>=> failed<br/>=> failed<br/>=> failed<br/>=> failed<br/>=> failed</td>
    </tr>
    <tr>
        <td>isFalse</td>
        <td>!a</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>isEmpty</td>
        <td>!a</td>
        <td>Assert.isEmpty("")</td>
        <td>=> success</td>
    </tr>
    <tr>
        <td>isNotEmpty</td>
        <td>!!a</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>isNull</td>
        <td>a===null</td>
        <td>Assert.isNull(null)<br/>Assert.isNull(undefined)</td>
        <td>=> success<br/>=> failed</td>
    </tr>
    <tr>
        <td>isNotNull</td>
        <td>a!==null</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>isUndefined</td>
        <td>a===undefined</td>
        <td>Assert.isUndefined(undefined)<br/>Assert.isUndefined(null)</td>
        <td>=> success<br/>=> failed</td>
    </tr>
    <tr>
        <td>isNotUndefined</td>
        <td>a!==undefined</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>isBool</td>
        <td>typeof(a)=="boolean"</td>
        <td>Assert.isBool(undefined)<br/>Assert.isBool(null)<br/>Assert.isBool(0)<br/>Assert.isBool("")</td>
        <td>=> failed<br/>=> failed<br/>=> failed<br/>=> failed</td>
    </tr>
    <tr>
        <td>isArray</td>
        <td>Array.isArray(a)</td>
        <td>Assert.isArray([])<br/>Assert.isArray({})</td>
        <td>=> success<br/>=> failed</td>
    </tr>
    <tr>
        <td>isObject</td>
        <td>a!=null && typeof(a)=="object" && <br/>!Array.isArray(a)</td>
        <td>Assert.isObject({})<br/>Assert.isObject([])</td>
        <td>=> success<br/>=> failed</td>
    </tr>
    <tr>
        <td>isString</td>
        <td>typeof(a)=="string"</td>
        <td>Assert.isString("")</td>
        <td>=> success</td>
    </tr>
    <tr>
        <td>isNumber</td>
        <td>typeof(a)=="number"</td>
        <td>Assert.isString(1)</td>
        <td>=> success</td>
    </tr>
    <tr>
        <td>success</td>
        <td>true</td>
        <td>Assert.success()</td>
        <td>=> success</td>
    </tr>
    <tr>
        <td>fail</td>
        <td>false</td>
        <td>Assert.fail()</td>
        <td>=> failed</td>
    </tr>
</tbody>
</table>

<h2 align="center">Example</h2>

base on webpack + typescript + vue(ui test)

[https://github.com/xxxxst/example-tsunit](https://github.com/xxxxst/example-tsunit)

