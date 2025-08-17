export default function Products(){
  const packs = [
    {name:'东非大草原迁徙 7天', points:['马赛马拉+塞伦盖蒂','热气球+越野车','含公园门票代买'], price:'面议'},
    {name:'摩洛哥沙海星空 6天', points:['马拉喀什+梅尔祖卡','撒哈拉营地','骆驼徒步+越野车'], price:'面议'},
    {name:'纳米比亚越野星轨 8天', points:['苏丝斯黎沙丘','骷髅海岸','Dune 自驾'], price:'面议'}
  ];
  return (
    <div className="container section">
      <div className="kicker">Packages</div>
      <h2 className="h2">打包旅行产品（中介撮合）</h2>
      <div className="grid c3">
        {packs.map(p=>(
          <div className="card" key={p.name}>
            <div className="p">
              <div className="h3">{p.name}</div>
              <ul>{p.points.map(x=><li key={x} style={{margin:'6px 0'}}>{x}</li>)}</ul>
              <div className="muted">价格：{p.price} · 供应由当地持牌合作商提供</div>
              <a className="btn" href="/contact" style={{marginTop:10}}>咨询与下单</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
