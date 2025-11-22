// Web Worker for processing marketing data
import type { MarketingRecord } from '../types/marketing.types';

interface ProcessDataMessage {
  type: 'PROCESS_DATA';
  data: MarketingRecord[];
}

interface ProcessedDataResponse {
  type: 'DATA_PROCESSED';
  data: MarketingRecord[];
  metadata: {
    totalRecords: number;
    uniqueChannels: string[];
    uniqueRegions: string[];
    spendRange: [number, number];
  };
}

// Process and analyze the data
function processMarketingData(data: MarketingRecord[]): ProcessedDataResponse {
  const startTime = performance.now();
  
  // Extract unique channels
  const channelsSet = new Set<string>();
  const regionsSet = new Set<string>();
  let minSpend = Infinity;
  let maxSpend = -Infinity;

  // Process data in a single pass for efficiency
  data.forEach(record => {
    channelsSet.add(record.channel);
    regionsSet.add(record.region);
    minSpend = Math.min(minSpend, record.spend);
    maxSpend = Math.max(maxSpend, record.spend);
  });

  const endTime = performance.now();
  console.log(`Data processing took ${endTime - startTime}ms in Web Worker`);

  return {
    type: 'DATA_PROCESSED',
    data,
    metadata: {
      totalRecords: data.length,
      uniqueChannels: Array.from(channelsSet).sort(),
      uniqueRegions: Array.from(regionsSet).sort(),
      spendRange: [minSpend, maxSpend],
    },
  };
}

// Listen for messages from the main thread
self.addEventListener('message', (event: MessageEvent<ProcessDataMessage>) => {
  if (event.data.type === 'PROCESS_DATA') {
    try {
      const result = processMarketingData(event.data.data);
      self.postMessage(result);
    } catch (error) {
      self.postMessage({
        type: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
});

export {};
