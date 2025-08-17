export default function Destinations(){
  const list = [
    {country:'摩洛哥', tags:['蓝色小镇','撒哈拉','集市'], note:'舍夫沙万、梅尔祖卡、马拉喀什'},
    {country:'埃及',   tags:['金字塔','尼罗河','潜水'], note:'吉萨、卢克索、赫尔格达'},
    {country:'肯尼亚', tags:['大迁徙','热气球','马赛文化'], note:'马赛马拉、奈瓦沙湖'},
    {country:'坦桑尼亚', tags:['火山口','桑给巴尔','潜水'], note:'塞伦盖蒂、恩戈罗火山口'},
    {country:'纳米比亚', tags:['沙丘','星空','自驾'], note:'苏丝斯黎、沿海骷髅海岸'},
    {country:'南非', tags:['城市+自然','葡萄酒','海岸线'], note:'开普敦、桌山、好望角'}
  ];
  return (
    <div className="container section">
      <div className="kicker">Explore</div>
      <h2 className="h2">目的地灵感库（持续扩充）</h2>
      <div className="grid c3">
        {list.map((d,i)=>(
          <div className="card" key={i}>
            <img src={['/img/hero-coast.jpg','/img/hero-dunes.jpg','/img/hero-savanna.jpg'][i%3]} alt={d.country}/>
            <div className="p">
              <div className="h3">{d.country}</div>
              <div className="muted" style={{margin:'6px 0'}}>{d.note}</div>
              <div>{d.tags.map(t=><span key={t} className="badge" style={{marginRight:6}}>{t}</span>)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
