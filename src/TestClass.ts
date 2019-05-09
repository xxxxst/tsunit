
import ComCtl from './ComCtl';
import Assert from './Assert';
import TestClassCtl from './TestClassCtl';


// var testStoreName = "$__tsunit__";
// var asyncTestStoreName = "$_ts_AsyncTest_";

// 测试类装饰器
/**
 * test class decorator
 * 
 * default option
 * - autoRun = true
*/
export function TestClass(option?:{autoRun?:boolean}, ...args) {
	function create(target: any) {
		TestClassCtl.addClass(target);

		var defOpt = {
			autoRun:true
		};
	
		var opt = defOpt;
		for(var key in option) {
			opt[key] = option[key];
		}
		if(!opt.autoRun) {
			return;
		}

		TestClassCtl.runTest(target, ...args);
	}

	return create;
}

// 测试方法装饰器
// test function decorator
export function Test(...args) {
	return _LogicTest(TestClassCtl.testStoreName, true, ...args);
	// var storeName = testStoreName;

	// function create(targetSub: any, keySub: any, descriptor: PropertyDescriptor) {
	// 	var map = targetSub[storeName] || (targetSub[storeName] = {});
	// 	map[keySub] = map[keySub] || ComCtl.createTestStore(keySub, descriptor.value);
	// 	// if (!(keySub in map)) {
	// 	// 	map[keySub] = ComCtl.createTestStore(keySub, descriptor.value);
	// 	// }

	// 	var item = map[keySub];
	// 	item.arrArgs.push(args);
	// }

	// return create;
}

// async test function decorator
export function AsyncTest(...args) {
	return _LogicTest(TestClassCtl.testStoreName, false, ...args);
	// var storeName = asyncTestStoreName;

	// function create(targetSub: any, keySub: any, descriptor: PropertyDescriptor) {
	// 	var map = targetSub[storeName] || (targetSub[storeName] = {});
	// 	map[keySub] = map[keySub] || ComCtl.createTestStore(keySub, descriptor.value);
	// 	// if (!(keySub in map)) {
	// 	// 	map[keySub] = ComCtl.createTestStore(keySub, descriptor.value);
	// 	// }

	// 	var item = map[keySub];
	// 	item.arrArgs.push(args);
	// }

	// return create;
}

function _LogicTest(storeName, sync, ...args) {
	// var storeName = testStoreName;

	function create(targetSub: any, keySub: any, descriptor: PropertyDescriptor) {
		var map = targetSub[storeName] || (targetSub[storeName] = {});
		map[keySub] = map[keySub] || ComCtl.createTestStore(keySub, descriptor.value);
		// if (!(keySub in map)) {
		// 	map[keySub] = ComCtl.createTestStore(keySub, descriptor.value);
		// }

		var item = map[keySub];
		item.isSync = sync;
		item.arrArgs.push(args);
	}

	return create;
}

// 忽略测试方法
// ignore test function decorator
export function Ignore() {
	var storeName = TestClassCtl.testStoreName;
	// var arrStoreName = [testStoreName, asyncTestStoreName];

	function create(targetSub: any, keySub: any, descriptor: PropertyDescriptor) {
		// arrStoreName.forEach((storeName)=>{
		// 	var map = targetSub[storeName] || (targetSub[storeName] = {});
		// 	map[keySub] = map[keySub] || ComCtl.createTestStore(keySub, descriptor.value, true);
		// 	map[keySub].isIgnore = true;

		// 	// if (!(keySub in map)) {
		// 	// 	map[keySub] = ComCtl.createTestStore(keySub, descriptor.value, true);
		// 	// } else {
		// 	// 	map[keySub].isIgnore = true;
		// 	// }
		// });

		var map = targetSub[storeName] || (targetSub[storeName] = {});
		map[keySub] = map[keySub] || ComCtl.createTestStore(keySub, descriptor.value, true);
		map[keySub].isIgnore = true;
	}

	return create;
}
