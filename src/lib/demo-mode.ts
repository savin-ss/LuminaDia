export const DEMO_STAGES = {
  0: { name: "No DR", label: "No Diabetic Retinopathy", color: "#28a745", risk: "Low" },
  1: { name: "Mild NPDR", label: "Mild Diabetic Retinopathy", color: "#d39e00", risk: "Low-Moderate" },
  2: { name: "Moderate NPDR", label: "Moderate Diabetic Retinopathy", color: "#fd7e14", risk: "Moderate" },
  3: { name: "Severe NPDR", label: "Severe Diabetic Retinopathy", color: "#d63384", risk: "High" },
  4: { name: "Proliferative DR", label: "Proliferative Diabetic Retinopathy", color: "#dc3545", risk: "Very High" },
};

export const DEMO_EXPLANATIONS = {
  0: "The Vision Transformer attention map indicates uniform focus across the iris surface without significant hotspots. This confirms the absence of texture irregularities, vascular anomalies, or distortion patterns typically associated with diabetic retinopathy. The trabecular mesh appears smooth with no micro-hemorrhages detected.",
  1: "Mild textural irregularities detected near the pupillary margin with minor vascular changes. While no severe anomalies are present, the variance in local contrast suggests early metabolic stress affecting the iris micro-structure. This aligns with pre-diabetic indicators.",
  2: "Distinct clusters of irregular texture density and significant contrast variation identified, particularly in the lower temporal quadrant. These patterns correlate with exudates and mild capillary non-perfusion, indicative of moderate diabetic impact on the vascular system.",
  3: "ViT and Grad-CAM heatmaps show intense attention across the iris structure, highlighting severe radial distortion and extensive vascular leakage signs. High edge density and loss of smooth texture indicate advanced retinopathy with potential neovascularization.",
  4: "Critical activation across entire iris zone. Extreme fiber deterioration, large-scale pigment loss, diffuse discoloration, and severe vascular irregularities detected. All model components indicate maximum deviation — consistent with proliferative diabetic retinopathy requiring immediate medical intervention.",
};

// Simple DJB2 hash for string
function stringHash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return hash;
}

export async function generateDemoPrediction(file: File) {
  // Read file as data URL to generate a consistent hash
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const hash = Math.abs(stringHash(dataUrl));
      
      // Determine class (0-4)
      const predictedClass = hash % 5;
      
      // Generate probabilities
      const baseConf = 70 + (hash % 25);
      const jitter = (hash % 10) / 10;
      const confidence = parseFloat((baseConf + jitter).toFixed(2));
      
      let remaining = 100 - confidence;
      const probabilities: Record<string, number> = {};
      
      for (let i = 0; i < 5; i++) {
        const className = DEMO_STAGES[i as keyof typeof DEMO_STAGES].name;
        if (i === predictedClass) {
          probabilities[className] = confidence;
        } else {
          if (remaining < 5) {
            probabilities[className] = parseFloat((remaining / (4 - i || 1)).toFixed(2));
          } else {
            const val = (hash % (i + 1) * 3) + 0.5;
            probabilities[className] = parseFloat(val.toFixed(2));
            remaining -= val;
          }
        }
      }
      
      resolve({
        predictedClass,
        predictedLabel: DEMO_STAGES[predictedClass as keyof typeof DEMO_STAGES].name,
        confidence,
        probabilities,
        explanation: DEMO_EXPLANATIONS[predictedClass as keyof typeof DEMO_EXPLANATIONS],
        mode: 'demo'
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
