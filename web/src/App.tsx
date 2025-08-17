import Planner from './pages/Planner';
import { BrowserRouter, Routes, Route, Link, Outlet, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import ChatModule from './modules/App';

function AppLayout(){
  return (
    <>
      <nav className="nav">
        <div className="container nav-inner">
          <Link to="/" className="logo" style={{fontWeight:900}}>Odyssey Africa</Link>
          <div>
            <Link to="/destinations">目的地</Link>
            <Link to="/planner">AI 行程助手</Link>
            <Link to="/products">旅行产品</Link>
            <Link to="/about">关于我们</Link>
            <Link to="/contact">联系</Link>
            <Link to="/login" className="btn" style={{marginLeft:10}}>登录 / 账号</Link>
          </div>
        </div>
      </nav>
      <Outlet/>
      <footer className="footer">
        <div className="container">© Odyssey Africa</div>
      </footer>
    </>
  );
}

/** 最简单的登录判断：依赖 /api/auth/me，失败不跳转 login/register */
async function checkAuth():Promise<boolean>{
  try{
    const r = await fetch('/api/auth/me', {credentials:'include'});
    return r.ok;
  }catch{return false;}
}
function RequireAuth({children}:{children:JSX.Element}){
  const loc = useLocation();
  // 仅在受保护页面触发；login/register 不会包到这里
  // 用一个“同步占位”的小 trick：先不给跳转，渲染后再决定
  // 为了简化，这里直接用 <Navigate> 的 replace=false，避免来回跳
  (async ()=>{ if(!(await checkAuth())) window.location.href='/login?next='+encodeURIComponent(loc.pathname+loc.search); })();
  return children;
}

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout/>}>
          <Route index element={<Home/>} />
          <Route path="login" element={<Login/>} />
          <Route path="register" element={<Register/>} />

          <Route path="account" element={<RequireAuth><Account/></RequireAuth>} />
          <Route path="chat" element={<RequireAuth><Planner/></RequireAuth>} />
          <Route path="planner" element={<RequireAuth><Planner/></RequireAuth>} />

          {/* 其他简单占位页（防止 404 又被重定向） */}
          <Route path="destinations" element={<div className="container section"><h2 className="h2">目的地</h2></div>} />
          <Route path="products" element={<div className="container section"><h2 className="h2">旅行产品</h2></div>} />
          <Route path="about" element={<div className="container section"><h2 className="h2">关于我们</h2></div>} />
          <Route path="contact" element={<div className="container section"><h2 className="h2">联系</h2></div>} />

          <Route path="*" element={<div className="container section"><h2 className="h2">未找到页面</h2><Link to="/">回到首页</Link></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
