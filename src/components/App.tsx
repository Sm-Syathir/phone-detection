import { useState } from 'react';
import Camera from "@/components/Camera";
import Main from "@/components/Main";

export default function App() {
  const [count, setCount] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [breakDuration, setBreakDuration] = useState(null);
  const [breakRemaining, setBreakRemaining] = useState(null);


  const incrementCount = () => {
    if (!isBreak) {
      setCount(prev => prev + 1);
    }
  };

  const startBreak = (minutes) => {
    const durationMs = minutes * 60 * 1000;
    setIsBreak(true);
    setBreakDuration(minutes);
    setBreakRemaining(minutes * 60);

    const endTime = Date.now() + durationMs;
    
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setBreakRemaining(remaining);
      
      if (remaining <= 0) {
        clearInterval(interval);
        setIsBreak(false);
        setBreakDuration(null);
        setBreakRemaining(null);
      }
    }, 1000);
    
    window.breakInterval = interval;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetCount = () => {
    setCount(0);
  };

  const endBreak = () => {
    if (window.breakInterval) {
      clearInterval(window.breakInterval);
    }
    setIsBreak(false);
    setBreakDuration(null);
    setBreakRemaining(null);
  };

  return (
    <div className="">
      <Camera onPhoneDetected={incrementCount} isBreak={isBreak} />
         <Main count={count} onBreak={resetCount} isBreak={isBreak} breakRemaining={breakRemaining} formatTime={formatTime} onStartBreak={startBreak} onEndBreak={endBreak} />
    </div>
  );
}