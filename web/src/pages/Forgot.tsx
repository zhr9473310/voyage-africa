import { useState } from 'react';
import CaptchaImage from '../components/CaptchaImage';

export default function Forgot(){
  const [email,setEmail]=useState(''); const [msg,setMsg]=useState<string>(''); const [cap,setCap]=useState<{id:string|null,answer:string}>({id:null,answer:''});
  const send = async () => {
    setMsg(''); const r = await fetch('/api/auth/forgot',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});
    setMsg('如果邮箱存在，我们已发送验证码，请查收。');
  };
  return <div className="max-w-md mx-auto card p-6 space-y-4">
    <h1 className="text-2xl font-bold">找回密码</h1>
    <input className="w-full bg-[#111523] border border-[#2a3045] rounded-lg p-3" placeholder="注册邮箱" value={email} onChange={e=>setEmail(e.target.value)}/>
    {/* 发码走 /send-code（含验证码），这里做友好引导 */}
    <div className="text-sm text-muted">下一步将在验证页输入验证码进行重置。</div>
    <CaptchaImage purpose="send-code" onChange={setCap}/>
    <button onClick={async()=>{ 
      const r=await fetch('/api/auth/send-code',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,purpose:'reset', captchaId:cap.id, captchaAnswer:cap.answer})});
      const j=await r.json(); setMsg(j.ok?'验证码已发送，请查收邮箱。':(j.error||'发送失败'));
    }} className="w-full bg-[#1c2233] border border-[#2a3045] rounded-lg p-3">发送验证码</button>
    {msg && <div className="text-sm text-muted">{msg}</div>}
  </div>
}
