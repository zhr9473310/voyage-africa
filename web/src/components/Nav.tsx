import Brand from './Brand';
export default function Nav(){
  return (
    <div className="nav">
      <div className="container nav-inner">
        <Brand/>
        <nav>
          <a href="/destinations">目的地</a>
          <a href="/planner">AI 行程助手</a>
          <a href="/products">旅行产品</a>
          <a href="/about">关于我们</a>
          <a href="/contact">联系</a>
          <a href="/account" className="btn" style={{marginLeft:10}}>登录 / 账号</a>
        </nav>
      </div>
    </div>
  );
}
