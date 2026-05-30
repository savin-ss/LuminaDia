import { useState, useCallback } from 'react';
import { fullAnalysis } from '@/lib/api';
import { useBackendStatus } from './use-backend-status';

export type ScanState = 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';

export type ScanResult = {
  predictedClass: number;
  predictedLabel: string;
  confidence: number;
  probabilities: Record<string, number>;
  explanation: string;
  solution?: string;
  gradcam?: string | null;
  vitAttention?: string | null;
  mode: 'real' | 'demo';
};

export function useScan() {
  const [state, setState] = useState<ScanState>('idle');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  const status = useBackendStatus();

  const startScan = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setImageSrc(URL.createObjectURL(selectedFile));
    setState('analyzing');
    setError(null);

    try {
      // Intentionally wait a bit to show animations
      const [analysisResult] = await Promise.all([
        fullAnalysis(selectedFile),
        new Promise(resolve => setTimeout(resolve, 6000)) // Min 6s for animation
      ]);
      
      setResult(analysisResult as ScanResult);
      setState('complete');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setState('error');
    }
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setResult(null);
    setError(null);
    setFile(null);
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
      setImageSrc(null);
    }
  }, [imageSrc]);

  return {
    state,
    result,
    error,
    file,
    imageSrc,
    startScan,
    reset,
    isRealModel: status.mode === 'real'
  };
}
