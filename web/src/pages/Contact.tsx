import { BRAND } from '../brand';
export default function Contact(){
  return (
    <div className="container section">
      <div className="kicker">Contact</div>
      <h2 className="h2">联系我们</h2>
      <div className="card" style={{padding:16}}>
        <div className="h3">邮箱</div>
        <p><a href={"mailto:"+BRAND.contacts.email}>{BRAND.contacts.email}</a></p>
        <div className="h3">微信</div>
        <p>{BRAND.contacts.wechat}</p>
        <div className="muted">工作日 10:00–18:00（UTC+2 / 南非时间）</div>
      </div>
    </div>
  );
}
