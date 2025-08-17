import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function VerifyBanner(){
  const loc = useLocation();
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState('为确保账号安全，使用 AI 前请先验证邮箱。');

  // 触发条件：URL state.reason==='need-verify' 或 sessionStorage 标记
  useEffect(()=>{
    // 来自路由 state 的触发
    // @ts-ignore
    if (loc.state?.reason === 'need-verify') setShow(true);
    // 持久触发（例如登录被拦后设置的标记）
    if (sessionStorage.getItem('banner_verify') === '1') setShow(true);
  }, [loc]);

  if (!show) return null;
  return (
    <div className="rounded-xl border border-yellow-700 bg-yellow-700/15 text-yellow-200 p-3 flex items-center justify-between">
      <div className="text-sm">{msg}</div>
      <div className="flex items-center gap-3">
        <Link to="/verify" className="px-3 py-1 rounded-lg bg-yellow-700/30 border border-yellow-700 text-sm">去验证</Link>
        <button onClick={()=>{ setShow(false); sessionStorage.removeItem('banner_verify'); }} className="text-sm opacity-80 hover:opacity-100">关闭</button>
      </div>
    </div>
  );
}
