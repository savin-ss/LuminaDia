"use client"

import Link from "next/link"
import { Eye, Moon, Sun, Activity } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useBackendStatus } from "@/hooks/use-backend-status"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { isOnline, mode } = useBackendStatus()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lumina-primary to-blue-400 text-white shadow-lg shadow-blue-500/20">
            <Eye className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-lumina-primary to-cyan-400 bg-clip-text text-transparent">
              LuminaDia
            </span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider -mt-1">
              XAI Diabetes Detection
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
          <Link href="/scan" className="text-foreground font-semibold hover:text-primary transition-colors">Scan Image</Link>
          <Link href="/history" className="text-muted-foreground hover:text-primary transition-colors">History</Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-xs font-semibold text-muted-foreground">P.A. College of Engineering</span>
            <span className="text-[10px] text-muted-foreground">VTU Belagavi</span>
          </div>

          <Badge variant="outline" className={`hidden sm:flex gap-1.5 px-3 py-1 bg-background/50 backdrop-blur-md border ${isOnline ? 'border-green-500/30 text-green-500' : 'border-yellow-500/30 text-yellow-500'}`}>
            <span className={`relative flex h-2 w-2`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            </span>
            {isOnline ? 'Real Model' : 'Demo Mode'}
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-full w-9 h-9"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

      </div>
    </header>
  )
}
