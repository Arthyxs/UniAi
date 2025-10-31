import { useState, useEffect, useRef, useCallback } from 'react';
import { generateResponse } from '../services/geminiService';

// Add type definitions for the Web Speech API to resolve TypeScript errors.
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly [index: number]: SpeechRecognitionAlternative;
  readonly length: number;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
}
interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onstart: () => void;
}
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}


const WAKE_WORD = 'uni';

export const useSpeech = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const processCommand = useCallback(async (command: string) => {
    setIsListening(false);
    try {
      const response = await generateResponse(command);
      setAssistantResponse(response);
      speak(response);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage = "Desculpe, estou com problemas para me conectar. Por favor, tente novamente mais tarde.";
      setAssistantResponse(errorMessage);
      speak(errorMessage);
    }
  }, []);

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to find a Google voice
    const voices = window.speechSynthesis.getVoices();
    const googleVoice = voices.find(voice => voice.name.includes('Google') && voice.lang === 'pt-BR');
    
    if (googleVoice) {
      utterance.voice = googleVoice;
    } else {
        // Fallback for PT-BR
        const ptVoice = voices.find(voice => voice.lang === 'pt-BR');
        if (ptVoice) utterance.voice = ptVoice;
    }
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setAssistantResponse('');
      startListening(); // Resume listening after speaking
    };
    utterance.onerror = (event) => {
        console.error("SpeechSynthesis Error:", event.error);
        setIsSpeaking(false);
        setAssistantResponse('');
        startListening();
    };
    window.speechSynthesis.speak(utterance);
  };

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening && !isSpeaking) {
      try {
        recognitionRef.current.start();
      } catch(e) {
        console.error("Speech recognition start error: ", e);
      }
    }
  }, [isListening, isSpeaking]);
  
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);


  useEffect(() => {
    const checkPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // We have permission, we can close the stream now as Web Speech API will handle it
        stream.getTracks().forEach(track => track.stop());
        setHasPermission(true);
      } catch (err) {
        console.error("Microphone permission denied:", err);
        setHasPermission(false);
      }
    };
    checkPermission();
  }, []);

  useEffect(() => {
    if(!hasPermission) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      // Intentionally not setting isListening to true here,
      // as it's always running in the background.
    };

    recognition.onend = () => {
      // If not speaking, restart listening to ensure it's continuous
      if (!isSpeaking) {
        setTimeout(() => startListening(), 500); // Add a small delay
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const currentTranscript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += currentTranscript;
        } else {
          interimTranscript += currentTranscript;
        }
      }
      
      // Dispatch event for other components to listen to (e.g., idle timer)
      window.dispatchEvent(new CustomEvent('speechtranscript', { detail: { transcript: finalTranscript || interimTranscript } }));
      
      setTranscript(interimTranscript);

      const normalizedFinal = finalTranscript.trim().toLowerCase();
      if(isListening && normalizedFinal) {
          processCommand(normalizedFinal);
      } else if (normalizedFinal.includes(WAKE_WORD) || interimTranscript.toLowerCase().includes(WAKE_WORD)) {
        if (!isListening && !isSpeaking) {
          setIsListening(true);
          // Extract command after wake word
          const commandIndex = normalizedFinal.lastIndexOf(WAKE_WORD) + WAKE_WORD.length;
          const command = normalizedFinal.substring(commandIndex).trim();
          setTranscript(''); // Clear transcript for the new command
          if (command) {
            processCommand(command);
          }
        }
      }
    };

    recognitionRef.current = recognition;
    startListening();

    return () => {
      recognition.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPermission, isSpeaking]); // Rerun if speaking state changes to manage listening restarts
  
  useEffect(() => {
    // If listening is active for too long without a final result, reset it.
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    if (isListening) {
      timeoutId = setTimeout(() => {
        setIsListening(false);
        setTranscript('');
      }, 8000); // 8-second timeout for a command
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isListening]);


  return { isListening, transcript, startListening, stopListening, assistantResponse, isSpeaking, hasPermission };
};
