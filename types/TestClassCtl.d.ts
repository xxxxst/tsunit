export default class TestClassCtl {
    static testStoreName: string;
    private static findTestClass;
    static isClassWait(className: any): boolean;
    static isClassRun(className: any): boolean;
    static isClassTested(className: any): boolean;
    static addClass(className: any): void;
    static removeClass(className: any): void;
    static runTest(target: any, ...args: any[]): void;
}
