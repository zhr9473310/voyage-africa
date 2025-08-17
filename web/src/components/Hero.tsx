import { useEffect, useRef, useState } from 'react';
import savanna from '../assets/hero-savanna.jpg';
import dunes   from '../assets/hero-dunes.jpg';
import coast   from '../assets/hero-coast2.jpg';

const slides = [
  { img:savanna, title:'EXPLORE THE UNKNOWN',    sub:'探索未知世界 · 开启非凡之旅 · 从非洲出发' },
  { img:dunes,   title:'CHASE THE SUNSET',       sub:'撒哈拉星空与沙海 · 文化与自然的并置' },
  { img:coast,   title:'FOLLOW THE TRADE WINDS', sub:'东非香料海岸 · 珊瑚·风·浪与海豚' },
];

const DURATION_MS = 6000; // 6s 稳定自动切换

export default function Hero(){
  const [i,setI] = useState(0);
  const progress = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(()=>{
    const tick = ()=>{
      if (progress.current) progress.current.style.width='0%';
      const st = Date.now();
      timer.current && clearInterval(timer.current);
      timer.current = setInterval(()=>{
        const p = Math.min(1, (Date.now()-st)/DURATION_MS);
        if (progress.current) progress.current.style.width = `${p*100}%`;
        if (p >= 1){
          setI(v => (v+1) % slides.length);
          tick();
        }
      }, 50);
    };
    tick();
    return ()=>{ if (timer.current) clearInterval(timer.current); };
  },[]);

  return (
    <div className="hero-wrap">
      <div className="hero-slide">
        <img className="hero-bg" src={slides[i].img} alt="" />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-kicker">Odyssey Africa</span>
          <h1 className="hero-title">{slides[i].title}</h1>
          <p className="hero-sub">{slides[i].sub}</p>
          <div className="hero-ctas">
            <a className="btn" href="/planner">用 AI 生成路线</a>
            <a className="btn secondary" href="/destinations">看看目的地</a>
          </div>
        </div>
        <div className="hero-dots">
          {slides.map((_,idx)=><b key={idx} className={idx===i?'on':''} onClick={()=>setI(idx)} />)}
        </div>
        <div className="hero-progress"><i ref={progress}/></div>
      </div>
    </div>
  );
}
