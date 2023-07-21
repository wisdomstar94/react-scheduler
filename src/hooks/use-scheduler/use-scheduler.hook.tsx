import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IUseScheduler } from "./use-scheduler.interface";

export function useScheduler<DATA>(props: IUseScheduler.Props<DATA>): IUseScheduler.UseSchedulerHook<DATA> {
  const {
    defaultIntervalMillsecond,
    callback,
    name,
  } = props;
  const latestCallback = useRef<IUseScheduler.Callback<DATA>>(callback);
  latestCallback.current = callback;
  const [latestIntervalMillsecond, setLatestIntervalMillsecond] = useState<number>(defaultIntervalMillsecond);
  const interval = useRef<NodeJS.Timeout>();
  const isProcessingRef = useRef<boolean>(false);
  const [data, setData] = useState<DATA>();
  const [error, setError] = useState<any>();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const isStartedRef = useRef<boolean>(false);
  const [isStoped, setIsStoped] = useState<boolean>(true);
  const isWaiting = useMemo(() => isStarted && !isProcessing, [isProcessing, isStarted]);

  const stop = useCallback(() => {
    clearInterval(interval.current);
    setIsStarted(false);
    isStartedRef.current = false;
    setIsStoped(true);
  }, []);

  const start = useCallback((options?: IUseScheduler.StartOptions) => {
    if (isStartedRef.current) {
      console.error(`이미 해당 스케줄러는 실행중입니다.`);
      return;
    }
    const intervalMillsecond = options?.intervalMillsecond ?? latestIntervalMillsecond;
    setLatestIntervalMillsecond(intervalMillsecond);
    stop();
    setIsStarted(true);
    isStartedRef.current = true;
    setIsStoped(false);

    const execute = () => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;
      setIsProcessing(true);
      latestCallback.current().then(value => {
        // success
        isProcessingRef.current = false;
        setIsProcessing(false);
        setData(value);
      }).catch((error) => {
        // failure
        isProcessingRef.current = false;
        setIsProcessing(false);
        setError(error);
      });
    };

    if (options?.isNowExecuteWhenStart === true) {
      execute();
    }

    interval.current = setInterval(() => {
      execute();
    }, intervalMillsecond);
  }, [latestIntervalMillsecond, stop]);

  /**
   * props 의 callback 으로 콜백함수를 넘겨도 되지만, 해당 함수를 직접 호출해서도 콜백함수를 넘겨도 됩니다.
   */
  const setCallback = useCallback((callback: IUseScheduler.Callback<DATA>) => {
    latestCallback.current = callback;
  }, []);

  const setIntervalMillsecond = useCallback((value: number) => {
    if (latestIntervalMillsecond === value) {
      return;
    }
    setLatestIntervalMillsecond(value);
    stop();
    start({ intervalMillsecond: value });
  }, [latestIntervalMillsecond, start, stop]);

  const updateIntervalMillsecondAndStart = useCallback((intervalMillsecond: number) => {
    setLatestIntervalMillsecond(intervalMillsecond);
    start({ intervalMillsecond });
  }, [start]);

  useEffect(() => {
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    setCallback,
    setIntervalMillsecond,

    start,
    stop,
    updateIntervalMillsecondAndStart,

    isStarted,
    isStoped,
    isProcessing,
    isWaiting,

    latestIntervalMillsecond,

    data,
    error,
  };
}