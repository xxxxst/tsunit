"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ComCtl_1 = require("./ComCtl");
var TestClassCtl_1 = require("./TestClassCtl");
var Assert = (function () {
    function Assert() {
    }
    Assert.run = function (className) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        TestClassCtl_1.default.runTest.apply(TestClassCtl_1.default, [className].concat(args));
    };
    Assert.setLang = function (_lang) {
        for (var key in _lang) {
            this.lang[key] = _lang[key];
        }
    };
    Assert.equal = function (expected, actual, desc) {
        if (desc === void 0) { desc = ""; }
        var funName = "equal";
        var _a = ComCtl_1.default.compileValue(expected, actual, false), isOk = _a[0], info = _a[1];
        this.showResult(isOk, desc, expected, actual, funName, info && "\r\n" + this.lang.info + " " + info);
    };
    Assert.notEqual = function (expected, actual, desc) {
        if (desc === void 0) { desc = ""; }
        var funName = "notEqual";
        var _a = ComCtl_1.default.compileValue(expected, actual, false), isOk = _a[0], _ = _a[1];
        this.showResult(!isOk, desc, undefined, actual, funName, "");
    };
    Assert.strongEqual = function (expected, actual, desc) {
        if (desc === void 0) { desc = ""; }
        var funName = "strongEqual";
        var _a = ComCtl_1.default.compileValue(expected, actual, true), isOk = _a[0], info = _a[1];
        this.showResult(isOk, desc, expected, actual, funName, info && "\r\n" + this.lang.info + " " + info);
    };
    Assert.strongNotEqual = function (expected, actual, desc) {
        if (desc === void 0) { desc = ""; }
        var funName = "strongNotEqual";
        var _a = ComCtl_1.default.compileValue(expected, actual, true), isOk = _a[0], _ = _a[1];
        this.showResult(!isOk, desc, undefined, actual, funName, "");
    };
    Assert.same = function (expected, actual, desc) {
        if (desc === void 0) { desc = ""; }
        var funName = "same";
        var isOk = (actual === expected);
        var info = "";
        if (!isOk) {
            if (typeof (actual) != typeof (expected)) {
                info = Assert.lang.typeNotEqual;
            }
            else if (typeof (actual) == "object") {
                info = Assert.lang.notSameObject;
            }
            else if (typeof (actual) == "string") {
                info = ComCtl_1.default.getStringPostion(expected, actual);
            }
        }
        this.showResult(isOk, desc, expected, actual, funName, info && "\r\n" + Assert.lang.info + " " + info);
    };
    Assert.notSame = function (expected, actual, desc) {
        if (desc === void 0) { desc = ""; }
        var funName = "notSame";
        var isOk = !(actual === expected);
        this.showResult(isOk, desc, expected, actual, funName);
    };
    Assert.isTrue = function (actual, desc) {
        if (desc === void 0) { desc = ""; }
        var funName = "isTrue";
        var isOk = !!actual;
        this.showResult(isOk, desc, undefined, actual, funName);
    };
    Assert.isFalse = function (actual, desc) {
        if (desc === void 0) { desc = ""; }
        var funName = "isFalse";
        var isOk = !actual;
        this.showResult(isOk, desc, undefined, actual, funName);
    };
    Assert.isEmpty = function (actual, desc) {
        if (desc === void 0) { desc = ""; }
        var funName = "isEmpty";
        var isOk = !actual;
        this.showResult(isOk, desc, undefined, actual, funName);
    };
    Assert.isNotEmpty = function (actual, desc) {
        if (desc === void 0) { desc = ""; }
        var funName = "isNotEmpty";
        var isOk = !!actual;
        this.showResult(isOk, desc, undefined, actual, funName);
    };
    Assert.isNull = function (actual, desc) {
        if (desc === void 0) { desc = ""; }
        var funName = "isNull";
        var isOk = (actual === null);
        this.showResult(isOk, desc, undefined, actual, funName);
    };
    Assert.isNotNull = function (actual, desc) {
        if (desc === void 0) { desc = ""; }
        var funName = "isNotNull";
        var isOk = !(actual === null);
        this.showResult(isOk, desc, undefined, actual, funName);
    };
    Assert.isBool = function (actual, desc) {
        if (desc === void 0) { desc = ""; }
        var funName = "isBool";
        var isOk = (typeof (actual) == "boolean");
        this.showResult(isOk, desc, undefined, actual, funName);
    };
    Assert.isUndefined = function (actual, desc) {
        if (desc === void 0) { desc = ""; }
        var funName = "isUndefined";
        var isOk = (actual === undefined);
        this.showResult(isOk, desc, undefined, actual, funName);
    };
    Assert.isNotUndefined = function (actual, desc) {
        if (desc === void 0) { desc = ""; }
        var funName = "isNotUndefined";
        var isOk = !(actual === undefined);
        this.showResult(isOk, desc, undefined, actual, funName);
    };
    Assert.isArray = function (actual, desc) {
        if (desc === void 0) { desc = ""; }
        var funName = "isArray";
        var isOk = (actual && this._isArray(actual));
        this.showResult(isOk, desc, undefined, actual, funName);
    };
    Assert.isObject = function (actual, desc) {
        if (desc === void 0) { desc = ""; }
        var funName = "isObject";
        var isOk = (actual && typeof (actual) == "object" && !this._isArray(actual));
        this.showResult(isOk, desc, undefined, actual, funName);
    };
    Assert.isString = function (actual, desc) {
        if (desc === void 0) { desc = ""; }
        var funName = "isString";
        var isOk = (typeof (actual) == "string");
        this.showResult(isOk, desc, undefined, actual, funName);
    };
    Assert.isNumber = function (actual, desc) {
        if (desc === void 0) { desc = ""; }
        var funName = "isNumber";
        var isOk = (typeof (actual) == "number");
        this.showResult(isOk, desc, undefined, actual, funName);
    };
    Assert.success = function (desc) {
        if (desc === void 0) { desc = ""; }
        var funName = "success";
        this.showResult(true, desc, undefined, undefined, funName);
    };
    Assert.fail = function (desc) {
        if (desc === void 0) { desc = ""; }
        var funName = "failed";
        this.showResult(false, desc, undefined, undefined, funName);
    };
    Assert._isArray = function (o) {
        if (typeof Array.isArray === "function") {
            return Array.isArray(o);
        }
        else {
            return Object.prototype.toString.call(o) === "[object Array]";
        }
    };
    Assert.showResult = function (isOk, desc, expected, actual, callName, info) {
        if (info === void 0) { info = ""; }
        if (!isOk) {
            ++ComCtl_1.default.failedCount;
            ComCtl_1.default.showError(desc, expected, actual, callName, info);
        }
        else {
            ++ComCtl_1.default.successCount;
        }
    };
    Assert.lang = {};
    Assert.lang_zh_cn = {
        typeNotEqual: "类型不同",
        notSameObject: "不是同一个对象",
        info: "[  信息]",
        startTest: "开始测试：",
        notUseAssert: "没有使用Assert",
        millisecond: "毫秒",
        second: "秒",
        minute: "分钟",
        successDesc: "    [成功] {funName} {time}",
        positionDesc: "位于 {position}",
        failedDesc: "{desc} 失败(, {callName}), {url}(\r\n[期望值] {expected})(\r\n[实际值] {actual})",
        testEndDesc: "测试结束！用时:{time}\r\n成功：{success}\r\n失败：{failed}\r\n总计：{total}",
        exceptionDesc: "{desc} 失败, {info}",
        notUseAssertDesc: "{desc} 失败，没有使用Assert",
    };
    Assert.lang_en_us = {
        typeNotEqual: "type not equal",
        notSameObject: "not the same object",
        info: "[  Info]",
        startTest: "test start：",
        notUseAssert: "not use Assert",
        millisecond: "ms",
        second: "s",
        minute: "m",
        successDesc: "    [Success] {funName} {time}",
        positionDesc: "at {position}",
        failedDesc: "{desc} failed(, {callName}), {url}(\r\n[Expect] {expected})(\r\n[Actual] {actual})",
        testEndDesc: "test Finished！Time:{time}\r\nSuccess：{success}\r\nFailed ：{failed}\r\nTotal  ：{total}",
        exceptionDesc: "{desc} failed, {info}",
        notUseAssertDesc: "{desc} failed，not use Assert",
    };
    return Assert;
}());
exports.default = Assert;
Assert.setLang(Assert.lang_en_us);
