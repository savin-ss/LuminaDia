"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface VisualizationViewerProps {
  imageSrc: string;
  gradcamBase64?: string | null;
  vitAttentionBase64?: string | null;
}

export function VisualizationViewer({ imageSrc, gradcamBase64, vitAttentionBase64 }: VisualizationViewerProps) {
  return (
    <div className="flex flex-col space-y-4">
      <Tabs defaultValue="gradcam" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-2">
          <TabsTrigger value="gradcam">Grad-CAM</TabsTrigger>
          <TabsTrigger value="vit">ViT Map</TabsTrigger>
          <TabsTrigger value="original">Original</TabsTrigger>
        </TabsList>
        
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-black shadow-lg border border-border">
          <TabsContent value="original" className="mt-0 h-full w-full">
            <img src={imageSrc} alt="Original" className="h-full w-full object-cover" />
          </TabsContent>
          
          <TabsContent value="gradcam" className="mt-0 h-full w-full">
            {gradcamBase64 ? (
              <img src={`data:image/png;base64,${gradcamBase64}`} alt="Grad-CAM" className="h-full w-full object-cover" />
            ) : (
              <div className="relative h-full w-full">
                <img src={imageSrc} alt="Base" className="absolute inset-0 h-full w-full object-cover" />
                {/* Synthetic GradCAM for demo */}
                <div className="absolute inset-0 mix-blend-overlay opacity-60 bg-[radial-gradient(ellipse_at_center,_rgba(255,0,0,0.8)_0%,_rgba(255,255,0,0.5)_40%,_transparent_70%)]" />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="vit" className="mt-0 h-full w-full">
            {vitAttentionBase64 ? (
              <img src={`data:image/png;base64,${vitAttentionBase64}`} alt="ViT Attention" className="h-full w-full object-cover" />
            ) : (
              <div className="relative h-full w-full">
                <img src={imageSrc} alt="Base" className="absolute inset-0 h-full w-full object-cover grayscale brightness-75" />
                {/* Synthetic ViT for demo */}
                <div className="absolute inset-0 mix-blend-screen opacity-50 bg-[radial-gradient(circle_at_60%_40%,_rgba(255,255,255,0.8)_0%,_rgba(0,0,0,0)_50%)]" />
                <div className="absolute inset-0 pointer-events-none" style={{
                  backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                  backgroundSize: '10% 10%'
                }} />
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
