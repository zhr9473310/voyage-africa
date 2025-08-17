import { useState, useMemo } from 'react';

type Role = 'user'|'assistant'|'system';
interface ChatMessage { role: Role; content: string; }

function looksLikeJSON(s:string){ const t=s.trim(); return t.startsWith('{')||t.startsWith('[');}
function pickText(obj:any): string {
  if(!obj) return '';
  if(typeof obj.text==='string') return obj.text;
  if(typeof obj.content==='string') return obj.content;
  if(Array.isArray(obj)) return obj.map(pickText).join('\n\n');
  return typeof obj==='object' ? JSON.stringify(obj,null,2) : String(obj);
}
function normalize(raw:any):string{
  let s = typeof raw==='string' ? raw : pickText(raw);
  if(looksLikeJSON(s)){ try{ s = pickText(JSON.parse(s)); }catch{} }
  // 去转义：\n -> 换行，\t -> 两空格
  s = s.replace(/\\n/g, '\n').replace(/\\t/g, '  ').replace(/\r/g,'');
  return s.trim();
}
// 轻量 Markdown 转 HTML（标题/粗体/列表/换行）
function mdToHtml(md:string){
  let html = md
    .replace(/^######\s?(.*)$/gm, '<h6>$1</h6>')
    .replace(/^#####\s?(.*)$/gm, '<h5>$1</h5>')
    .replace(/^####\s?(.*)$/gm, '<h4>$1</h4>')
    .replace(/^###\s?(.*)$/gm, '<h3>$1</h3>')
    .replace(/^##\s?(.*)$/gm, '<h2>$1</h2>')
    .replace(/^#\s?(.*)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.*)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)(\s*(<li>.*<\/li>))+?/gs, m=>`<ul>${m}</ul>`)
    .replace(/\n\n+/g,'</p><p>')
    .replace(/\n/g,'<br/>');
  return `<div class="prose"><p>${html}</p></div>`;
}

export default function ChatModule(){
  const [input,setInput] = useState('');
  const [loading,setLoading] = useState(false);
  const [history,setHistory] = useState<ChatMessage[]>([]);

  async function send(){
    const text = input.trim();
    if(!text) return;
    setInput('');
    const newHistory: ChatMessage[] = [...history, { role: 'user', content: text }];
    setHistory(newHistory);
    setLoading(true);
    try{
      const resp = await fetch('/api/chat', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        credentials:'include',
        body: JSON.stringify({ messages: newHistory })
      });
      const data = await resp.json();
      const raw = data.answer ?? data.content ?? data.choices?.[0]?.message?.content ?? data;
      const norm = normalize(raw);
      setHistory(h => [...h, {role:'assistant', content: norm}]);
    }catch(e:any){
      setHistory(h => [...h, {role:'assistant', content: '请求失败：'+(e?.message||e)}]);
    }finally{
      setLoading(false);
    }
  }

  const rendered = useMemo(()=>history.map((m,i)=>{
    const html = mdToHtml(m.content);
    return (
      <div key={i} style={{margin:'14px 0'}}>
        <div style={{fontWeight:800, color: m.role==='user' ? 'var(--c-primary)' : 'var(--c-ink)'}}>{m.role==='user'?'我':'助手'}</div>
        <div dangerouslySetInnerHTML={{__html: html}}/>
      </div>
    );
  }),[history]);

  return (
    <div style={{maxWidth:1000, margin:'22px auto', padding:'0 18px'}}>
      <h2 className="h2">AI 行程助手 · 对话</h2>
      <div className="card" style={{padding:16, minHeight:260, background:'#fff'}}>
        {history.length===0 ? <div className="muted">试试：“7 天肯尼亚+坦桑尼亚看迁徙，预算中等，如何安排并标注门票预约？”</div> : null}
        {rendered}
      </div>
      <div style={{display:'flex', gap:10, marginTop:12}}>
        <input
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); send(); } }}
          placeholder="输入你的需求，回车发送"
          style={{flex:1, padding:'12px 14px', borderRadius:12, border:'1px solid #e6eaf2', background:'#fff'}}
        />
        <button onClick={send} disabled={loading} className="btn">{loading?'发送中…':'发送'}</button>
      </div>
    </div>
  );
}
