export default function Account(){
  return (
    <div className="container section">
      <div className="kicker">Account</div>
      <h2 className="h2">账号中心</h2>
      <p>已登录用户可直接使用「AI 行程助手」。若未登录，将在访问时跳转登录页。</p>
      <div style={{marginTop:10,display:'flex',gap:10}}>
        <a className="btn" href="/login">登录</a>
        <a className="btn secondary" href="/register">注册</a>
      </div>
    </div>
  );
}
