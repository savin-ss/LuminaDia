export function Footer() {
  return (
    <footer className="border-t bg-background/50 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          
          <div className="space-y-3">
            <h3 className="font-semibold text-lg bg-gradient-to-r from-lumina-primary to-cyan-400 bg-clip-text text-transparent">
              LuminaDia
            </h3>
            <p className="text-muted-foreground leading-relaxed max-w-xs">
              A Fusion-Based Explainable AI Framework for Non-Invasive Diabetes Detection using retinal and iris imagery.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Research Team</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Luthaifa <span className="text-xs opacity-70">(4PA22AI014)</span></li>
              <li>Savin S S <span className="text-xs opacity-70">(4PA22AI024)</span></li>
              <li>Ummar Farook Shahil <span className="text-xs opacity-70">(4PA22AI031)</span></li>
              <li>Riha Kulsum <span className="text-xs opacity-70">(4PA23AI401)</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Academic Affiliation</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="font-medium text-foreground">Under the guidance of:</li>
              <li>Dr. Mohammed Zakir B</li>
              <li className="pt-2">P.A. College of Engineering</li>
              <li>Visvesvaraya Technological University (VTU)</li>
              <li>Mangalore, Karnataka 574153</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2025-26 LuminaDia Research Team. All rights reserved.</p>
          <p>For educational and research purposes only. Not for clinical diagnosis.</p>
        </div>
      </div>
    </footer>
  )
}
