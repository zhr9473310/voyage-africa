import useReveal from "../hooks/useReveal";

export default function DestinationMosaic(){
  const r1 = useReveal<HTMLDivElement>(), r2 = useReveal<HTMLDivElement>();
  return (
    <>
      <div className="section container">
        <div className="kicker">Inspiration</div>
        <h2 className="h2">灵感马赛克 · 自由选择你的非洲坐标</h2>
        <div className="mosaic reveal" ref={r1}>
          <div className="tile clip-1"><img src="/img/mosaic-1.jpg"/><span className="label">草原 · 迁徙</span></div>
          <div className="tile"><img src="/img/mosaic-2.jpg"/><span className="label">珊瑚 · 海风</span></div>
          <div className="tile clip-2"><img src="/img/mosaic-3.jpg"/><span className="label">沙海 · 星空</span></div>
          <div className="tile"><img src="/img/hero-dunes.jpg"/><span className="label">撒哈拉</span></div>
          <div className="tile"><img src="/img/hero-savanna.jpg"/><span className="label">塞伦盖蒂</span></div>
          <div className="tile"><img src="/img/hero-coast2.jpg"/><span className="label">桑给巴尔</span></div>
        </div>
      </div>

      <div className="section container reveal" ref={r2}>
        <div className="stats">
          {[
            {n:'+12', t:'深耕国家/地区'},
            {n:'100+', t:'本地持牌合作商'},
            {n:'15k+', t:'代买门票/预约'},
            {n:'24h', t:'中介售后应答'}
          ].map(x=>(
            <div className="stat" key={x.t}>
              <div className="n">{x.n}</div>
              <div className="muted">{x.t}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
