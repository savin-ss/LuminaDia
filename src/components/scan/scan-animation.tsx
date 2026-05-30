"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"

const STEPS = [
  {
    title: "Normalizing Input",
    desc: "Applying CLAHE and removing artifacts to enhance iris/retinal structures.",
  },
  {
    title: "Iris Segmentation",
    desc: "SwinUNetV2 isolating Region of Interest and removing background noise.",
  },
  {
    title: "Feature Extraction",
    desc: "ViT creating patch embeddings and extracting critical micro-structures.",
  },
  {
    title: "Classification",
    desc: "Generating Grad-CAM heatmap and predicting diabetic retinopathy stage.",
  }
]

interface ScanAnimationProps {
  imageSrc: string;
}

export function ScanAnimation({ imageSrc }: ScanAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => (prev < 3 ? prev + 1 : 3))
    }, 1500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md p-4 md:p-12">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        
        {/* Left: Image Animation */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-2xl">
          {/* Base Image */}
          <img 
            src={imageSrc} 
            alt="Scanning" 
            className={`w-full h-full object-cover transition-all duration-1000 ${
              currentStep === 0 ? "grayscale contrast-125 brightness-110" : ""
            }`}
          />
          
          {/* Step 1: Segmentation Box */}
          <AnimatePresence>
            {currentStep >= 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-[10%] border-2 border-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.5)] z-10"
              >
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 border-[4px] border-cyan-400/30 rounded-full"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 2: ViT Grid */}
          <AnimatePresence>
            {currentStep >= 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-20 pointer-events-none"
              >
                <div className="w-full h-full" style={{
                  backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                  backgroundSize: '10% 10%'
                }} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 3: Scan Line / Heatmap sim */}
          <AnimatePresence>
            {currentStep >= 3 && (
              <motion.div
                initial={{ top: "0%" }}
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)] z-30"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Right: Step Info */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">AI Analysis Pipeline</h2>
            <Progress value={(currentStep + 1) * 25} className="h-2" />
          </div>

          <div className="space-y-6 relative border-l-2 border-muted pl-6">
            <AnimatePresence mode="popLayout">
              {STEPS.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: idx <= currentStep ? 1 : 0.3,
                    scale: idx === currentStep ? 1.05 : 1
                  }}
                  className={`relative ${idx === currentStep ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  {/* Active Indicator dot */}
                  {idx === currentStep && (
                    <motion.div 
                      layoutId="activeDot"
                      className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                    />
                  )}
                  
                  <div className="flex items-start gap-4">
                    <span className={`text-xl font-bold font-mono ${idx === currentStep ? 'text-blue-500' : ''}`}>
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-semibold text-lg">{step.title}</h4>
                      <p className="text-sm mt-1 opacity-80">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
