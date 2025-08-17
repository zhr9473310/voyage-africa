import { useRef, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export default function Profile(){
  const { user, refresh, logout } = useAuth();
  const [tip,setTip]=useState<string>(''); const fileRef = useRef<HTMLInputElement>(null);

  if(!user) return <div className="p-6">未登录</div>;

  const upload = async () => {
    const f = fileRef.current?.files?.[0]; if(!f) return;
    const fd = new FormData(); fd.append('file', f);
    const r = await fetch('/api/auth/avatar', { method:'POST', body:fd, credentials:'include' });
    const j = await r.json(); if(!r.ok){ setTip(j.error||'上传失败'); return; }
    setTip('上传成功'); await refresh();
  };

  return <div className="max-w-lg mx-auto card p-6 space-y-4">
    <h1 className="text-2xl font-bold">个人中心</h1>
    <div className="flex items-center gap-4">
      <img src={user.avatar_url || '/favicon.svg'} className="w-16 h-16 rounded-full border border-[#2a3045]" />
      <div>
        <div className="font-semibold">{user.name || '(未设置昵称)'}</div>
        <div className="text-sm text-muted">{user.email}</div>
      </div>
    </div>
    <div className="space-y-2">
      <input ref={fileRef} type="file" accept="image/*" className="block w-full text-sm" />
      <button onClick={upload} className="px-4 py-2 rounded-lg bg-[#1c2233] border border-[#2a3045]">上传头像</button>
      {tip && <div className="text-sm text-muted">{tip}</div>}
    </div>
    <button onClick={logout} className="px-4 py-2 rounded-lg border border-[#2a3045]">退出登录</button>
  </div>
}
