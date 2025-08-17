const chat=document.getElementById('chat');
const sendBtn=document.getElementById('send');
const clearBtn=document.getElementById('clear');
const stopBtn=document.getElementById('stop');
const input=document.getElementById('prompt');
const modelSelect=document.getElementById('model');

let history=[];      // [{role, content}]
let controller=null; // AbortController for streaming

// 恢复历史
try{
  const saved=localStorage.getItem('zhr_chat_history');
  if(saved){
    history=JSON.parse(saved);
    for(const m of history){
      const b=addMessage(m.role, '');
      renderContent(b, m.content, m.role);
    }
  }
}catch{}

// 工具：渲染一条消息（支持 Markdown+高亮）
function renderContent(bubbleEl, text, role='assistant'){
  // assistant 用 Markdown，user 直接文本
  if(role==='assistant'){
    const html = DOMPurify.sanitize(marked.parse(text || ''));
    bubbleEl.innerHTML = html;
    // 代码高亮
    try{ hljs.highlightAll(); }catch{}
  }else{
    bubbleEl.textContent = text || '';
  }
}

function addMessage(role, content){
  const w=document.createElement('div'); w.className=`msg ${role}`;
  const r=document.createElement('div'); r.className='role'; r.textContent=role==='user'?'你':'AI';
  const b=document.createElement('div'); b.className='bubble';
  w.appendChild(r); w.appendChild(b); chat.appendChild(w); chat.scrollTop=chat.scrollHeight;
  return b;
}

function save(){ localStorage.setItem('zhr_chat_history', JSON.stringify(history)); }

clearBtn.onclick=()=>{ history=[]; save(); chat.innerHTML=''; };

input.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendBtn.click(); }});

stopBtn.onclick=()=>{ try{ controller?.abort(); }catch{} };

sendBtn.onclick=async()=>{
  const text=input.value.trim(); if(!text) return; input.value='';
  // 用户消息
  history.push({role:'user', content:text}); save();
  const ub=addMessage('user',''); renderContent(ub, text, 'user');
  // AI 占位
  history.push({role:'assistant', content:''}); save();
  const ab=addMessage('assistant','');

  // 开始流式
  try{
    controller = new AbortController();
    const res = await fetch('/api/chat-stream',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ messages:[...history], model:modelSelect.value }),
      signal: controller.signal
    });
    if(!res.ok || !res.body){
      const j = await res.json().catch(()=>({error:`HTTP ${res.status}`}));
      throw new Error(j.error || '请求失败');
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let textSoFar = '';

    while(true){
      const { value, done } = await reader.read();
      if(done) break;
      const chunk = decoder.decode(value, {stream:true});
      for(const line of chunk.split('\n')){
        if(!line) continue;
        try{
          const data = JSON.parse(line);
          if(data.delta){
            textSoFar += data.delta;
            renderContent(ab, textSoFar, 'assistant');
          }else if(data.error){
            throw new Error(data.error);
          }
        }catch{}
      }
      chat.scrollTop = chat.scrollHeight;
    }
    // 写回历史并持久化
    history[history.length-1].content = textSoFar; save();
  }catch(err){
    renderContent(ab, '❌ '+(err.message||'出错了'), 'assistant');
  }finally{
    controller = null;
  }
};  });
    if(!res.ok || !res.body){
      const j = await res.json().catch(()=>({error:`HTTP ${res.status}`}));
      throw new Error(j.error || '请求失败');
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let textSoFar = '';

    while(true){
      const { value, done } = await reader.read();
      if(done) break;
      const chunk = decoder.decode(value, {stream:true});
      for(const line of chunk.split('\n')){
        if(!line) continue;
        try{
          const data = JSON.parse(line);
          if(data.delta){
            textSoFar += data.delta;
            renderContent(ab, textSoFar, 'assistant');
          }else if(data.error){
            throw new Error(data.error);
          }
        }catch{}
      }
      chat.scrollTop = chat.scrollHeight;
    }
    // 写回历史并持久化
    history[history.length-1].content = textSoFar; save();
  }catch(err){
    renderContent(ab, '❌ '+(err.message||'出错了'), 'assistant');
  }finally{
    controller = null;
  }
};
  });
    if(!res.ok || !res.body){
      const j = await res.json().catch(()=>({error:`HTTP ${res.status}`}));
      throw new Error(j.error || '请求失败');
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let textSoFar = '';

    while(true){
      const { value, done } = await reader.read();
      if(done) break;
      const chunk = decoder.decode(value, {stream:true});
      for(const line of chunk.split('\n')){
        if(!line) continue;
        try{
          const data = JSON.parse(line);
          if(data.delta){
            textSoFar += data.delta;
            renderContent(ab, textSoFar, 'assistant');
          }else if(data.error){
            throw new Error(data.error);
          }
        }catch{}
      }
      chat.scrollTop = chat.scrollHeight;
    }
    // 写回历史并持久化
    history[history.length-1].content = textSoFar; save();
  }catch(err){
    renderContent(ab, '❌ '+(err.message||'出错了'), 'assistant');
  }finally{
    controller = null;
  }
};
