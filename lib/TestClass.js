"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ComCtl_1 = require("./ComCtl");
var TestClassCtl_1 = require("./TestClassCtl");
function TestClass(option) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    function create(target) {
        TestClassCtl_1.default.addClass(target);
        var defOpt = {
            autoRun: true
        };
        var opt = defOpt;
        for (var key in option) {
            opt[key] = option[key];
        }
        if (!opt.autoRun) {
            return;
        }
        TestClassCtl_1.default.runTest.apply(TestClassCtl_1.default, [target].concat(args));
    }
    return create;
}
exports.TestClass = TestClass;
function Test() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return _LogicTest.apply(void 0, [TestClassCtl_1.default.testStoreName, true].concat(args));
}
exports.Test = Test;
function AsyncTest() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return _LogicTest.apply(void 0, [TestClassCtl_1.default.testStoreName, false].concat(args));
}
exports.AsyncTest = AsyncTest;
function _LogicTest(storeName, sync) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    function create(targetSub, keySub, descriptor) {
        var map = targetSub[storeName] || (targetSub[storeName] = {});
        map[keySub] = map[keySub] || ComCtl_1.default.createTestStore(keySub, descriptor.value);
        var item = map[keySub];
        item.isSync = sync;
        item.arrArgs.push(args);
    }
    return create;
}
function Ignore() {
    var storeName = TestClassCtl_1.default.testStoreName;
    function create(targetSub, keySub, descriptor) {
        var map = targetSub[storeName] || (targetSub[storeName] = {});
        map[keySub] = map[keySub] || ComCtl_1.default.createTestStore(keySub, descriptor.value, true);
        map[keySub].isIgnore = true;
    }
    return create;
}
exports.Ignore = Ignore;
