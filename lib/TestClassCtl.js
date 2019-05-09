"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ComCtl_1 = require("./ComCtl");
var Assert_1 = require("./Assert");
var TestClassCtl = (function () {
    function TestClassCtl() {
    }
    TestClassCtl.findTestClass = function (className) {
        var arr = ComCtl_1.default.arrNotTestClass;
        for (var i = 0; i < arr.length; ++i) {
            if (arr[i].className == className) {
                return arr[i];
            }
        }
        return null;
    };
    TestClassCtl.isClassWait = function (className) {
        var item = this.findTestClass(className);
        return item && item.status == 'wait';
    };
    TestClassCtl.isClassRun = function (className) {
        var item = this.findTestClass(className);
        return item && item.status == 'run';
    };
    TestClassCtl.isClassTested = function (className) {
        var item = this.findTestClass(className);
        return item == null;
    };
    TestClassCtl.addClass = function (className) {
        if (this.findTestClass(className) != null) {
            return;
        }
        var item = {
            className: className,
            status: 'wait',
        };
        ComCtl_1.default.arrNotTestClass.push(item);
    };
    TestClassCtl.removeClass = function (className) {
        var arr = ComCtl_1.default.arrNotTestClass;
        for (var i = 0; i < arr.length; ++i) {
            if (arr[i].className == className) {
                arr.splice(i, 1);
                return;
            }
        }
    };
    TestClassCtl.runTest = function (target) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var storeName = this.testStoreName;
        var tag = new (target.bind.apply(target, [void 0].concat(args)))();
        ComCtl_1.default.ready(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, itemClass, _c, _d, _i, funName, item, successCount, failedCount, utc1, i, args, ex_1, arr, utc2;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        itemClass = this.findTestClass(target);
                        if (itemClass == null || itemClass.status != "wait") {
                            return [2];
                        }
                        itemClass.status = "run";
                        ComCtl_1.default.nowClassFunName = ComCtl_1.default.getClassName(target);
                        ComCtl_1.default.info("" + Assert_1.default.lang.startTest + ComCtl_1.default.nowClassFunName);
                        _c = [];
                        for (_d in tag[storeName])
                            _c.push(_d);
                        _i = 0;
                        _e.label = 1;
                    case 1:
                        if (!(_i < _c.length)) return [3, 11];
                        funName = _c[_i];
                        item = tag[storeName][funName];
                        if (item.isIgnore) {
                            return [3, 10];
                        }
                        successCount = ComCtl_1.default.successCount;
                        failedCount = ComCtl_1.default.failedCount;
                        utc1 = (new Date()).getTime();
                        ComCtl_1.default.nowTestFunName = funName;
                        i = 0;
                        _e.label = 2;
                    case 2:
                        if (!(i < item.arrArgs.length)) return [3, 9];
                        args = item.arrArgs[i];
                        _e.label = 3;
                    case 3:
                        _e.trys.push([3, 7, , 8]);
                        if (!item.isSync) return [3, 4];
                        (_a = item.fun).call.apply(_a, [tag].concat(args));
                        return [3, 6];
                    case 4: return [4, (_b = item.fun).call.apply(_b, [tag].concat(args))];
                    case 5:
                        _e.sent();
                        _e.label = 6;
                    case 6: return [3, 8];
                    case 7:
                        ex_1 = _e.sent();
                        ++ComCtl_1.default.failedCount;
                        arr = ex_1.stack.split("\n");
                        if (arr.length > 1) {
                            ex_1.stack = "TypeError:\n" + arr[1];
                        }
                        ComCtl_1.default.showExceptionError("", ex_1);
                        return [3, 8];
                    case 8:
                        ++i;
                        return [3, 2];
                    case 9:
                        utc2 = (new Date()).getTime();
                        if (ComCtl_1.default.successCount == successCount && ComCtl_1.default.failedCount == failedCount) {
                            ++ComCtl_1.default.failedCount;
                            ComCtl_1.default.showNotUseAssertError();
                        }
                        else if (ComCtl_1.default.failedCount == failedCount) {
                            ComCtl_1.default.showSuccess(funName, utc2 - utc1);
                        }
                        _e.label = 10;
                    case 10:
                        _i++;
                        return [3, 1];
                    case 11:
                        this.removeClass(target);
                        ComCtl_1.default.finishTestClass();
                        return [2];
                }
            });
        }); });
    };
    TestClassCtl.testStoreName = "$__tsunit__";
    return TestClassCtl;
}());
exports.default = TestClassCtl;
