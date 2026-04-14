import React, { useEffect } from 'react';
import { speak } from '../utils/speech';

export default function TutorBubble({ message, isLoading }) {
  useEffect(() => {
    if (message && !isLoading) {
      speak(message);
    }
  }, [message, isLoading]);

  return (
    <div className="flex items-start gap-3 mb-4">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-xl flex-shrink-0 border-2 border-fox">
        👨‍🏫
      </div>
      {/* Bubble */}
      <div className="bg-orange-50 rounded-2xl rounded-tl-md px-4 py-3 max-w-[80%] shadow-sm border-2 border-s1">
        {isLoading ? (
          <p className="text-s4 font-semibold animate-pulse">⏳ Je reflechis...</p>
        ) : (
          <p className="text-stone font-semibold text-sm leading-relaxed">{message}</p>
        )}
      </div>
    </div>
  );
}
