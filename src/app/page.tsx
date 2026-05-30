"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Eye, Brain, Zap, FileText, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
        
        <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col items-center space-y-8 max-w-4xl"
          >
            <motion.div variants={fadeIn} className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">VTU Project 2025-26</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                LuminaDia
              </span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-muted-foreground font-medium max-w-3xl">
              Explainable AI Framework for Non-Invasive Diabetes Detection
            </motion.p>
            
            <motion.p variants={fadeIn} className="text-muted-foreground max-w-2xl leading-relaxed">
              Detect diabetic retinopathy instantly using advanced Vision Transformers and Grad-CAM visualizations. 
              No blood tests required. Fully explainable AI decisions.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/scan">
                <Button size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                  Start Analysis <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full border-blue-500/20 hover:bg-blue-500/10">
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Advanced AI Pipeline</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our state-of-the-art framework combines multiple deep learning models to provide accurate, explainable results.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Eye,
                title: "Non-Invasive",
                desc: "Analyzes iris and retinal images, completely eliminating the need for painful blood tests."
              },
              {
                icon: Brain,
                title: "Explainable AI",
                desc: "Grad-CAM and ViT attention maps provide transparent visualization of the AI's decision process."
              },
              {
                icon: Zap,
                title: "Real-Time",
                desc: "Optimized inference pipeline delivers clinical-grade analysis results in under 5 seconds."
              },
              {
                icon: FileText,
                title: "Medical Reports",
                desc: "Automatically generates printable PDF reports with diagnosis, confidence, and recommendations."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full bg-background/50 backdrop-blur-sm border-muted transition-all hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 text-blue-500">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x border-border">
            <div className="flex flex-col p-4">
              <span className="text-5xl font-bold bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent">99.1%</span>
              <span className="text-sm font-medium text-muted-foreground mt-2 uppercase tracking-wider">Validation Accuracy</span>
            </div>
            <div className="flex flex-col p-4">
              <span className="text-5xl font-bold bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent">5</span>
              <span className="text-sm font-medium text-muted-foreground mt-2 uppercase tracking-wider">DR Stages Detected</span>
            </div>
            <div className="flex flex-col p-4">
              <span className="text-5xl font-bold bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent">39k+</span>
              <span className="text-sm font-medium text-muted-foreground mt-2 uppercase tracking-wider">Training Images</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
