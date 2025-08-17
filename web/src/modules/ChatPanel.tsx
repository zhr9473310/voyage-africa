import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { ChatMessage } from './types'
import { parseNDJSON } from './ndjson'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'

function useLocalStorage<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(() => {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) as T : initial
  })
  useEffect(() => { localStorage.setItem(key, JSON.stringify(val)) }, [key, val])
  return [val, setVal] as const
}

const Msg: React.FC<{ role: 'user'|'assistant'; content: string }> = ({ role, content }) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (role === 'assistant') {
      try { ref.current!.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el as HTMLElement)) } catch {}
    }
  }, [content, role])
  const html = useMemo(() => role === 'assistant'
    ? DOMPurify.sanitize(marked.parse(content || '') as string)
    : undefined, [content, role])
  return (
    <div className="msg flex gap-3 p-4 border-b border-[#20263a]">
      <div className="role flex-0 text-muted w-[52px] text-right">{role==='user'?'你':'AI'}</div>
      <div ref={ref} className={role==='user'?'bubble-user flex-1':'bubble-ai flex-1'} dangerouslySetInnerHTML={role==='assistant'?{__html:html!}:undefined}>
        {role==='user'?content:undefined}
      </div>
    </div>
  )
}

export default function ChatPanel() {
  const [model] = useLocalStorage('zhr_model', 'doubao-pro-32k')
  const [history, setHistory] = useLocalStorage<ChatMessage[]>('zhr_history', [])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{ chatRef.current?.scrollTo(0, chatRef.current.scrollHeight) },[history])

  const send = async () => {
    const q = input.trim(); if(!q || loading) return
    setInput('')
    const newHistory: ChatMessage[] = [...history, { role:'user', content:q }, { role:'assistant', content:'' }]
    setHistory(newHistory); setLoading(true); controllerRef.current = new AbortController()
    try{
      const res = await fetch('/api/chat-stream', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ messages:newHistory, model }),
        signal: controllerRef.current.signal,
        credentials: 'include'
      })
      if(!res.ok || !res.body){
        const j = await res.json().catch(()=>({error:`HTTP ${res.status}`}))
        throw new Error((j as any).error || '请求失败')
      }
      const reader = res.body.getReader(); const decoder = new TextDecoder(); let acc=''
      while(true){
        const { value, done } = await reader.read(); if(done) break
        const chunk = decoder.decode(value, {stream:true})
        for(const obj of parseNDJSON(chunk)){
          if('delta' in obj && obj.delta){
            acc += obj.delta
            setHistory(h=>{ const copy=h.slice(); copy[copy.length-1]={role:'assistant',content:acc}; return copy })
          }
        }
      }
    }catch(err:any){
      setHistory(h=>{ const copy=h.slice(); copy[copy.length-1]={role:'assistant',content:'❌ '+(err?.message||'出错了')}; return copy })
    }finally{ setLoading(false); controllerRef.current=null }
  }

  const stop = () => { controllerRef.current?.abort() }
  const clear = () => setHistory([])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">AI 助手</div>
        <div className="flex gap-2">
          <button onClick={clear} className="bg-[#1c2233] border border-[#2a3045] rounded-xl px-3 py-2">清空</button>
          <button onClick={stop}  className="bg-[#1c2233] border border-[#2a3045] rounded-xl px-3 py-2">停止</button>
        </div>
      </div>
      <div ref={chatRef} className="flex-1 overflow-auto p-3 card shadow-inset1 min-h-[320px]">
        {history.map((m,i)=><Msg key={i} role={m.role} content={m.content}/>)}
      </div>
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={e=>setInput(e.target.value)}
          rows={2}
          placeholder="说点什么…(Shift+Enter 换行)"
          className="flex-1 resize-y min-h-[56px] max-h-[200px] bg-[#111523] text-text border border-[#2a3045] rounded-xl p-3 outline-none"
          onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send() } }}
        />
        <button onClick={send} disabled={loading} className="min-w-[96px] bg-[#1c2233] border border-[#2a3045] rounded-xl px-4 py-2">
          {loading ? '发送中…' : '发送'}
        </button>
      </div>
    </div>
  )
}
