import { set } from "astro:schema";
import { useState } from "react";

export default function Main({ count, onBreak, isBreak, breakRemaining, formatTime, onStartBreak, onEndBreak }: { count: number, onBreak: () => void, isBreak?: boolean, breakRemaining?: number | null, formatTime?: (secs: number) => string, onStartBreak?: (mins: number) => void, onEndBreak?: () => void }) {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState(null);

    const handleBreakClick = () => {
        setShowPopup(!showPopup); 
        };

    const handleSelectDuration = (minutes) => {
        onStartBreak(minutes);
        setShowPopup(false);
        onBreak();
        
        let timeLeft = minutes * 60;
        setSelectedDuration(timeLeft);
        
        const interval = setInterval(() => {
            timeLeft -= 1;
            setSelectedDuration(timeLeft);
            
            if (timeLeft <= 0) {
                clearInterval(interval);
                setSelectedDuration(null);
            }
        }, 1000);
        
        window.breakTimerInterval = interval;
    };
    
    const formatTimeDisplay = (seconds) => {
        if (seconds === null) return null;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <main className="flex flex-col w-full justify-center items-center gap-4 -mt-20">
            <div>
  {selectedDuration !== null && (
    <h1 className="text-2xl font-bold">
      Break Time: {formatTimeDisplay(selectedDuration)}
    </h1>
  )}
</div>
             <div>
                <h1 className="text-2xl font-bold">Count: {count}</h1> 
            </div>
            <div className="flex gap-4">
                <button className="bg-purple-500 text-white px-4 py-2 rounded" onClick={onBreak}>
                    Reset Count
                </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleBreakClick}>
                        Break
                    </button>
                       <button className="bg-sky-500 text-white px-4 py-2 rounded" onClick={() => {
                            if (window.breakTimerInterval) {
                                clearInterval(window.breakTimerInterval);
                                setSelectedDuration(null);
                            }
                            if (onEndBreak) {
                                onEndBreak();
                            }
                        }}>
                        End Break
                    </button>
            </div>
            {showPopup && (
            <div className="flex justify-center h-125 w-230 bg-white absolute top-41 rounded-3xl border-3 border-solid border-black">
                     <button 
                            onClick={() => setShowPopup(false)}
                            className="absolute top-6 right-9 text-gray-500 hover:text-gray-800 text-2xl font-bold"> ✕
                        </button>
                <div className="flex flex-col items-center justify-center gap-4">
                    <h2 className="text-xl font-bold">Break Duration</h2>
                    <div className="flex gap-4">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleSelectDuration(5)}>
                            5 Minutes
                        </button>
                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => handleSelectDuration(10)}>
                            10 Minutes
                        </button>
                        <button className="bg-orange-500 text-white px-4 py-2 rounded" onClick={() => handleSelectDuration(15)}>
                            15 Minutes
                        </button>
                         <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleSelectDuration(20)}>
                            20 Minutes
                        </button>
                    </div>
                </div>
            </div>
        )}
        </main>
    );
}