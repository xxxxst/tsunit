"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = require("./Assert");
var ComCtl = (function () {
    function ComCtl() {
    }
    ComCtl.ready = function (fun) {
        var _this = this;
        this.runTestQueue.push(fun);
        if (this.nowTestStatus == "run") {
            return;
        }
        if (document.readyState == "complete") {
            setTimeout(function () { return _this.readyComplate(); }, 1);
            return;
        }
        this.nowTestStatus = "run";
        if (document.addEventListener) {
            window.addEventListener("load", function () { return _this.readyComplate(); }, false);
        }
        else {
            window["attachEvent"]("onload", function () { return _this.readyComplate(); });
        }
    };
    ComCtl.readyComplate = function () {
        this.nowTestStatus = "run";
        if (this.runTestQueue.length == 0) {
            this.nowTestStatus = "wait";
            return;
        }
        if (this.startTime < 0) {
            this.startTime = (new Date()).getTime();
        }
        var fun = this.runTestQueue.shift();
        fun();
    };
    ComCtl.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.arrConsoleInfoCache.push({
            args: args,
            type: "info",
        });
    };
    ComCtl.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.arrConsoleInfoCache.push({
            args: args,
            type: "error",
        });
    };
    ComCtl.createTestStore = function (funName, fun, isIgnore) {
        if (isIgnore === void 0) { isIgnore = false; }
        return {
            name: funName,
            isIgnore: isIgnore,
            isSync: true,
            fun: fun,
            arrArgs: []
        };
    };
    ComCtl.getClassName = function (funClass) {
        var str = funClass.toString();
        /^(function )(.*?)(?=\()/.test(str);
        RegExp.$2;
        return RegExp.$2 || "";
    };
    ComCtl.finishTestClass = function () {
        var _this = this;
        this.nowTestStatus = "wait";
        if (this.runTestQueue.length != 0) {
            setTimeout(function () { return _this.readyComplate(); }, 0);
            return;
        }
        if (this.arrNotTestClass.length == 0) {
            var endTime = (new Date()).getTime();
            var strTime = this.formatTime(endTime - this.startTime);
            var strInfo = Assert_1.default.lang.testEndDesc;
            var arrInfo = this.spriteInsert(strInfo, ["{time}", "{success}", "{failed}", "{total}"], [strTime, this.successCount, this.failedCount, this.successCount + this.failedCount]);
            this.info.apply(this, arrInfo);
            this.startTime = -1;
            this.successCount = 0;
            this.failedCount = 0;
            for (var i = 0; i < this.arrConsoleInfoCache.length; ++i) {
                var args = this.arrConsoleInfoCache[i].args;
                var type = this.arrConsoleInfoCache[i].type;
                console[type].apply(console, args);
            }
            this.arrConsoleInfoCache = [];
        }
    };
    ComCtl.showSuccess = function (funName, time) {
        funName += "()";
        var maxFunSize = 25;
        for (var i = funName.length; i < maxFunSize; ++i) {
            funName += " ";
        }
        if (funName.length > maxFunSize) {
            funName = funName.substr(0, maxFunSize - 3) + "...";
        }
        var strTime = this.formatTime(time);
        var strInfo = Assert_1.default.lang.successDesc;
        strInfo = strInfo.replace(/\{funName\}/g, "" + funName);
        strInfo = strInfo.replace(/\{time\}/g, "" + strTime);
        this.info(strInfo);
    };
    ComCtl.formatTime = function (time) {
        var strTime = "";
        var unit = "";
        var unitTime = time;
        if (time < 1000) {
            unitTime = (time).toFixed(0);
            unit = Assert_1.default.lang.millisecond;
        }
        else if (time < 60 * 1000) {
            unitTime = (time / 1000).toFixed(0);
            unit = Assert_1.default.lang.second;
        }
        else if (time < 60 * 60 * 1000) {
            unitTime = (time / 60 / 1000).toFixed(0);
            unit = Assert_1.default.lang.minute;
        }
        if (unitTime <= 1) {
            unitTime = "<1";
        }
        unitTime = unitTime.toString();
        var count = 4;
        if (unitTime.length < count) {
            strTime = ("    " + unitTime);
            strTime = strTime.substr(strTime.length - count);
        }
        else {
            strTime = unitTime;
        }
        strTime += unit;
        return strTime;
    };
    ComCtl.showError = function (desc, expected, actual, callName, info) {
        if (info === void 0) { info = ""; }
        var strFun = ComCtl.nowTestFunName;
        if (ComCtl.nowClassFunName != "") {
            strFun = ComCtl.nowClassFunName + "." + strFun + "()";
        }
        var lineUrl = "";
        try {
            var a = {}[""][""];
        }
        catch (ex) {
            var arr = ex.stack.split("\n");
            if (arr.length > 4) {
                ex.message = "";
                ex.stack = "TypeError:\n" + arr[4];
                lineUrl = ex;
            }
        }
        var showDesc = (desc || ComCtl.nowTestFunName + "()");
        var strInfo = Assert_1.default.lang.failedDesc;
        if (callName !== undefined && callName != "") {
            callName = callName + "()";
        }
        strInfo = this.replaceStr(strInfo, "desc", desc);
        strInfo = this.replaceStr(strInfo, "callName", callName);
        strInfo = this.replaceStr(strInfo, "url", "");
        strInfo = this.replaceStr(strInfo, "expected", expected);
        strInfo = this.replaceStr(strInfo, "actual", actual);
        strInfo = strInfo.replace(/\{desc\}/g, showDesc);
        strInfo = strInfo.replace(/\{callName\}/g, "" + callName);
        var arrInfo = this.spriteInsert(strInfo, ["{expected}", "{actual}", "{url}"], [expected, actual, lineUrl]);
        if (ComCtl.isArray(info)) {
            info.forEach(function (item) {
                arrInfo.push(item);
            });
        }
        else if (info !== undefined) {
            arrInfo.push(info);
        }
        this.error.apply(this, arrInfo);
    };
    ComCtl.spriteInsert = function (strInput, arrSplit, arrInsert) {
        var arr = [strInput];
        for (var i = 0; i < arrSplit.length; ++i) {
            var arrTemp = [];
            arr.forEach(function (item) {
                if (typeof (item) == "number") {
                    arrTemp.push(item);
                    return;
                }
                var arr2 = item.split(arrSplit[i]);
                arr2.forEach(function (item2) {
                    arrTemp.push(item2);
                    arrTemp.push(i);
                });
                arrTemp.pop();
            });
            arr = arrTemp;
        }
        for (var i = 0; i < arr.length; ++i) {
            if (typeof (arr[i]) == "number") {
                arr[i] = arrInsert[arr[i]];
            }
        }
        return arr;
    };
    ComCtl.replaceStr = function (strInfo, name, value) {
        if (value === undefined) {
            strInfo = strInfo.replace(new RegExp("\\([^\\(\\)\\{\\}]*\\{" + name + "\\}[^\\(\\){\\}]*\\)", "g"), "");
            strInfo = strInfo.replace(new RegExp("\\{" + name + "\\}", "g"), "");
            value = "";
        }
        else {
            strInfo = strInfo.replace(new RegExp("\\(([^\\(\\)\\{\\}]*\\{" + name + "\\}[^\\(\\)\\{\\}]*)\\)", "g"), "$1");
        }
        return strInfo;
    };
    ComCtl.showExceptionError = function (desc, ex) {
        var showDesc = (desc || ComCtl.nowTestFunName + "()");
        var strInfo = Assert_1.default.lang.exceptionDesc;
        strInfo = strInfo.replace(/\{desc\}/g, showDesc);
        var arrInfo = strInfo.split("{info}");
        var newArrInfo = [];
        arrInfo.forEach(function (item) {
            newArrInfo.push(item);
            newArrInfo.push(ex);
        });
        newArrInfo.pop();
        this.error.apply(this, newArrInfo);
    };
    ComCtl.showNotUseAssertError = function () {
        var showDesc = (ComCtl.nowTestFunName + "()");
        var strInfo = Assert_1.default.lang.notUseAssertDesc;
        strInfo = strInfo.replace(/\{desc\}/g, showDesc);
        this.error(strInfo);
    };
    ComCtl.isArray = function (value) {
        if (typeof Array.isArray === "function") {
            return Array.isArray(value);
        }
        else {
            return Object.prototype.toString.call(value) === "[object Array]";
        }
    };
    ComCtl.compileValue = function (expected, actual, isStrict) {
        var isOk = true;
        var info = "";
        var errType = "";
        if (typeof (actual) != typeof (expected)) {
            if (isStrict) {
                isOk = false;
            }
            else {
                isOk = (expected == actual);
            }
            if (!isOk) {
                info += Assert_1.default.lang.typeNotEqual;
            }
        }
        else if (typeof (expected) == "string") {
            if (expected != actual) {
                isOk = false;
                info += this.getStringPostion(expected, actual);
            }
        }
        else if (expected == null || actual == null) {
            isOk = (expected == actual);
        }
        else if (typeof (expected) == "object") {
            var isArr1 = ComCtl.isArray(expected);
            var isArr2 = ComCtl.isArray(actual);
            if (isArr1 && isArr1) {
                errType = "array";
                if (expected.length != actual.length) {
                    isOk = false;
                    info += "[" + (Math.min(expected.length, actual.length) + 1) + "]" + infoTemp;
                }
                else {
                    for (var i = 0; i < expected.length; ++i) {
                        var _a = this.compileValue(expected[i], actual[i], isStrict), isOkTemp = _a[0], infoTemp = _a[1], typeTemp = _a[2];
                        if (!isOkTemp) {
                            isOk = false;
                            switch (typeTemp) {
                                case "object":
                                    info += "[" + i + "]." + infoTemp;
                                    break;
                                case "array":
                                    info += "[" + i + "]" + infoTemp;
                                    break;
                                default:
                                    info += "[" + i + "]  " + infoTemp;
                                    break;
                            }
                            break;
                        }
                    }
                }
            }
            else if (!isArr1 && !isArr2) {
                errType = "object";
                var keys = {};
                for (var key in expected) {
                    keys[key] = null;
                    var _b = this.compileValue(expected[key], actual[key], isStrict), isOkTemp = _b[0], infoTemp = _b[1], typeTemp = _b[2];
                    if (!isOkTemp) {
                        isOk = false;
                        switch (typeTemp) {
                            case "object":
                                info += key + "." + infoTemp;
                                break;
                            case "array":
                                info += "" + key + infoTemp;
                                break;
                            default:
                                info += key + "  " + infoTemp;
                                break;
                        }
                        keys = {};
                        break;
                    }
                }
                if (isOk) {
                    for (var key in actual) {
                        if (!(key in keys)) {
                            isOk = false;
                            info += "." + key;
                            break;
                        }
                    }
                }
            }
            else {
                isOk = false;
            }
        }
        else {
            if (isStrict) {
                isOk = (expected === actual);
            }
            else {
                isOk = (expected == actual);
            }
        }
        if (isOk) {
            info = "";
        }
        return [isOk, info, errType];
    };
    ComCtl.getStringPostion = function (expected, actual) {
        var rol = 0;
        var col = 0;
        var info = "";
        for (var i = 0; i < expected.length; ++i) {
            if (i >= actual.length) {
                break;
            }
            var ch = expected.charAt(i);
            if (ch == "\n") {
                ++rol;
                col = 0;
                continue;
            }
            if (ch != actual.charAt(i)) {
                var count = actual.indexOf("\n", i);
                if (count < 0) {
                    count = 20;
                }
                info = actual.substr(i, count - i);
                break;
            }
            ++col;
        }
        var str = Assert_1.default.lang.positionDesc;
        str = str.replace(/\{position\}/g, rol + ":" + col + " " + info);
        return str;
    };
    ComCtl.nowClassFunName = "";
    ComCtl.nowTestFunName = "";
    ComCtl.arrNotTestClass = [];
    ComCtl.nowTestStatus = "wait";
    ComCtl.runTestQueue = [];
    ComCtl.successCount = 0;
    ComCtl.failedCount = 0;
    ComCtl.startTime = -1;
    ComCtl.arrConsoleInfoCache = [];
    return ComCtl;
}());
exports.default = ComCtl;
