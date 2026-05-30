"use client"

import { useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer, Download } from "lucide-react"
import { ScanResult } from "@/hooks/use-scan"

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ScanResult;
  imageSrc: string;
}

export function ReportModal({ isOpen, onClose, result, imageSrc }: ReportModalProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  const dateStr = new Date().toLocaleString()
  const reportId = `LUM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto print:max-w-full print:border-none print:shadow-none print:bg-white print:text-black">
        <DialogHeader className="print:hidden flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle>Medical Analysis Report</DialogTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Print PDF
            </Button>
          </div>
        </DialogHeader>

        {/* Report Content - Print Friendly */}
        <div ref={contentRef} className="p-2 sm:p-8 space-y-8 bg-white text-black print:p-0">
          
          {/* Header */}
          <div className="border-b-2 border-blue-600 pb-6 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-blue-700 tracking-tight">LUMINADIA</h1>
              <p className="text-sm text-gray-500 font-medium">Explainable AI Framework for Non-Invasive Diabetes Detection</p>
            </div>
            <div className="text-right text-xs text-gray-500 space-y-1">
              <p><strong>Report ID:</strong> {reportId}</p>
              <p><strong>Date:</strong> {dateStr}</p>
              <p><strong>Facility:</strong> P.A. College of Engineering</p>
            </div>
          </div>

          {/* Patient / Scan Info */}
          <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div>
              <p className="text-gray-500 mb-1">Scan Target</p>
              <p className="font-semibold">Ocular Image (Iris/Retina)</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Analysis Engine</p>
              <p className="font-semibold">Vision Transformer (ViT-Base-Patch16) {result.mode === 'demo' ? '[Demo Mode]' : ''}</p>
            </div>
          </div>

          {/* Diagnosis Box */}
          <div className={`border-l-4 p-6 rounded-r-lg ${result.predictedClass >= 3 ? 'border-red-600 bg-red-50' : result.predictedClass >= 1 ? 'border-yellow-500 bg-yellow-50' : 'border-green-600 bg-green-50'}`}>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Primary Diagnosis</h2>
            <div className="flex justify-between items-center">
              <span className={`text-2xl font-bold ${result.predictedClass >= 3 ? 'text-red-700' : result.predictedClass >= 1 ? 'text-yellow-700' : 'text-green-700'}`}>
                Stage {result.predictedClass}: {result.predictedLabel}
              </span>
              <span className="text-xl font-black bg-white px-4 py-1 rounded shadow-sm border border-black/10">
                {result.confidence}% Confidence
              </span>
            </div>
          </div>

          {/* Two Column Layout for Details */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold border-b border-gray-200 pb-2 mb-3">AI Interpretation</h3>
                <p className="text-sm leading-relaxed text-gray-700">{result.explanation}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold border-b border-gray-200 pb-2 mb-3">Probability Distribution</h3>
                <div className="space-y-2">
                  {Object.entries(result.probabilities).map(([label, val]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-mono font-medium">{val}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b border-gray-200 pb-2 mb-3">Reference Image</h3>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative">
                <img src={imageSrc} alt="Scanned Eye" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Recommendation Box */}
          {result.solution && (
            <div className="mt-8 border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 font-bold text-gray-800">
                Medical Recommendation
              </div>
              <div className="p-4 text-gray-700 text-sm">
                {result.solution}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
            <p>DISCLAIMER: This report is generated by an AI framework (LuminaDia) for research and screening purposes.</p>
            <p>It does not constitute a definitive medical diagnosis. Please consult an ophthalmologist for clinical evaluation.</p>
          </div>

        </div>
      </DialogContent>
      {/* Add a global style just for print when this component is mounted */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .print\\:text-black { visibility: visible !important; color: black !important; }
          .print\\:text-black * { visibility: visible !important; }
          .print\\:border-none { border: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:hidden { display: none !important; }
          .sm\\:p-8 { padding: 0 !important; }
          [role="dialog"] { position: absolute; left: 0; top: 0; margin: 0; padding: 0; width: 100%; min-height: 100vh; transform: none !important; }
        }
      `}} />
    </Dialog>
  )
}
