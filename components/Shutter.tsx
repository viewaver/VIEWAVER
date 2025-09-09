
import React from 'react';

type ShutterPhase = 'idle' | 'closing' | 'opening';

interface ShutterProps {
  phase: ShutterPhase;
}

const ShutterBlade: React.FC<{ phase: ShutterPhase; delay: string }> = ({ phase, delay }) => {
  const baseClasses = 'h-full w-full bg-black transform transition-transform duration-500 ease-in-out';
  const transformClass = phase === 'closing' ? 'scale-y-100' : 'scale-y-0';
  
  return (
    <div className="h-full w-full overflow-hidden">
        <div 
          className={`${baseClasses} ${transformClass}`} 
          style={{ transitionDelay: delay, transformOrigin: 'center' }}
        />
    </div>
  );
};

const Shutter: React.FC<ShutterProps> = ({ phase }) => {
  const bladeCount = 5;
  const delays = ['0ms', '50ms', '100ms', '50ms', '0ms'];

  return (
    <div className="absolute inset-0 flex pointer-events-none z-10">
      {Array.from({ length: bladeCount }).map((_, index) => (
        <div key={index} className="flex-1 h-full">
          <ShutterBlade phase={phase} delay={delays[index % delays.length]} />
        </div>
      ))}
    </div>
  );
};

export default Shutter;
   