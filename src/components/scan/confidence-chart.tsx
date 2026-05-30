"use client"

import { motion } from "framer-motion"

interface ConfidenceChartProps {
  probabilities: Record<string, number>;
  predictedClass: number;
}

const STAGE_COLORS: Record<string, string> = {
  "No DR": "bg-lumina-success",
  "Mild DR": "bg-lumina-warning",
  "Moderate DR": "bg-lumina-orange",
  "Severe DR": "bg-lumina-pink",
  "Proliferative DR": "bg-lumina-danger",
  "No Diabetic Retinopathy": "bg-lumina-success",
  "Mild Diabetic Retinopathy": "bg-lumina-warning",
  "Moderate Diabetic Retinopathy": "bg-lumina-orange",
  "Severe Diabetic Retinopathy": "bg-lumina-pink",
  "Proliferative Diabetic Retinopathy": "bg-lumina-danger",
}

export function ConfidenceChart({ probabilities, predictedClass }: ConfidenceChartProps) {
  // Sort entries to keep them in stage order (assuming keys align with stages somewhat, or just iterate predictably)
  const entries = Object.entries(probabilities);
  
  return (
    <div className="space-y-4 w-full">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Stage Probabilities</h3>
      <div className="space-y-3">
        {entries.map(([label, percentage], i) => {
          const isWinner = percentage === Math.max(...Object.values(probabilities));
          const colorClass = STAGE_COLORS[label] || "bg-blue-500";
          
          return (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className={isWinner ? "font-bold text-foreground" : "text-muted-foreground"}>
                  {label}
                </span>
                <span className={isWinner ? "font-bold text-foreground" : "text-muted-foreground"}>
                  {percentage.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                  className={`h-full rounded-full ${colorClass} ${isWinner ? 'opacity-100 shadow-sm' : 'opacity-60'}`}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
