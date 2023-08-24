import { NativeEngine } from '@babylonjs/core';
export declare class ReactNativeEngine extends NativeEngine {
    private _isDisposed;
    static tryCreateAsync(abortSignal: AbortSignal): Promise<ReactNativeEngine | null>;
    get isDisposed(): boolean;
    dispose(): void;
}
