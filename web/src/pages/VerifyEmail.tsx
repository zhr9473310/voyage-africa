import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CaptchaImage from '../components/CaptchaImage';

export default function VerifyEmail(){
  const loc = useLocation() as any; const nav = useNavigate();
  const [email,setEmail]=useState(''); const [code,setCode]=useState('');
  const [sent,setSent]=useState(false); const [msg,setMsg]=useState<string>('');
  const [capSend,setCapSend]=useState<{id:string|null,answer:string}>({id:null,answer:''});
  const [capVerify,setCapVerify]=useState<{id:string|null,answer:string}>({id:null,answer:''});

  useEffect(()=>{ if(loc.state?.email) setEmail(loc.state.email) },[loc.state]);

  const send = async () => {
    setMsg(''); const r = await fetch('/api/auth/send-code',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({email,purpose:'verify', captchaId:capSend.id, captchaAnswer:capSend.answer})});
    const j = await r.json(); if(!r.ok) setMsg(j.error||'发送失败'); else setSent(true);
  };
  const verify = async () => {
    setMsg(''); const r = await fetch('/api/auth/verify-email',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({email,code, captchaId:capVerify.id, captchaAnswer:capVerify.answer})});
    const j = await r.json(); if(!r.ok) setMsg(j.error||'验证失败'); else { setMsg('验证成功，请使用该邮箱登录'); sessionStorage.removeItem('banner_verify'); setTimeout(()=>nav('/login',{replace:true}),900) }
  };

  return <div className="max-w-md mx-auto card p-6 space-y-4">
    <h1 className="text-2xl font-bold">验证邮箱</h1>
    <input className="w-full bg-[#111523] border border-[#2a3045] rounded-lg p-3" placeholder="邮箱" value={email} onChange={e=>setEmail(e.target.value)}/>
    {!sent
      ? <>
          <CaptchaImage purpose="send-code" onChange={setCapSend}/>
          <button onClick={send} className="w-full bg-[#1c2233] border border-[#2a3045] rounded-lg p-3">发送验证码</button>
        </>
      : <>
          <input className="w-full bg-[#111523] border border-[#2a3045] rounded-lg p-3" placeholder="验证码" value={code} onChange={e=>setCode(e.target.value)}/>
          <CaptchaImage purpose="verify" onChange={setCapVerify}/>
          <button onClick={verify} className="w-full bg-[#1c2233] border border-[#2a3045] rounded-lg p-3">提交验证</button>
        </>
    }
    {msg && <div className="text-sm text-muted">{msg}</div>}
  </div>
}
