'use client'

import { useState, useRef, useEffect } from 'react'
import { Brain, Send, Loader2, Sparkles, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface LessonTutorSidebarProps {
  lessonId: string
  lessonTitle: string
}

const suggestions = [
  'Summarize this lesson',
  'Create a 3-question practice quiz',
  'Explain the industrial example in simple terms',
]

export default function LessonTutorSidebar({ lessonId, lessonTitle }: LessonTutorSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I am your PolymerHub AI Tutor. I have read **"${lessonTitle}"**. Ask me any questions about this lesson!`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return
    
    setError(null)
    const userMessage = textToSend.trim()
    setInput('')
    
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          lessonId,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate response')
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(errorMessage || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 flex flex-col h-[600px] lg:h-[calc(100vh-12rem)] shadow-lg shadow-slate-100/50 sticky top-24 overflow-hidden">
      {/* Header */}
      <div className="bg-[#0F4C81] text-white p-4 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
          <Brain className="w-4.5 h-4.5 text-[#F97316]" />
        </div>
        <div>
          <h3 className="font-bold text-xs">Active Lesson Tutor</h3>
          <p className="text-[9px] text-blue-200">Context: {lessonTitle.slice(0, 30)}...</p>
        </div>
      </div>

      {/* Messages Scroll Box */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                m.role === 'user'
                  ? 'bg-[#0F4C81] text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-line font-medium">{m.content}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-3.5 shadow-sm flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 text-[#0F4C81] animate-spin" />
              <span className="text-slate-400 text-[11px] font-medium">Tutor is thinking...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-xl flex items-start gap-2 text-[11px]">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggestions Strip */}
      {messages.length === 1 && (
        <div className="p-3 bg-white border-t border-slate-50 space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#F97316]" /> Quick prompts
          </p>
          <div className="flex flex-col gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="text-left bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 text-[11px] text-slate-600 hover:text-[#0F4C81] p-2 rounded-xl transition-all font-medium"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3.5 bg-white border-t border-slate-100">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend(input)
          }}
          className="flex gap-2 items-end"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend(input)
              }
            }}
            placeholder="Ask anything about this lesson..."
            rows={1}
            className="flex-1 min-h-[40px] max-h-[100px] border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81] rounded-xl text-xs py-2 px-3 resize-none font-medium"
          />
          <Button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-[#0F4C81] hover:bg-[#0A3560] text-white p-2.5 rounded-xl h-10 w-10 shrink-0 flex items-center justify-center transition-colors"
          >
            <Send className="w-4.5 h-4.5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
