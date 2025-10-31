
import React from 'react';
import { MicrophoneIcon } from './icons';

interface AssistantUIProps {
  isListening: boolean;
  isSpeaking: boolean;
  assistantResponse: string;
  transcript: string;
  hasPermission: boolean | null;
  startListening: () => void;
}

const AssistantUI: React.FC<AssistantUIProps> = ({
  isListening,
  isSpeaking,
  assistantResponse,
  transcript,
  hasPermission,
  startListening,
}) => {
  const isAwake = isListening || isSpeaking || assistantResponse;

  const renderStatus = () => {
    if (hasPermission === false) {
      return <p>Permissão do microfone negada.</p>;
    }
    if (isSpeaking) {
      return <p className="font-semibold text-lg">{assistantResponse}</p>;
    }
    if (isListening) {
      return <p className="opacity-80 text-lg italic">{transcript || 'Ouvindo...'}</p>;
    }
    return null;
  };

  return (
    <>
      {/* Overlay for wake effect */}
      <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-10 transition-opacity duration-500 ${isAwake ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />

      {/* Main UI */}
      <div className="fixed bottom-0 left-0 right-0 p-8 flex flex-col items-center justify-center z-20 pointer-events-none">
        <div 
          className="text-center transition-all duration-300 ease-in-out text-white"
          style={{ transform: isAwake ? 'translateY(0)' : 'translateY(200px)', opacity: isAwake ? 1 : 0 }}
        >
          {renderStatus()}
        </div>
        
        <div className="relative mt-8 pointer-events-auto">
          <button 
            onClick={startListening} 
            className="bg-white rounded-full p-4 text-slate-800 shadow-2xl transition-transform hover:scale-105"
            aria-label="Activate Assistant"
          >
            <MicrophoneIcon className="w-8 h-8"/>
          </button>
          {/* Pulsating animation for listening */}
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-blue-400/50 animate-ping -z-10" />
          )}
        </div>
      </div>
    </>
  );
};

export default AssistantUI;
