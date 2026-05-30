"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Eye, ShieldAlert, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Scan = {
  id: string;
  filename: string;
  predictedClass: number;
  predictedLabel: string;
  confidence: number;
  mode: string;
  createdAt: string;
}

const STAGE_COLORS: Record<number, string> = {
  0: "border-lumina-success text-lumina-success bg-lumina-success/10",
  1: "border-lumina-warning text-lumina-warning bg-lumina-warning/10",
  2: "border-lumina-orange text-lumina-orange bg-lumina-orange/10",
  3: "border-lumina-pink text-lumina-pink bg-lumina-pink/10",
  4: "border-lumina-danger text-lumina-danger bg-lumina-danger/10",
}

export default function HistoryPage() {
  const [scans, setScans] = useState<Scan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/scans')
      .then(res => res.json())
      .then(data => {
        setScans(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to load scans", err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-blue-500" /> Analysis History
        </h1>
        <p className="text-muted-foreground">Review previous diabetic retinopathy screening results.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">Loading history...</div>
          ) : scans.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <Eye className="mx-auto h-8 w-8 mb-2 opacity-20" />
              <p>No scans found. Start by analyzing an image.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Filename</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Engine</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scans.map((scan) => {
                  const date = new Date(scan.createdAt)
                  const isHighRisk = scan.predictedClass >= 3
                  return (
                    <TableRow key={scan.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium whitespace-nowrap">
                        {date.toLocaleDateString()} <span className="text-muted-foreground text-xs">{date.toLocaleTimeString()}</span>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={scan.filename}>
                        {scan.filename}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isHighRisk ? (
                            <ShieldAlert className="h-4 w-4 text-lumina-danger" />
                          ) : (
                            <ShieldCheck className="h-4 w-4 text-lumina-success" />
                          )}
                          <Badge variant="outline" className={STAGE_COLORS[scan.predictedClass] || ""}>
                            Stage {scan.predictedClass}
                          </Badge>
                          <span className="text-sm hidden sm:inline">{scan.predictedLabel}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono">{scan.confidence.toFixed(1)}%</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">
                          {scan.mode === 'real' ? 'Real Model' : 'Demo Mode'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
