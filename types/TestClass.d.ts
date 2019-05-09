export declare function TestClass(option?: {
    autoRun?: boolean;
}, ...args: any[]): (target: any) => void;
export declare function Test(...args: any[]): (targetSub: any, keySub: any, descriptor: PropertyDescriptor) => void;
export declare function AsyncTest(...args: any[]): (targetSub: any, keySub: any, descriptor: PropertyDescriptor) => void;
export declare function Ignore(): (targetSub: any, keySub: any, descriptor: PropertyDescriptor) => void;
