import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptchaImage from '../components/CaptchaImage';

export default function Reset(){
  const [email,setEmail]=useState(''); const [code,setCode]=useState(''); const [pwd,setPwd]=useState('');
  const [msg,setMsg]=useState<string>(''); const [cap,setCap]=useState<{id:string|null,answer:string}>({id:null,answer:''});
  const nav=useNavigate();
  const submit = async () => {
    setMsg(''); const r = await fetch('/api/auth/reset',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({email,code,new_password:pwd, captchaId:cap.id, captchaAnswer:cap.answer})});
    const j = await r.json(); if(!r.ok) setMsg(j.error||'重置失败'); else { setMsg('重置成功，跳转登录…'); setTimeout(()=>nav('/login'),800) }
  };
  return <div className="max-w-md mx-auto card p-6 space-y-4">
    <h1 className="text-2xl font-bold">重置密码</h1>
    <input className="w-full bg-[#111523] border border-[#2a3045] rounded-lg p-3" placeholder="注册邮箱" value={email} onChange={e=>setEmail(e.target.value)}/>
    <input className="w-full bg-[#111523] border border-[#2a3045] rounded-lg p-3" placeholder="验证码" value={code} onChange={e=>setCode(e.target.value)}/>
    <input className="w-full bg-[#111523] border border-[#2a3045] rounded-lg p-3" placeholder="新密码（≥6位）" type="password" value={pwd} onChange={e=>setPwd(e.target.value)}/>
    <CaptchaImage purpose="reset" onChange={setCap}/>
    <button onClick={submit} className="w-full bg-[#1c2233] border border-[#2a3045] rounded-lg p-3">提交</button>
    {msg && <div className="text-sm text-muted">{msg}</div>}
  </div>
}
