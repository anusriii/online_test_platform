import useTimer from '../hooks/useTimer';

const Timer = ({ duration, onExpire }) => {
  const { minutes, seconds, timeLeft } = useTimer(duration, onExpire);
  return (
    <div className={`timer ${timeLeft <= 60 ? 'timer-danger' : timeLeft <= 300 ? 'timer-warning' : ''}`}>
      {minutes}:{seconds}
    </div>
  );
};

export default Timer;