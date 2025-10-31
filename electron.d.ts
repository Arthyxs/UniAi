// This file provides TypeScript definitions for the API exposed by preload.js
export {};

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send: (channel: string, data?: any) => void;
        on: (channel: string, func: (...args: any[]) => void) => void;
      };
    };
  }
}
