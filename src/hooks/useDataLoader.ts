import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setData, setLoading, setError, selectRawData } from '../store/slices/marketingSlice';
import { loadMarketingData } from '../utils/dataProcessing';
import { useWebWorker } from './useWebWorker';

export const useDataLoader = () => {
  const dispatch = useAppDispatch();
  const rawData = useAppSelector(selectRawData);
  const { processDataInWorker } = useWebWorker();

  useEffect(() => {
    // Only load if data hasn't been loaded yet
    if (rawData.length === 0) {
      const loadData = async () => {
        dispatch(setLoading(true));
        try {
          // Load data from server/file
          const data = await loadMarketingData();
          
          // Process data in Web Worker for better performance
          console.log('Processing data in Web Worker...');
          const startTime = performance.now();
          
          const result = await processDataInWorker(data);
          
          const endTime = performance.now();
          console.log(`Web Worker processing completed in ${endTime - startTime}ms`);
          
          if (result.data) {
            dispatch(setData(result.data));
            console.log('Metadata from worker:', result.metadata);
          }
        } catch (error) {
          dispatch(setError(error instanceof Error ? error.message : 'Failed to load data'));
        }
      };

      loadData();
    }
  }, [dispatch, rawData.length, processDataInWorker]);
};
