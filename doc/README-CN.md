# tsunit

一个仿照c#接口写的typescript单元测试框架

[https://github.com/xxxxst/tsunit](https://github.com/xxxxst/tsunit)

[English](https://github.com/xxxxst/tsunit)
[简体中文](https://github.com/xxxxst/tsunit/doc/README-CN.md)

# 特性
- 简洁的接口
- 运行于chrome
- 方便定位错误位置
- 支持异步测试用例

<h2 align="center">安装</h2>

```bash
npm install tsunit
```

<h2 align="center">配置</h2>

- 启用 decortor
- 启用 source map

查看更多配置

[https://github.com/xxxxst/example-tsunit](https://github.com/xxxxst/example-tsunit)

<h2 align="center">使用</h2>

测试文件 - ComTest.ts
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

测试文件 - ComTest2.ts
```ts
@TestClass({autoRun:false})
export default class ComTest2 {
    constructor(arg1, arg2) {

    }
}
```

程序入口文件
```ts
// 不需要创建测试类，导入即可自动执行
import './ComTest';

// 第二种引用方式
// 确保类被引用过
import ComTest from './ComTest';
ComTest

// 自定义执行测试程序
import ComTest2 from './ComTest';
// ... 你的初始化代码
setTimeout(()=>{
    // 运行测试
    Assert.run(ComTest2, "arg1", "arg2");
}, 0);
```

打开控制台查看测试信息

<img src="./resource/console_info.jpg"/>

<h2 align="center">接口</h2>

## 装饰器

<p style="color:#25b4c0;">@TestClass(option?:{autoRun?:boolean}, ...args)</p>

- 类装饰器
- 标记测试类
- `autoRun` 自动执行测试, 默认为`true`
- `args` 测试类构造函数参数

<p style="color:#25b4c0;">@Test(...args)</p>

- 方法装饰器
- 标记测试方法
- `args` 方法参数

<p style="color:#25b4c0;">@AsyncTest(...args)</p>

- 方法装饰器
- 标记异步测试方法
- 需要使用`async/await`
- `args` 方法参数

<p style="color:#25b4c0;">@Ignore()</p>

- 方法装饰器
- 忽略(异步)测试方法

## Assert

<p style="color:#25b4c0;">Assert.run(class, ...args)</p>

- 自定义运行测试类
- 需要在 @TestClass()使用`autoRun:false`
- `class` 测试类
- &nbsp;`args` 测试类构造函数参数

<p style="color:#25b4c0;">Assert.setLang(obj)</p>

- 设置语言，默认为英语
- `obj` 语言数据, 详细数据请查看源代码
  + 内置语言:
  + `Assert.lang_en_us` 英语
  + `Assert.lang_zh_cn` 简体中文

<p style="color:#25b4c0;">Assert.equal(expected:any, actual:any, desc: string = "")</p>

- 测试是否相等，如果是`object`类型则遍历进行比较
- `expected` 期望值
- &nbsp;&nbsp;`actual` 实际值
- &nbsp;&nbsp;&nbsp;&nbsp;`desc` 描述信息

其他assert

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

assert使用

方法|近似表达式|示例
:-|:-|:-
equal   | a==b(遍历对象) |Assert.equal(1,1) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> 成功<br/>Assert.equal(true,true) => 成功<br/>Assert.equal(1,'1') &nbsp;&nbsp;&nbsp;&nbsp;=> 成功<br/>Assert.equal({},{}) &nbsp;&nbsp;&nbsp;&nbsp;=> 成功<br/>Assert.equal([1],[1]) &nbsp;&nbsp;=> 成功
notEqual       |a!=b(遍历对象)
strongEqual    | typeof(a)==typeof(b) && equal(a,b) |Assert.strongEqual(1,'1') => 失败
strongNotEqual | typeof(a)!=typeof(b) \|\| notEqual(a,b)
same           | a===b |Assert.same(1,'1') &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> 失败<br/>Assert.same({},{}) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> 失败<br/>a=b={},Assert.same(a,b) &nbsp;=> 成功
notSame        | a!==b
isTrue         | !!a | Assert.isTrue(0) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> 失败<br/>Assert.isTrue(false) &nbsp;&nbsp;&nbsp;&nbsp;=> 失败<br/>Assert.isTrue("") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> 失败<br/> Assert.isTrue(null) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> 失败<br/> Assert.isTrue(undefined) => 失败
isFalse        | !a
isEmpty        | !a  |Assert.isEmpty("") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> 成功
isNotEmpty     | !!a
isNull         | a===null | Assert.isNull(null) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> 成功<br/> Assert.isNull(undefined) => 失败
isNotNull      | a!==null
isUndefined    | a===undefined | Assert.isUndefined(undefined) => 成功<br/> Assert.isUndefined(null) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> 失败
isNotUndefined | a!==undefined
isBool         | typeof(a)=="boolean" | Assert.isBool(undefined) => 失败<br/> Assert.isBool(null) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> 失败<br/> Assert.isBool(0) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> 失败<br/> Assert.isBool("") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> 失败
isArray        | Array.isArray(a) |  Assert.isArray([]) &nbsp;=> 成功<br/>  Assert.isArray({}) &nbsp;=> 失败
isObject       | a!=null && typeof(a)=="object" && <br/>!Array.isArray(a) |  Assert.isObject({}) => 成功<br/>  Assert.isObject([]) => 失败
isString       | typeof(a)=="string" | Assert.isString("") => 成功
isNumber       | typeof(a)=="number" | Assert.isString(1) &nbsp;=> 成功
success        | true | Assert.success() &nbsp;&nbsp;&nbsp;=> 成功
fail           | false | Assert.fail() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=> 失败

<h2 align="center">示例</h2>

基于webpack + typescript + vue(ui测试)

[https://github.com/xxxxst/example-tsunit](https://github.com/xxxxst/example-tsunit)

