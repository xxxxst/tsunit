
import Assert from "./Assert";

export default class ComCtl {
	static nowClassFunName = "";
	static nowTestFunName = "";
	static arrNotTestClass:{className:any, status:'wait'|'run'}[] = [];
	
	private static nowTestStatus:"wait"|"run" = "wait";
	private static runTestQueue = [];

	// static finishedClassCount = 0;
	// static totalClassCount = 0;
	static successCount = 0;
	static failedCount = 0;

	private static startTime = -1;

	private static arrConsoleInfoCache = [];

	static ready(fun) {
		// ++this.totalClassCount;

		this.runTestQueue.push(fun);
		if(this.nowTestStatus == "run") {
			return;
		}

		if (document.readyState == "complete") {
			setTimeout(()=>this.readyComplate(), 1);
			return;
		}
		this.nowTestStatus = "run";

		if (document.addEventListener) {
			window.addEventListener("load", ()=>this.readyComplate(), false);
		} else {
			window["attachEvent"]("onload", ()=>this.readyComplate());
		}
	}

	private static readyComplate() {
		this.nowTestStatus = "run";
		if(this.runTestQueue.length == 0){
			this.nowTestStatus = "wait";
			return;
		}

		if(this.startTime < 0){
			this.startTime = (new Date()).getTime();
 		}

		var fun = this.runTestQueue.shift();
		fun();
	}

	// console.info
	static info(...args){
		this.arrConsoleInfoCache.push({
			args:args,
			type:"info",
		})
	}

	// console.error
	static error(...args){
		this.arrConsoleInfoCache.push({
			args:args,
			type:"error",
		})
	}

	static createTestStore(funName: string, fun: Function, isIgnore: boolean = false) {
		return {
			name: funName,
			isIgnore: isIgnore,
			isSync: true,
			fun: fun,
			arrArgs: []
		};
	}

