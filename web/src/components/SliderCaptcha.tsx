import { useEffect, useState } from 'react';

export default function SliderCaptcha({ onSolved }:{ onSolved:(v:{id:string,value:number})=>void }){
  const [id,setId]=useState(''); const [bg,setBg]=useState<string>(''); const [notch,setNotch]=useState(50);
  const [val,setVal]=useState(0); const [ok,setOk]=useState(false);

  const load = async () => {
    try{
      const r = await fetch('/api/auth/slider/new',{credentials:'include'});
      const j = await r.json();
      setId(j.id); setBg(j.bg || ''); setNotch(j.notchX); setVal(0); setOk(false);
    }catch{ setId(''); setBg(''); setVal(0); setOk(false); }
  };
  useEffect(()=>{ load() },[]);

  const onRelease = () => {
    if (!id) return;
    onSolved({ id, value: val });
    if (Math.abs(val - notch) <= 3) setOk(true); else setOk(false);
  };

  return (
    <div className="space-y-2">
      <div className="relative w-[300px] h-[160px] rounded-xl overflow-hidden border border-[#2a3045]">
        {/* 本地渐变兜底背景 */}
        <div className="absolute inset-0"
             style={{background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f172a 100%)'}}/>
        {/* 外链背景（加载失败则隐藏） */}
        {bg && <img src={bg} onError={()=>setBg('')} className="absolute inset-0 w-full h-full object-cover opacity-70 pointer-events-none" />}
        {/* notch 可视化（对齐条） */}
        <div className="absolute top-0 bottom-0" style={{left:`calc(${notch}% - 14px)`}}>
          <div className="w-7 h-full bg-white/10 border-x border-white/25 backdrop-blur-sm"></div>
        </div>
        {/* 可移动小块 */}
        <div className="absolute top-1/3 w-10 h-16 bg-white/80 rounded-md border border-white shadow-md"
             style={{ left:`calc(${val}% - 20px)` }}></div>
      </div>
      <input type="range" min={0} max={100} value={val}
             onChange={e=>setVal(Number(e.target.value))}
             onMouseUp={onRelease} onTouchEnd={onRelease}
             className="w-[300px]"/>
      <div className="text-sm">{ok ? '✅ 验证通过' : '请拖动滑块，使小块与缺口对齐'}</div>
      <button type="button" onClick={load} className="text-xs text-muted underline">换一题</button>
    </div>
  );
}
