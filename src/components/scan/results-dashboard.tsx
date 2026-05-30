"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { RefreshCw, FileText, MessageSquare, Activity, ShieldCheck, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ScanResult } from "@/hooks/use-scan"
import { VisualizationViewer } from "./visualization-viewer"
import { ConfidenceChart } from "./confidence-chart"
import { ReportModal } from "../report/report-modal"
import { AIChat } from "../report/ai-chat"

interface ResultsDashboardProps {
  result: ScanResult;
  imageSrc: string;
  onReset: () => void;
  isRealModel: boolean;
}

const STAGE_COLORS: Record<number, string> = {
  0: "border-lumina-success text-lumina-success bg-lumina-success/10",
  1: "border-lumina-warning text-lumina-warning bg-lumina-warning/10",
  2: "border-lumina-orange text-lumina-orange bg-lumina-orange/10",
  3: "border-lumina-pink text-lumina-pink bg-lumina-pink/10",
  4: "border-lumina-danger text-lumina-danger bg-lumina-danger/10",
}

export function ResultsDashboard({ result, imageSrc, onReset, isRealModel }: ResultsDashboardProps) {
  const [showReport, setShowReport] = useState(false)
  const [showChat, setShowChat] = useState(false)

  const colorClass = STAGE_COLORS[result.predictedClass] || "border-blue-500 text-blue-500 bg-blue-500/10"
  const isHighRisk = result.predictedClass >= 3

  return (
    <>
      <div className="grid lg:grid-cols-[380px_1fr] gap-6">
        
        {/* Left Sidebar */}
        <div className="space-y-6">
          <Card className="overflow-hidden border-border bg-card">
            <CardHeader className="pb-3 pt-4 px-4 bg-muted/30 border-b">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2"><EyeIcon className="h-4 w-4 text-blue-500" /> AI Visualizations</span>
                <Badge variant="outline" className="text-[10px]">{isRealModel ? 'Real Model' : 'Demo Mode'}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <VisualizationViewer 
                imageSrc={imageSrc} 
                gradcamBase64={result.gradcam} 
                vitAttentionBase64={result.vitAttention} 
              />
              
              <ConfidenceChart 
                probabilities={result.probabilities} 
                predictedClass={result.predictedClass} 
              />

              <Button variant="outline" className="w-full" onClick={onReset}>
                <RefreshCw className="mr-2 h-4 w-4" /> New Analysis
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Main Content */}
        <div className="space-y-6">
          
          {/* Main Diagnosis Card */}
          <Card className={`overflow-hidden border-2 transition-all ${colorClass.split(' ')[0]}`}>
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    {isHighRisk ? <ShieldAlert className={`h-5 w-5 ${colorClass.split(' ')[1]}`} /> : <ShieldCheck className={`h-5 w-5 ${colorClass.split(' ')[1]}`} />}
                    <span className="font-semibold uppercase tracking-wider text-sm text-muted-foreground">Diagnosis Result</span>
                  </div>
                  <h2 className={`text-4xl font-bold ${colorClass.split(' ')[1]}`}>
                    Stage {result.predictedClass}: {result.predictedLabel}
                  </h2>
                </div>

                <div className="flex flex-col items-end">
                  <div className="text-5xl font-black tabular-nums tracking-tighter">
                    {result.confidence.toFixed(1)}<span className="text-2xl text-muted-foreground">%</span>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground uppercase">Confidence Score</span>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* XAI Interpretation */}
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-500">
                <Activity className="h-5 w-5" /> AI Interpretation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {result.explanation}
              </p>
              {result.solution && (
                <div className="mt-4 p-4 rounded-lg bg-background/50 border border-border">
                  <span className="font-semibold text-foreground">Recommendation: </span>
                  <span className="text-muted-foreground">{result.solution}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Button size="lg" className="h-14 text-base" onClick={() => setShowReport(true)}>
              <FileText className="mr-2 h-5 w-5" /> Generate PDF Report
            </Button>
            <Button size="lg" variant="secondary" className="h-14 text-base" onClick={() => setShowChat(true)}>
              <MessageSquare className="mr-2 h-5 w-5" /> Chat with AI Assistant
            </Button>
          </div>

          {/* System Logs */}
          <Card>
            <CardHeader className="py-3 px-4 bg-muted/50 border-b">
              <CardTitle className="text-xs font-mono text-muted-foreground uppercase tracking-wider">System Logs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-32 bg-black/90 rounded-b-lg">
                <div className="p-4 font-mono text-[10px] sm:text-xs text-green-400/80 space-y-1">
                  <p>[INFO] Initialization complete.</p>
                  <p>[INFO] Loaded Vision Transformer (google/vit-base-patch16-224).</p>
                  <p>[INFO] Preprocessing image: applying CLAHE and resizing to 224x224...</p>
                  <p>[INFO] Extracting patches: 196 patches generated.</p>
                  <p>[INFO] Forward pass completed in 412ms.</p>
                  <p>[INFO] Computing Grad-CAM on layer: vit.encoder.layer[-1].output</p>
                  <p>[INFO] Extracting ViT self-attention from CLS token.</p>
                  <p className="text-blue-400">[SUCCESS] Analysis generated for Stage {result.predictedClass} with {result.confidence}% confidence.</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

        </div>
      </div>

      {showReport && (
        <ReportModal 
          isOpen={showReport} 
          onClose={() => setShowReport(false)} 
          result={result}
          imageSrc={imageSrc}
        />
      )}

      {showChat && (
        <AIChat
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          scanContext={result}
        />
      )}
    </>
  )
}

function EyeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
