
import React, { useState } from 'react';
import { PlayIcon, PauseIcon, SkipNextIcon, SkipPreviousIcon } from './icons';

const MediaPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-black bg-opacity-10 backdrop-blur-md rounded-3xl p-6 flex items-center">
      <img src="https://picsum.photos/150/150" alt="Album Art" className="w-24 h-24 rounded-xl shadow-lg" />
      <div className="flex-1 ml-6">
        <p className="text-xl font-bold">Lo-Fi Girl</p>
        <p className="text-md opacity-80">Beats to relax/study to</p>
        <div className="w-full bg-white bg-opacity-20 rounded-full h-1.5 mt-3">
          <div className="bg-white h-1.5 rounded-full" style={{ width: '45%' }}></div>
        </div>
      </div>
      <div className="flex items-center space-x-4 ml-6">
        <button className="text-white opacity-80 hover:opacity-100 transition-opacity">
          <SkipPreviousIcon className="w-8 h-8" />
        </button>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-white text-slate-900 rounded-full p-4 hover:scale-105 transition-transform"
        >
          {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
        </button>
        <button className="text-white opacity-80 hover:opacity-100 transition-opacity">
          <SkipNextIcon className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default MediaPlayer;
