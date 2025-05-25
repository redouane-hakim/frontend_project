import React from 'react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FAF3EF]">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#5C2E0E]"></div>
        <p className="text-[#5C2E0E] text-xl font-semibold tracking-widest">
          loading...
        </p>
      </div>
    </div>
  );
}
