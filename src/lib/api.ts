import { generateDemoPrediction } from './demo-mode';

const API_URL = 'http://localhost:8000';

export async function checkHealth() {
  try {
    const res = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      return { isOnline: true, modelLoaded: data.model_loaded, device: data.device };
    }
    return { isOnline: false, modelLoaded: false, device: 'none' };
  } catch (error) {
    return { isOnline: false, modelLoaded: false, device: 'none' };
  }
}

export async function fullAnalysis(file: File) {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_URL}/full-analysis`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(30000) // 30s timeout for full analysis
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.warn("Backend API failed, falling back to demo mode", error);
    // Fallback to demo mode
    const demoResult = await generateDemoPrediction(file);
    return {
      ...demoResult,
      gradcam: null, // Let frontend handle synthetic gradcam
      vitAttention: null, // Let frontend handle synthetic vit
    };
  }
}

export async function sendChatMessage(message: string, scanContext: any = null) {
  try {
    const res = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, scanContext })
    });
    
    if (res.ok) {
      const data = await res.json();
      return data.response;
    }
    throw new Error('Failed to get chat response');
  } catch (error) {
    console.error("Chat API failed", error);
    return "I'm sorry, I cannot connect to the LuminaDia medical knowledge base right now. Please check if the backend server is running.";
  }
}
