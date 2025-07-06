import { useState, useCallback, useRef } from 'react';
import { UsernameResult } from '../types';
import { checkUsernameAvailability, generateRandomUsernames, generateRelatedUsernames } from '../utils/minecraftApi';

export function useUsernameChecker() {
  const [results, setResults] = useState<UsernameResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuperSearching, setIsSuperSearching] = useState(false);
  const [superSearchStats, setSuperSearchStats] = useState({
    checked: 0,
    found: 0,
    speed: 0
  });
  
  const superSearchRef = useRef<{ shouldStop: boolean }>({ shouldStop: false });
  const statsIntervalRef = useRef<NodeJS.Timeout>();

  const checkUsernames = useCallback(async (letter: string, minLength: number = 3, maxLength: number = 8) => {
    setIsGenerating(true);
    
    // Generate usernames
    const usernames = generateRandomUsernames(letter, 20, minLength, maxLength);
    
    // Initialize results with checking state
    const initialResults: UsernameResult[] = usernames.map(username => ({
      username,
      isAvailable: false,
      isChecking: true,
    }));
    
    setResults(initialResults);
    
    // Check each username availability
    const checkPromises = usernames.map(async (username, index) => {
      try {
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, index * 100));
        
        const isAvailable = await checkUsernameAvailability(username);
        
        setResults(prev => prev.map(result => 
          result.username === username 
            ? { ...result, isAvailable, isChecking: false }
            : result
        ));
      } catch (error) {
        setResults(prev => prev.map(result => 
          result.username === username 
            ? { ...result, isChecking: false, error: 'Failed to check' }
            : result
        ));
      }
    });
    
    await Promise.all(checkPromises);
    setIsGenerating(false);
  }, []);

  const startSuperSearch = useCallback(async (letter: string, minLength: number = 3, maxLength: number = 8) => {
    setIsSuperSearching(true);
    superSearchRef.current.shouldStop = false;
    
    // Reset stats
    setSuperSearchStats({ checked: 0, found: 0, speed: 0 });
    
    // Clear existing results
    setResults([]);
    
    let totalChecked = 0;
    let totalFound = 0;
    let startTime = Date.now();
    let lastStatsUpdate = Date.now();
    let checksInLastSecond = 0;
    
    // Update stats every second
    statsIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const timeSinceLastUpdate = (now - lastStatsUpdate) / 1000;
      const speed = Math.round(checksInLastSecond / timeSinceLastUpdate);
      
      setSuperSearchStats(prev => ({
        ...prev,
        speed
      }));
      
      checksInLastSecond = 0;
      lastStatsUpdate = now;
    }, 1000);

    const checkBatch = async (batchSize: number = 10) => {
      const usernames = generateRandomUsernames(letter, batchSize, minLength, maxLength);
      
      const checkPromises = usernames.map(async (username) => {
        if (superSearchRef.current.shouldStop) return null;
        
        try {
          const isAvailable = await checkUsernameAvailability(username);
          totalChecked++;
          checksInLastSecond++;
          
          if (isAvailable) {
            totalFound++;
            
            // Add to results immediately when found
            setResults(prev => [...prev, {
              username,
              isAvailable: true,
              isChecking: false
            }]);
          }
          
          // Update stats
          setSuperSearchStats({
            checked: totalChecked,
            found: totalFound,
            speed: Math.round(totalChecked / ((Date.now() - startTime) / 1000))
          });
          
          return { username, isAvailable };
        } catch (error) {
          totalChecked++;
          checksInLastSecond++;
          return null;
        }
      });
      
      await Promise.all(checkPromises);
    };

    // Keep searching until stopped
    while (!superSearchRef.current.shouldStop) {
      await checkBatch(15); // Check 15 usernames per batch
      
      // Small delay to prevent overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
    }
    
    setIsSuperSearching(false);
  }, []);

  const startSuperSearchRelated = useCallback(async (
    word: string,
    minLength: number = 3,
    maxLength: number = 16,
    randomSide: 'before' | 'after' = 'after'
  ) => {
    setIsSuperSearching(true);
    superSearchRef.current.shouldStop = false;

    setSuperSearchStats({ checked: 0, found: 0, speed: 0 });
    setResults([]);

    let totalChecked = 0;
    let totalFound = 0;
    let startTime = Date.now();
    let lastStatsUpdate = Date.now();
    let checksInLastSecond = 0;

    statsIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const timeSinceLastUpdate = (now - lastStatsUpdate) / 1000;
      const speed = Math.round(checksInLastSecond / timeSinceLastUpdate);

      setSuperSearchStats(prev => ({
        ...prev,
        speed
      }));

      checksInLastSecond = 0;
      lastStatsUpdate = now;
    }, 1000);

    const checkBatch = async (batchSize: number = 10) => {
      const usernames = generateRelatedUsernames(word, batchSize, minLength, maxLength, randomSide);

      const checkPromises = usernames.map(async (username) => {
        if (superSearchRef.current.shouldStop) return null;

        try {
          const isAvailable = await checkUsernameAvailability(username);
          totalChecked++;
          checksInLastSecond++;

          if (isAvailable) {
            totalFound++;
            setResults(prev => [...prev, {
              username,
              isAvailable: true,
              isChecking: false
            }]);
          }

          setSuperSearchStats({
            checked: totalChecked,
            found: totalFound,
            speed: Math.round(totalChecked / ((Date.now() - startTime) / 1000))
          });

          return { username, isAvailable };
        } catch (error) {
          totalChecked++;
          checksInLastSecond++;
          return null;
        }
      });

      await Promise.all(checkPromises);
    };

    while (!superSearchRef.current.shouldStop) {
      await checkBatch(15);
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
    }

    setIsSuperSearching(false);
  }, []);

  const stopSuperSearch = useCallback(() => {
    superSearchRef.current.shouldStop = true;
    setIsSuperSearching(false);
    
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
    }
  }, []);

  const copyUsername = useCallback((username: string) => {
    navigator.clipboard.writeText(username);
    // You could add a toast notification here
  }, []);

  const checkRelatedUsernames = useCallback(async (
    base: string,
    minLength: number = 3,
    maxLength: number = 16,
    randomSide: 'before' | 'after' = 'after'
  ) => {
    setIsGenerating(true);

    const usernames = generateRelatedUsernames(base, 20, minLength, maxLength, randomSide);

    const initialResults: UsernameResult[] = usernames.map(username => ({
      username,
      isAvailable: false,
      isChecking: true,
    }));

    setResults(initialResults);

    const checkPromises = usernames.map(async (username, index) => {
      try {
        await new Promise(resolve => setTimeout(resolve, index * 100));
        const isAvailable = await checkUsernameAvailability(username);

        setResults(prev => prev.map(result =>
          result.username === username
            ? { ...result, isAvailable, isChecking: false }
            : result
        ));
      } catch (error) {
        setResults(prev => prev.map(result =>
          result.username === username
            ? { ...result, isChecking: false, error: 'Failed to check' }
            : result
        ));
      }
    });

    await Promise.all(checkPromises);
    setIsGenerating(false);
  }, []);

  return {
    results,
    isGenerating,
    isSuperSearching,
    superSearchStats,
    checkUsernames,
    startSuperSearch,
    stopSuperSearch,
    copyUsername,
    checkRelatedUsernames,
    startSuperSearchRelated,
  };
}