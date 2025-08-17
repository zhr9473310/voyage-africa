import { useState } from 'react';

const interests = [
  {key:'wildlife', label:'野生动物'},
  {key:'savanna', label:'草原/迁徙'},
  {key:'coast', label:'海岸/潜水'},
  {key:'desert', label:'沙漠/星空'},
  {key:'culture', label:'人文/市集'},
  {key:'volcano', label:'火山/裂谷'},
];

export default function Planner(){
  const [country, setCountry] = useState('肯尼亚');
  const [days, setDays] = useState(7);
  const [season, setSeason] = useState('7-9月');
  const [budget, setBudget] = useState('中等');
  const [tags, setTags] = useState<string[]>(['wildlife','savanna']);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState('');

  function toggleTag(k:string){
    setTags(t => t.includes(k) ? t.filter(x=>x!==k) : [...t, k]);
  }

  async function generate(){
    setBusy(true); setResult('');
    const want = tags.map(k=>interests.find(x=>x.key===k)?.label).filter(Boolean).join('、');
    const userPrompt =
`请根据以下偏好，生成一个可执行的非洲旅行行程（用 Markdown 排版，避免乱码符号）：
- 目的地国家：${country}
- 行程天数：${days} 天
- 出行季节：${season}
- 预算：${budget}
- 兴趣：${want}
- 要求：按“D1/D2...”分天列出，给出当天关键地点、活动、车程/航段建议、约束（预约/门票/最佳时段）、可选升级项；最后附“预估费用拆分（不含国际段）”与“注意事项”。`;

    const r = await fetch('/api/chat', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      credentials:'include',
      body: JSON.stringify({
        messages: [
          { role:'system', content:'你是一名非洲旅行策划师，只输出清晰可靠的行程，不要输出多余前言或奇怪字符。' },
          { role:'user', content: userPrompt }
        ]
      })
    });
    const j = await r.json();
    setBusy(false);
    if (!r.ok) { setResult(`生成失败：${j?.error||r.status}`); return; }
    setResult(j?.content || j?.answer || '无内容');
  }

  return (
    <div className="container section" style={{maxWidth:980}}>
      <h2 className="h2">AI 行程助手（先选需求 → 一键生成）</h2>

      <div className="card" style={{padding:16, display:'grid', gap:12}}>
        <div className="grid3">
          <div>
            <div className="muted">国家</div>
            <select className="input" value={country} onChange={e=>setCountry(e.target.value)}>
              {['肯尼亚','坦桑尼亚','纳米比亚','南非','埃及','摩洛哥','马达加斯加','塞舌尔','桑给巴尔'].map(c=>
                <option key={c} value={c}>{c}</option>
              )}
            </select>
          </div>
          <div>
            <div className="muted">天数</div>
            <input className="input" type="number" min={3} max={21} value={days} onChange={e=>setDays(parseInt(e.target.value||'7'))}/>
          </div>
          <div>
            <div className="muted">季节</div>
            <select className="input" value={season} onChange={e=>setSeason(e.target.value)}>
              {['1-3月','4-6月','7-9月','10-12月','全年'].map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="grid3">
          <div>
            <div className="muted">预算</div>
            <select className="input" value={budget} onChange={e=>setBudget(e.target.value)}>
              {['经济','中等','舒适','高端'].map(b=><option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div style={{gridColumn:'span 2'}}>
            <div className="muted">兴趣（多选）</div>
            <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
              {interests.map(it=>(
                <button key={it.key}
                        type="button"
                        className={`btn ${tags.includes(it.key)?'':'secondary'}`}
                        onClick={()=>toggleTag(it.key)}>
                  {it.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{display:'flex', gap:12}}>
          <button className="btn" onClick={generate} disabled={busy}>{busy?'生成中…':'生成行程'}</button>
          <a className="btn secondary" href="/products">查看打包产品</a>
        </div>
      </div>

      {result && (
        <div className="card" style={{padding:16, marginTop:16}}>
          <div className="markdown" dangerouslySetInnerHTML={{__html: window.DOMPurify?.sanitize(window.marked?.parse(result)||result) || result}} />
        </div>
      )}
    </div>
  );
}
