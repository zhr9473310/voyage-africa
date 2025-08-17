import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SliderCaptcha from '../components/SliderCaptcha';

export default function Register(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [name,setName]=useState('');
  const [state,setState]=useState<'idle'|'loading'|'success'|'error'>('idle'); const [msg,setMsg]=useState<string>('');
  const [slider,setSlider]=useState<{id:string,value:number}|null>(null);
  const nav=useNavigate();

  const submit=async()=>{ setState('loading'); setMsg('');
    try{
      if(!slider) throw new Error('请先完成滑块验证');
      const r = await fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({ email, password, name, sliderId: slider.id, sliderValue: slider.value })});
      const j = await r.json(); if(!r.ok) throw new Error(j.error||'注册失败');
      sessionStorage.setItem('banner_verify','1');
      setState('success'); setMsg('注册成功！已向你的邮箱发送验证码，请完成验证后再登录。');
      setTimeout(()=>nav('/verify', { state:{ email, reason:'need-verify' } }), 900);
    }catch(e:any){ setMsg(e.message||'注册失败'); setState('error') }
  }

  return <div className="max-w-md mx-auto card p-6 space-y-4">
    <h1 className="text-2xl font-bold">邮箱注册</h1>
    <input className="w-full bg-[#111523] border border-[#2a3045] rounded-lg p-3" placeholder="昵称（可选）" value={name} onChange={e=>setName(e.target.value)}/>
    <input className="w-full bg-[#111523] border border-[#2a3045] rounded-lg p-3" placeholder="邮箱" value={email} onChange={e=>setEmail(e.target.value)}/>
    <input className="w-full bg-[#111523] border border-[#2a3045] rounded-lg p-3" placeholder="密码（≥6位）" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
    <div className="mt-2"><SliderCaptcha onSolved={setSlider}/></div>
    {state==='idle' && <button onClick={submit} className="w-full bg-[#1c2233] border border-[#2a3045] rounded-lg p-3">注册</button>}
    {state==='loading' && <button disabled className="w-full bg-[#1c2233] border border-[#2a3045] rounded-lg p-3">注册中…</button>}
    {state==='success' && <div className="text-green-400 text-sm">{msg}</div>}
    {state==='error' && <div className="text-red-400 text-sm">注册失败：{msg}</div>}
    <div className="text-sm text-muted">已有账号？<Link to="/login" className="underline">去登录</Link></div>
  </div>
}
