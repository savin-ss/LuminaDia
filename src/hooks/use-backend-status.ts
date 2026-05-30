import { useState, useEffect } from 'react';
import { checkHealth } from '@/lib/api';

export function useBackendStatus() {
  const [status, setStatus] = useState({
    isOnline: false,
    modelLoaded: false,
    device: 'none',
    mode: 'demo',
    loading: true
  });

  useEffect(() => {
    let mounted = true;
    
    const check = async () => {
      const result = await checkHealth();
      if (mounted) {
        setStatus({
          ...result,
          mode: result.isOnline && result.modelLoaded ? 'real' : 'demo',
          loading: false
        });
      }
    };
    
    check();
    
    // Poll every 30 seconds
    const interval = setInterval(check, 30000);
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return status;
}
