import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Login(){
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const next = sp.get('next') || '/account';

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [captcha,setCaptcha] = useState('');
  const [captchaId,setCaptchaId] = useState('');
  const [captchaSVG,setCaptchaSVG] = useState('');
  const [msg,setMsg] = useState('');

  async function loadCaptcha(){
    try{
      const r = await fetch('/api/auth/captcha?purpose=login', {credentials:'include'});
      const j = await r.json();
      setCaptchaId(j.id || '');
      setCaptchaSVG(j.svg || '');
    }catch{
      setCaptchaId(''); setCaptchaSVG('');
    }
  }

  useEffect(()=>{ loadCaptcha(); },[]);

  async function onSubmit(e:React.FormEvent){
    e.preventDefault();
    setMsg('');
    try{
      const r = await fetch('/api/auth/login',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        credentials:'include',
        body: JSON.stringify({ email, password, captcha: (captcha||'').trim().toLowerCase(), captchaId })
      });
      const j = await r.json();
      if(!r.ok){ setMsg(j?.error || '登录失败'); await loadCaptcha(); return; }
      nav(next, { replace:true });
    }catch(err:any){
      setMsg(err?.message || '网络错误');
    }
  }

  return (
    <div className="container" style={{maxWidth:520, margin:'40px auto'}}>
      <h2 className="h2">登录</h2>
      <form className="card" style={{padding:16, display:'grid', gap:12}} onSubmit={onSubmit}>
        <input className="input" placeholder="邮箱" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="密码" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div style={{display:'grid', gridTemplateColumns:'1fr auto', gap:10, alignItems:'center'}}>
          <div dangerouslySetInnerHTML={{__html: captchaSVG}} />
          <button type="button" className="btn secondary" onClick={loadCaptcha}>换一张</button>
        </div>
        <input className="input" placeholder="输入图片验证码" value={captcha} onChange={e=>setCaptcha(e.target.value)} />
        <button className="btn" type="submit">登录</button>
        {msg && <div className="muted">{msg}</div>}
      </form>
    </div>
  );
}
