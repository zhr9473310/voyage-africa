import Hero from "../components/Hero";
import DestinationMosaic from "../components/DestinationMosaic";
import useReveal from "../hooks/useReveal";

export default function Home(){
  const r1 = useReveal<HTMLDivElement>(), r2 = useReveal<HTMLDivElement>(), r3 = useReveal<HTMLDivElement>();
  return (
    <>
      <div className="container section"><Hero/></div>

      <div className="container section reveal" ref={r1}>
        <div className="kicker">Our Promise</div>
        <h2 className="h2">我们只是中介 · 让旅行回归简单</h2>
        <div className="grid3">
          {[
            {img:'/img/hero-savanna.jpg', title:'透明撮合', desc:'只撮合本地持牌商家；价格清晰，统一售后。'},
            {img:'/img/hero-coast2.jpg',  title:'一站代办', desc:'门票/预约/接驳按路线一次性代买，省心省时。'},
            {img:'/img/hero-dunes.jpg',   title:'AI 助理', desc:'用 AI 先生成可执行路线，再按需微调与下单。'},
          ].map(c=>(
            <div className="card" key={c.title}>
              <div className="img" style={{backgroundImage:`url(${c.img})`}}/>
              <div className="b">
                <div className="h3">{c.title}</div>
                <div className="muted">{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DestinationMosaic/>

      <div className="container section reveal" ref={r2}>
        <div className="marquee">
          <span>Desert · Savanna · Coast · Volcano · Rift Valley · Coral · Spice · Culture · Wildlife · Diving · City Break · Self-drive · Hot Air Balloon · </span>
          <span>Desert · Savanna · Coast · Volcano · Rift Valley · Coral · Spice · Culture · Wildlife · Diving · City Break · Self-drive · Hot Air Balloon · </span>
        </div>
      </div>

      <div className="container section reveal" ref={r3}>
        <div className="kicker">Get Started</div>
        <h2 className="h2">从一条草图开始 · AI 为你生成完整行程</h2>
        <div className="card" style={{padding:18,display:'flex',alignItems:'center',gap:16}}>
          <div className="badge">示例</div>
          <div className="muted" style={{flex:1}}>“7 天肯尼亚+坦桑尼亚，预算中等，想看动物迁徙和热气球”</div>
          <a href="/planner" className="btn">打开 AI 行程助手</a>
          <a href="/products" className="btn secondary">看看打包产品</a>
        </div>
      </div>
    </>
  );
}
