import { useState, useEffect, useRef } from 'react';

const useTimer = (durationInMinutes, onExpire) => {
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60);
  const timerRef = useRef(null);
  const expiredRef = useRef(false);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (!expiredRef.current) {
            expiredRef.current = true;
            onExpire();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return { minutes, seconds, timeLeft };
};

export default useTimer;