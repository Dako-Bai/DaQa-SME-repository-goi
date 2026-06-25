import { useState, useEffect } from 'react';

// Simulated Argus data hook
export function useArgusSync(initialValue: number, volatility: number = 2.5, intervalMs: number = 3000) {
  const [value, setValue] = useState(initialValue);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((current) => {
        // Randomly decide if it changes
        if (Math.random() > 0.4) {
          const change = (Math.random() * volatility) - (volatility / 2);
          const newValue = Number((current + change).toFixed(2));
          
          if (newValue > current) {
            setTrend('up');
          } else if (newValue < current) {
            setTrend('down');
          }
          setLastUpdated(new Date());
          return newValue;
        }
        
        return current;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [volatility, intervalMs]);

  return { value, trend, lastUpdated };
}
