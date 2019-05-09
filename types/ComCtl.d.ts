export default class ComCtl {
    static nowClassFunName: string;
    static nowTestFunName: string;
    static arrNotTestClass: {
        className: any;
        status: 'wait' | 'run';
    }[];
    private static nowTestStatus;
    private static runTestQueue;
    static successCount: number;
    static failedCount: number;
    private static startTime;
    private static arrConsoleInfoCache;
    static ready(fun: any): void;
    private static readyComplate;
    static info(...args: any[]): void;
    static error(...args: any[]): void;
    static createTestStore(funName: string, fun: Function, isIgnore?: boolean): {
        name: string;
        isIgnore: boolean;
        isSync: boolean;
        fun: Function;
        arrArgs: any[];
    };
    static getClassName(funClass: any): string;
    static finishTestClass(): void;
    static showSuccess(funName: string, time: any): void;
    static formatTime(time: any): string;
    static showError(desc: string, expected: any, actual: any, callName: string, info?: any): void;
    private static spriteInsert;
    static replaceStr(strInfo: any, name: any, value: any): any;
    static showExceptionError(desc: string, ex: any): void;
    static showNotUseAssertError(): void;
    static isArray(value: any): boolean;
    static compileValue(expected: any, actual: any, isStrict: Boolean): [boolean, string, any];
    static getStringPostion(expected: string, actual: string): any;
}
