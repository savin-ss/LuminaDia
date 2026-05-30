"use client"

import { useState } from "react"
import { useScan } from "@/hooks/use-scan"
import { UploadZone } from "@/components/scan/upload-zone"
import { ScanAnimation } from "@/components/scan/scan-animation"
import { ResultsDashboard } from "@/components/scan/results-dashboard"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function ScanPage() {
  const { state, result, error, imageSrc, startScan, reset, isRealModel } = useScan()

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {state === 'idle' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Iris Analysis</h1>
            <p className="text-muted-foreground">Upload a clear image of an eye (iris or retina) to begin the AI screening.</p>
          </div>
          <UploadZone onFileSelected={startScan} />
        </div>
      )}

      {state === 'analyzing' && imageSrc && (
        <ScanAnimation imageSrc={imageSrc} />
      )}

      {state === 'complete' && result && imageSrc && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <ResultsDashboard 
            result={result} 
            imageSrc={imageSrc} 
            onReset={reset}
            isRealModel={isRealModel}
          />
        </div>
      )}
    </div>
  )
}