	static getClassName(funClass) {
		var str = funClass.toString();
		/^(function )(.*?)(?=\()/.test(str); RegExp.$2;
		return RegExp.$2 || "";
	}

	static finishTestClass() {
		// var strTime = this.formatTime(time);
		this.nowTestStatus = "wait";
		if(this.runTestQueue.length != 0) {
			setTimeout(()=>this.readyComplate(), 0);
			return;
		}

		// ++this.finishedClassCount;
		if(this.arrNotTestClass.length == 0) {
			var endTime = (new Date()).getTime();
			var strTime = this.formatTime(endTime - this.startTime);

			// if (this.finishedClassCount == this.totalClassCount) {
			var strInfo = Assert.lang.testEndDesc;
			// strInfo = strInfo.replace(/\{className\}/g, this.nowClassFunName);
			// strInfo = strInfo.replace(/\{time\}/g, `${strTime}`);
			// strInfo = strInfo.replace(/\{success\}/g, this.successCount.toString());
			// strInfo = strInfo.replace(/\{failed\}/g, this.failedCount.toString());
			// strInfo = strInfo.replace(/\{total\}/g, (this.successCount + this.failedCount).toString());
			var arrInfo = this.spriteInsert(strInfo, ["{time}", "{success}", "{failed}", "{total}"],
			[strTime, this.successCount, this.failedCount, this.successCount + this.failedCount]);
			// console.info(strInfo);
			this.info(...arrInfo);

			// clear
			// this.totalClassCount = 0;
			// this.finishedClassCount = 0;
			this.startTime = -1;
			this.successCount = 0;
			this.failedCount = 0;

			for(var i = 0; i < this.arrConsoleInfoCache.length; ++i){
				var args = this.arrConsoleInfoCache[i].args;
				var type = this.arrConsoleInfoCache[i].type;
				console[type](...args);
			}
			this.arrConsoleInfoCache = [];
		}
	}

	static showSuccess(funName: string, time) {
		funName += "()";
		var maxFunSize = 25;
		for (var i = funName.length; i < maxFunSize; ++i) {
			funName += " ";
		}
		if (funName.length > maxFunSize) {
			funName = funName.substr(0, maxFunSize - 3) + "...";
		}
		var strTime = this.formatTime(time);

		var strInfo = Assert.lang.successDesc;
		strInfo = strInfo.replace(/\{funName\}/g, `${funName}`);
		strInfo = strInfo.replace(/\{time\}/g, `${strTime}`);
		// console.info(strInfo);
		this.info(strInfo);
	}

	static formatTime(time) {
		var strTime = "";
		var unit = "";
		var unitTime = time;

		if (time < 1000) {
			// 毫秒
			unitTime = (time).toFixed(0);
			unit = Assert.lang.millisecond;
		} else if (time < 60 * 1000) {
			// 秒
			unitTime = (time / 1000).toFixed(0);
			unit = Assert.lang.second;
		} else if (time < 60 * 60 * 1000) {
			// 分钟
			unitTime = (time / 60 / 1000).toFixed(0);
			unit = Assert.lang.minute;
		}
		if (unitTime <= 1) {
			unitTime = "<1";
		}
		unitTime = unitTime.toString();

		var count = 4;
		if (unitTime.length < count) {
			strTime = ("    " + unitTime);
			strTime = strTime.substr(strTime.length - count);
		} else {
			strTime = unitTime;
		}
		strTime += unit;
		return strTime;
	}

	static showError(desc: string, expected, actual, callName: string, info: any = "") {
		var strFun = ComCtl.nowTestFunName;
		if (ComCtl.nowClassFunName != "") {
			strFun = `${ComCtl.nowClassFunName}.${strFun}()`;
		}

		var lineUrl = "";
		try {
			var a = {}[""][""];
		} catch (ex) {
			var arr = ex.stack.split("\n");
			if (arr.length > 4) {
				ex.message = "";
				ex.stack = "TypeError:\n" + arr[4];
				lineUrl = ex;
			}
		}

		var showDesc = (desc || `${ComCtl.nowTestFunName}()`);

		var strInfo = Assert.lang.failedDesc;
		if (callName !== undefined && callName != "") {
			callName = `${callName}()`;
		}
		strInfo = this.replaceStr(strInfo, "desc", desc);
		strInfo = this.replaceStr(strInfo, "callName", callName);
		strInfo = this.replaceStr(strInfo, "url", "");
		strInfo = this.replaceStr(strInfo, "expected", expected);
		strInfo = this.replaceStr(strInfo, "actual", actual);

		strInfo = strInfo.replace(/\{desc\}/g, showDesc);
		strInfo = strInfo.replace(/\{callName\}/g, `${callName}`);

		var arrInfo = this.spriteInsert(strInfo, ["{expected}", "{actual}", "{url}"],
			[expected, actual, lineUrl]);

		if (ComCtl.isArray(info)) {
			info.forEach(item => {
				arrInfo.push(item);
			});
		} else if (info !== undefined) {
			arrInfo.push(info);
		}

		// console.error.apply(this, arrInfo);
		this.error(...arrInfo);
	}

	// 分割字符串并在分割处插入数据
	// split string and insert data
	private static spriteInsert(strInput, arrSplit, arrInsert) {
		var arr = [strInput];
		for (var i = 0; i < arrSplit.length; ++i) {
			var arrTemp = [];
			arr.forEach(item => {
				if (typeof (item) == "number") {
					arrTemp.push(item);
					return;
				}
				var arr2 = item.split(arrSplit[i]);
				arr2.forEach(item2 => {
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
	}

	static replaceStr(strInfo, name, value) {
		if (value === undefined) {
			strInfo = strInfo.replace(new RegExp(`\\([^\\(\\)\\{\\}]*\\{${name}\\}[^\\(\\)\{\\}]*\\)`, "g"), "");
			strInfo = strInfo.replace(new RegExp(`\\{${name}\\}`, "g"), "");
			value = "";
		} else {
			strInfo = strInfo.replace(new RegExp(`\\(([^\\(\\)\\{\\}]*\\{${name}\\}[^\\(\\)\\{\\}]*)\\)`, "g"), "$1");
		}
		return strInfo;
	}

	static showExceptionError(desc: string, ex) {
		var showDesc = (desc || `${ComCtl.nowTestFunName}()`);

		var strInfo = Assert.lang.exceptionDesc;
		strInfo = strInfo.replace(/\{desc\}/g, showDesc);
		var arrInfo = strInfo.split("{info}");
		var newArrInfo = [];
		arrInfo.forEach(item => {
			newArrInfo.push(item);
			newArrInfo.push(ex);
		});
		newArrInfo.pop();

		// console.error.apply(this, newArrInfo);
		this.error(...newArrInfo);
	}

	static showNotUseAssertError() {
		var showDesc = (`${ComCtl.nowTestFunName}()`);

		var strInfo = Assert.lang.notUseAssertDesc;
		strInfo = strInfo.replace(/\{desc\}/g, showDesc);

		// console.error(strInfo);
		this.error(strInfo);
	}

	static isArray(value) {
		if (typeof Array.isArray === "function") {
			return Array.isArray(value);
		} else {
			return Object.prototype.toString.call(value) === "[object Array]";
		}
	}

	static compileValue(expected, actual, isStrict: Boolean): [boolean, string, any] {
		var isOk = true;

		var info = "";
		var errType = "";
		if (typeof (actual) != typeof (expected)) {
			// 类型不同
			if (isStrict) {
				isOk = false;
			} else {
				isOk = (expected == actual);
			}
			if (!isOk) {
				info += Assert.lang.typeNotEqual;
			}
			// info = "";
		} else if (typeof (expected) == "string") {
			// 字符串
			if (expected != actual) {
				isOk = false;
				info += this.getStringPostion(expected, actual);
			}
		} else if(expected == null || actual == null){
			// one is null
			isOk = (expected == actual);
		} else if (typeof (expected) == "object") {
			// object or array
			var isArr1 = ComCtl.isArray(expected);
			var isArr2 = ComCtl.isArray(actual);
			if (isArr1 && isArr1) {
				errType = "array";
				// 数组
				if (expected.length != actual.length) {
					// 长度不等
					isOk = false;
					info += `[${Math.min(expected.length, actual.length) + 1}]${infoTemp}`;
				} else {
					// 长度相等
					for (var i = 0; i < expected.length; ++i) {
						var [isOkTemp, infoTemp, typeTemp] = this.compileValue(expected[i], actual[i], isStrict);
						if (!isOkTemp) {
							isOk = false;
							switch (typeTemp) {
								case "object": info += `[${i}].${infoTemp}`; break;
								case "array": info += `[${i}]${infoTemp}`; break;
								default: info += `[${i}]  ${infoTemp}`; break;
							}
							// info+=`[${i}]${infoTemp}`;
							break;
						}
					}
				}
			} else if (!isArr1 && !isArr2) {
				errType = "object";
				// object
				var keys = {};
				for (var key in expected) {
					keys[key] = null;
					var [isOkTemp, infoTemp, typeTemp] = this.compileValue(expected[key], actual[key], isStrict);
					if (!isOkTemp) {
						isOk = false;
						switch (typeTemp) {
							case "object": info += `${key}.${infoTemp}`; break;
							case "array": info += `${key}${infoTemp}`; break;
							default: info += `${key}  ${infoTemp}`; break;
						}
						// info+=`.${key}${infoTemp}`;
						keys = {};
						break;
					}
				}
				if (isOk) {
					for (var key in actual) {
						if (!(key in keys)) {
							isOk = false;
							info += `.${key}`;
							break;
						}
					}
				}
			} else {
				// 一个是数组，一个是object
				isOk = false;
			}
		} else {
			if (isStrict) {
				isOk = (expected === actual);
			} else {
				isOk = (expected == actual);
			}
		}

		if (isOk) {
			info = "";
		}

		return [isOk, info, errType];
	}

	static getStringPostion(expected: string, actual: string) {
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
				if (count < 0) { count = 20 }
				info = actual.substr(i, count - i);
				break;
			}
			++col;
		}

		var str = Assert.lang.positionDesc;
		str = str.replace(/\{position\}/g, `${rol}:${col} ${info}`);
		return str;

		// return [rol, col, info];
	}
}
