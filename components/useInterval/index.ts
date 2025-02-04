import { useEffect, useRef } from 'react';

type CallBack = () => void;
type Predicate = () => boolean;
export function useInterval(
  callback: CallBack,
  delay: number,
  destructorPredictor: Predicate = () => false,
): (resetTimer: () => void) => void {
  const interval = useRef<any>();
  const savedCallback = useRef<CallBack>(callback);
  const savedDestructorPredictor = useRef<Predicate>(destructorPredictor);
  const intervalDestructor = useRef<CallBack>(() =>
    clearInterval(interval.current),
  );

  useEffect(() => {
    savedCallback.current = callback;
    savedDestructorPredictor.current = destructorPredictor;
  }, [callback, destructorPredictor]);

  useEffect(() => {
    function tick() {
      if (savedDestructorPredictor.current()) {
        intervalDestructor.current();
      } else {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      interval.current = setInterval(tick, delay);
    }
    return intervalDestructor.current;
  }, [delay, savedCallback.current]);

  return resetTimer => {
    savedCallback.current = resetTimer;
  };
}

export default useInterval;
