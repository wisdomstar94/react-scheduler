"use client"
import { useScheduler } from "@/hooks/use-scheduler/use-scheduler.hook";
import { useEffect, useState } from "react";

export default function Page() {
  const [timestamp, setTimestamp] = useState<number>(0);

  const aaScheduler = useScheduler({
    defaultIntervalMillsecond: 1000 * 3,
    callback: () => {
      return new Promise<string>(function(resolve, reject) {
        console.log('aa callback 호출됨..!');
        setTimeout(() => {
          resolve(`aa_${timestamp}`);
        }, 1000);
      });
    },
  });

  const bbScheduler = useScheduler({
    defaultIntervalMillsecond: 1000 * 5,
    callback: () => {
      return new Promise<string>(function(resolve, reject) {
        setTimeout(() => {
          resolve(`bb_${timestamp}`);
        }, 1500);
      });
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date().getTime());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="w-full">
        <div>{ aaScheduler.isProcessing ? 'aa 스케줄러 작업 진행중...' : '' }</div>
        <div>{ aaScheduler.isWaiting ? 'aa 스케줄러 작업 대기중...' : '' }</div>
        <div>{ aaScheduler.isStarted ? 'aa 스케줄러 스케줄링중...' : '' }</div>
        <div>{ aaScheduler.isStoped ? 'aa 스케줄러 꺼짐...' : '' }</div>
        <div>
          aa 스케줄러 작업 리턴 데이터 : { aaScheduler.data }
        </div>
        <div className="w-full flex flex-wrap gap-2">
          <button className="inline-flex px-4 py-1 bg-slate-200 text-xs cursor-pointer hover:bg-slate-300" onClick={() => aaScheduler.start()}>aa 스케줄러 시작</button>
          <button className="inline-flex px-4 py-1 bg-slate-200 text-xs cursor-pointer hover:bg-slate-300" onClick={() => aaScheduler.start({ isNowExecuteWhenStart: true })}>aa 스케줄러 시작(후 바로 실행)</button>
          <button className="inline-flex px-4 py-1 bg-slate-200 text-xs cursor-pointer hover:bg-slate-300" onClick={() => aaScheduler.stop()}>aa 스케줄러 종료</button>
          <button className="inline-flex px-4 py-1 bg-slate-200 text-xs cursor-pointer hover:bg-slate-300" onClick={() => aaScheduler.setIntervalMillsecond(1000)}>aa 스케줄러 호출주기 바꾸기</button>
        </div>
      </div>
      <div className="w-full">
        <div>{ bbScheduler.isProcessing ? 'bb 스케줄러 작업 진행중...' : '' }</div>
        <div>{ bbScheduler.isWaiting ? 'bb 스케줄러 작업 대기중...' : '' }</div>
        <div>{ bbScheduler.isStarted ? 'bb 스케줄러 스케줄링중...' : '' }</div>
        <div>{ bbScheduler.isStoped ? 'bb 스케줄러 꺼짐...' : '' }</div>
        <div>
          bb 스케줄러 작업 리턴 데이터 : { bbScheduler.data }
        </div>
        <div className="w-full flex flex-wrap gap-2">
          <button className="inline-flex px-4 py-1 bg-slate-200 text-xs cursor-pointer hover:bg-slate-300" onClick={() => bbScheduler.start()}>bb 스케줄러 시작</button>
          <button className="inline-flex px-4 py-1 bg-slate-200 text-xs cursor-pointer hover:bg-slate-300" onClick={() => bbScheduler.stop()}>bb 스케줄러 종료</button>
        </div>
      </div>
    </>
  );
}
