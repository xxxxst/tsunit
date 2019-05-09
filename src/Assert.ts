
import ComCtl from './ComCtl';
import TestClassCtl from './TestClassCtl';

export default class Assert {
	static lang:any = {};

	static lang_zh_cn = {
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

	static lang_en_us = {
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

	static run(className: any, ...args) {
		TestClassCtl.runTest(className, ...args);
	}

	static setLang(_lang) {
		for (var key in _lang) {
			this.lang[key] = _lang[key];
		}
	}

	static equal(expected:any, actual:any, desc: string = ""){
		var funName = "equal";
		var [isOk, info] = ComCtl.compileValue(expected, actual, false);
		this.showResult(isOk, desc, expected, actual, funName, info&&`\r\n${this.lang.info} ${info}`);
	}

	static notEqual(expected:any, actual:any, desc: string = ""){
		var funName = "notEqual";
		var [isOk, _] = ComCtl.compileValue(expected, actual, false);
		this.showResult(!isOk, desc, undefined, actual, funName, "");
	}

	static strongEqual(expected:any, actual:any, desc: string = ""){
		var funName = "strongEqual";
		var [isOk, info] = ComCtl.compileValue(expected, actual, true);
		this.showResult(isOk, desc, expected, actual, funName, info&&`\r\n${this.lang.info} ${info}`);
	}

	static strongNotEqual(expected:any, actual:any, desc: string = ""){
		var funName = "strongNotEqual";
		var [isOk, _] = ComCtl.compileValue(expected, actual, true);
		this.showResult(!isOk, desc, undefined, actual, funName, "");
	}

	// private static _equal(expected, actual, desc: string = "", isStrict:Boolean = false) {
	// 	var funName = "equal";
	// 	var [isOk, info] = ComCtl.compileValue(expected, actual, isStrict);
	// 	this.showResult(isOk, desc, expected, actual, funName, info&&`\r\n${this.lang.info} ${info}`);
	// }

	// private static _notEqual(expected, actual, desc: string = "", isStrict:Boolean = false) {
	// 	var funName = "notEqual";
	// 	var [isOk, _] = ComCtl.compileValue(expected, actual, isStrict);
	// 	this.showResult(!isOk, desc, undefined, actual, funName, "");
	// }

	static same(expected:any, actual:any, desc: string = "") {
		var funName = "same";
		var isOk = (actual === expected);
		var info = "";
		if(!isOk){
			if(typeof(actual) != typeof(expected)){
				info = Assert.lang.typeNotEqual;
			}else if(typeof(actual) == "object"){
				info = Assert.lang.notSameObject;
			}else if(typeof(actual) == "string"){
				info = ComCtl.getStringPostion(expected, actual);
			}
		}
		this.showResult(isOk, desc, expected, actual, funName, info&&`\r\n${Assert.lang.info} ${info}`);
	}

	static notSame(expected:any, actual:any, desc: string = "") {
		var funName = "notSame";
		var isOk = !(actual === expected);
		this.showResult(isOk, desc, expected, actual, funName);
	}

	static isTrue(actual:any, desc: string = ""){
		var funName = "isTrue";
		var isOk = !!actual;
		// var isOk = typeof(actual)=="boolean" && actual;
		this.showResult(isOk, desc, undefined, actual, funName);
	}

	static isFalse(actual:any, desc: string = ""){
		var funName = "isFalse";
		var isOk = !actual;
		// var isOk = (typeof(actual)=="boolean" && !actual);
		this.showResult(isOk, desc, undefined, actual, funName);
	}

	static isEmpty(actual:any, desc: string = "") {
		var funName = "isEmpty";
		// var isOk = (actual == "" || actual == null || actual == undefined);
		var isOk = !actual;
		this.showResult(isOk, desc, undefined, actual, funName);
	}

	static isNotEmpty(actual:any, desc: string = "") {
		var funName = "isNotEmpty";
		// var isOk = !(actual == "" || actual == null || actual == undefined);
		var isOk = !!actual;
		this.showResult(isOk, desc, undefined, actual, funName);
	}

	static isNull(actual:any, desc: string = "") {
		var funName = "isNull";
		var isOk = (actual === null);
		this.showResult(isOk, desc, undefined, actual, funName);
	}

	static isNotNull(actual:any, desc: string = "") {
		var funName = "isNotNull";
		var isOk = !(actual === null);
		this.showResult(isOk, desc, undefined, actual, funName);
	}

	static isBool(actual:any, desc: string = "") {
		var funName = "isBool";
		var isOk = (typeof(actual) == "boolean");
		this.showResult(isOk, desc, undefined, actual, funName);
	}

	static isUndefined(actual:any, desc: string = "") {
		var funName = "isUndefined";
		var isOk = (actual === undefined);
		this.showResult(isOk, desc, undefined, actual, funName);
	}

	static isNotUndefined(actual:any, desc: string = "") {
		var funName = "isNotUndefined";
		var isOk = !(actual === undefined);
		this.showResult(isOk, desc, undefined, actual, funName);
	}

	static isArray(actual:any, desc: string = "") {
		var funName = "isArray";
		var isOk = (actual && this._isArray(actual));
		this.showResult(isOk, desc, undefined, actual, funName);
	}

	static isObject(actual:any, desc: string = "") {
		var funName = "isObject";
		var isOk = (actual && typeof(actual) == "object" && !this._isArray(actual));
		this.showResult(isOk, desc, undefined, actual, funName);
	}

	static isString(actual:any, desc: string = "") {
		var funName = "isString";
		var isOk = (typeof(actual) == "string");
		this.showResult(isOk, desc, undefined, actual, funName);
	}

	static isNumber(actual:any, desc: string = "") {
		var funName = "isNumber";
		var isOk = (typeof(actual) == "number");
		this.showResult(isOk, desc, undefined, actual, funName);
	}

	static success(desc: string = "") {
		var funName = "success";
		this.showResult(true, desc, undefined, undefined, funName);
	}

	static fail(desc: string = "") {
		var funName = "failed";
		this.showResult(false, desc, undefined, undefined, funName);
	}
	
	private static _isArray(o) {
		if (typeof Array.isArray === "function") {
			return Array.isArray(o);
		} else {
			return Object.prototype.toString.call(o) === "[object Array]";
		}
	}

	private static showResult(isOk: Boolean, desc: string, expected, actual, callName: string, info: any = "") {
		if (!isOk) {
			++ComCtl.failedCount;
			ComCtl.showError(desc, expected, actual, callName, info);
			// console.error.apply(this, this.showError(desc, undefined, actual, "isNotUndefined"));
		} else {
			++ComCtl.successCount;
			// ComCtl.showSuccess(desc, funName);
		}
	}
}

// Assert.setLang(Assert.lang_zh_cn);
Assert.setLang(Assert.lang_en_us);
