import { useEffect, useRef, useCallback } from 'react';
import type { MarketingRecord } from '../types/marketing.types';

interface WorkerMessage {
  type: 'PROCESS_DATA';
  data: MarketingRecord[];
}

interface WorkerResponse {
  type: 'DATA_PROCESSED' | 'ERROR';
  data?: MarketingRecord[];
  metadata?: {
    totalRecords: number;
    uniqueChannels: string[];
    uniqueRegions: string[];
    spendRange: [number, number];
  };
  error?: string;
}

export const useWebWorker = () => {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Create worker instance
    workerRef.current = new Worker(
      new URL('../workers/dataProcessor.worker.ts', import.meta.url),
      { type: 'module' }
    );

    // Cleanup on unmount
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const processDataInWorker = useCallback(
    (data: MarketingRecord[]): Promise<WorkerResponse> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          reject(new Error('Worker not initialized'));
          return;
        }

        const worker = workerRef.current;

        // Set up one-time message handler
        const handleMessage = (event: MessageEvent<WorkerResponse>) => {
          worker.removeEventListener('message', handleMessage);
          
          if (event.data.type === 'ERROR') {
            reject(new Error(event.data.error || 'Worker processing failed'));
          } else {
            resolve(event.data);
          }
        };

        worker.addEventListener('message', handleMessage);

        // Send data to worker
        const message: WorkerMessage = {
          type: 'PROCESS_DATA',
          data,
        };
        worker.postMessage(message);
      });
    },
    []
  );

  return { processDataInWorker };
};
