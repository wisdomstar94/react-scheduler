export declare namespace IUseScheduler {
  export type Callback<DATA> = () => Promise<DATA>;

  export interface StartOptions {
    isNowExecuteWhenStart?: boolean;
    intervalMillsecond?: number;
  }

  export interface Props<DATA> {
    name?: string;
    defaultIntervalMillsecond: number;
    callback: Callback<DATA>;
  }

  export interface UseSchedulerHook<DATA> {
    setCallback: (callback: Callback<DATA>) => void;
    setIntervalMillsecond: (value: number) => void;

    start: (options?: StartOptions) => void;
    stop: () => void;
    updateIntervalMillsecondAndStart: (intervalMillsecond: number) => void;

    isStarted: boolean;
    isStoped: boolean;
    isProcessing: boolean;
    isWaiting: boolean;

    latestIntervalMillsecond: number;

    data: DATA | undefined;
    error: any;
  }
}