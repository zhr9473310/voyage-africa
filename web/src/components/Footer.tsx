import { BRAND } from '../brand';
export default function Footer(){
  return (
    <footer className="footer">
      <div className="container" style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div>
          <div style={{fontWeight:800}}>{BRAND.name}</div>
          <div className="muted" style={{marginTop:6}}>{BRAND.tagline}</div>
        </div>
        <div className="muted">
          <div>邮箱：{BRAND.contacts.email}</div>
          <div>微信：{BRAND.contacts.wechat}</div>
          <div style={{marginTop:6}}>仅提供中介服务，不直接提供任何实体旅行服务。</div>
        </div>
      </div>
    </footer>
  );
}
