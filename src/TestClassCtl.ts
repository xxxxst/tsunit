import ComCtl from './ComCtl';
import Assert from './Assert';

export default class TestClassCtl {
	static testStoreName = "$__tsunit__";

	private static findTestClass(className){
		var arr = ComCtl.arrNotTestClass;
		for(var i = 0; i < arr.length;++i) {
			if(arr[i].className == className){
				return arr[i];
			}
		}
		return null;
	}

	// is class wait
	static isClassWait(className) {
		var item = this.findTestClass(className);
		return item && item.status == 'wait';
	}

	// is class run
	static isClassRun(className) {
		var item = this.findTestClass(className);
		return item && item.status == 'run';
	}

	// is class tested
	static isClassTested(className) {
		var item = this.findTestClass(className);
		return item == null;
	}

	// add class to cache
	static addClass(className) {
		if(this.findTestClass(className) != null){
			return;
		}

		var item = {
			className: className,
			status: 'wait',
		} as any;
		ComCtl.arrNotTestClass.push(item);
	}

	// remove class from cache
	static removeClass(className) {
		var arr = ComCtl.arrNotTestClass;
		for(var i = 0; i < arr.length;++i) {
			if(arr[i].className == className) {
				arr.splice(i, 1);
				return;
			}
		}
	}

	static runTest(target, ...args){
		var storeName = this.testStoreName;
		
		var tag = new target(...args);
		// if (!(storeName in tag)) {
		// 	return;
		// }
	
		ComCtl.ready(async () => {
			var itemClass = this.findTestClass(target);
			if(itemClass == null || itemClass.status != "wait"){
				return;
			}
			itemClass.status = "run";

			ComCtl.nowClassFunName = ComCtl.getClassName(target);
			// console.info(`${Assert.lang.startTest}${ComCtl.nowClassFunName}`);
			ComCtl.info(`${Assert.lang.startTest}${ComCtl.nowClassFunName}`);
			// var startTime = (new Date()).getTime();
	
			// 遍历测试函数
			for (var funName in tag[storeName]) {
				var item = tag[storeName][funName];
				if (item.isIgnore) {
					continue;
				}
	
				var successCount = ComCtl.successCount;
				var failedCount = ComCtl.failedCount;
				var utc1 = (new Date()).getTime();
				// var isException = false;
	
				// 遍历测试参数
				ComCtl.nowTestFunName = funName;
				// item.arrArgs.forEach(args => {
				for(var i = 0; i < item.arrArgs.length; ++i){
					var args = item.arrArgs[i];
					try {
						if(item.isSync){
							item.fun.call(tag, ...args);
						} else{
							await item.fun.call(tag, ...args);
						}
					} catch (ex) {
						++ComCtl.failedCount;
	
						var arr = ex.stack.split("\n");
						if (arr.length > 1) {
							ex.stack = "TypeError:\n" + arr[1];
						}
	
						ComCtl.showExceptionError("", ex);
					}
				}
				// });
	
				var utc2 = (new Date()).getTime();
	
				if (ComCtl.successCount == successCount && ComCtl.failedCount == failedCount) {
					// 声明@Test()的方法没有使用Assert;
					++ComCtl.failedCount;
					// ComCtl.showExceptionError("", Assert.lang.notUseAssert);
					ComCtl.showNotUseAssertError();
				} else if (ComCtl.failedCount == failedCount) {
					ComCtl.showSuccess(funName, utc2 - utc1);
				}
			}
	
			this.removeClass(target);
			// var endTime = (new Date()).getTime();
			// ComCtl.finishTestClass(endTime - startTime);
			ComCtl.finishTestClass();
		});
	}
}