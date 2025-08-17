import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import VerifyBanner from './components/VerifyBanner';

const Nav = () => {
  const { user, logout } = useAuth();
  const [open,setOpen]=useState(false); const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{ const h=(e:MouseEvent)=>{ if(!ref.current?.contains(e.target as Node)) setOpen(false)}; document.addEventListener('click',h); return ()=>document.removeEventListener('click',h)},[])
  return (
    <header className="sticky top-2 z-10 flex items-center justify-between p-3 bg-[#0e111a] border border-[#2a3045] rounded-2xl shadow-soft">
      <Link to="/" className="flex items-center gap-2 font-extrabold text-xl">
        <img src="/favicon.svg" alt="绿皮书" className="w-7 h-7 rounded-lg" />
        <span>绿皮书</span>
      </Link>
      <nav className="flex gap-4 items-center text-sm">
        <NavLink to="/" end className="hover:underline">首页</NavLink>
        <NavLink to="/chat" className="px-3 py-1 bg-[#1c2233] border border-[#2a3045] rounded-xl">AI 助手</NavLink>
        {!user ? (
          <>
            <NavLink to="/login" className="hover:underline">登录</NavLink>
            <NavLink to="/register" className="hover:underline">注册</NavLink>
          </>
        ) : (
          <>
            {!user.email_verified && <NavLink to="/verify" className="px-2 py-1 rounded bg-yellow-600/30 border border-yellow-700">未验证</NavLink>}
            <div className="relative" ref={ref}>
              <button onClick={()=>setOpen(v=>!v)} className="flex items-center gap-2">
                <img src={user.avatar_url || '/favicon.svg'} className="w-8 h-8 rounded-full border border-[#2a3045]" />
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-[#0e111a] border border-[#2a3045] rounded-xl p-2 shadow-soft">
                  <Link to="/profile" className="block px-3 py-2 hover:bg-[#1c2233] rounded-lg">个人中心</Link>
                  <button onClick={logout} className="w-full text-left px-3 py-2 hover:bg-[#1c2233] rounded-lg">退出登录</button>
                </div>
              )}
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

const Footer = () => (
  <footer className="mt-6 p-4 md:p-6 text-muted">
    <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
      <div className="text-sm">Copyright © {new Date().getFullYear()} 绿皮书</div>
    </div>
  </footer>
);

export default function AppLayout() {
  return (
    <div className="max-w-[1200px] mx-auto flex flex-col min-h-[100dvh] p-3 gap-3">
      <Nav />
      <VerifyBanner />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}
