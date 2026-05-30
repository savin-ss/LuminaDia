"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Send, Loader2 } from "lucide-react"
import { sendChatMessage } from "@/lib/api"
import { ScanResult } from "@/hooks/use-scan"

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  scanContext: ScanResult;
}

type Message = {
  role: 'user' | 'assistant';
  content: string;
}

export function AIChat({ isOpen, onClose, scanContext }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello! I'm the LuminaDia Medical Assistant. I see you just analyzed an image which predicted **Stage ${scanContext.predictedClass}: ${scanContext.predictedLabel}**. How can I help you understand these results?` }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setIsLoading(true)

    try {
      const response = await sendChatMessage(userMsg, scanContext)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error connecting to the knowledge base." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 overflow-hidden border-blue-500/20">
        <DialogHeader className="p-4 border-b bg-blue-500/5">
          <DialogTitle className="flex items-center gap-2 text-blue-500">
            <Bot className="h-5 w-5" /> LuminaDia AI Assistant
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4 bg-background">
          <div className="space-y-4 pb-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 text-blue-500">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div className={`rounded-lg px-4 py-2 max-w-[80%] text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-muted text-foreground'
                }`}>
                  {/* Super basic markdown rendering for bold text and lists */}
                  <div className="whitespace-pre-wrap leading-relaxed" 
                       dangerouslySetInnerHTML={{ 
                         __html: msg.content
                           .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                           .replace(/## (.*?)\n/g, '<h3 class="font-bold text-base mt-2 mb-1 text-blue-400">$1</h3>')
                           .replace(/• (.*?)\n/g, '<li>$1</li>')
                           .replace(/(<li>.*<\/li>)/s, '<ul class="list-disc pl-4 my-2">$1</ul>')
                       }} 
                  />
                </div>
                {msg.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 text-blue-500">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <span className="text-xs text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Ask about your diagnosis..." 
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
