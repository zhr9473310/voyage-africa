const cards = [
  { img:'/img/hero-savanna.jpg', title:'野生动物探险', desc:'追随迁徙之路，感受草原脉动。' },
  { img:'/img/hero-coast2.jpg', title:'海岸线之旅', desc:'湛蓝海水与白沙滩的浪漫邂逅。' },
  { img:'/img/hero-dunes.jpg', title:'沙漠星空营地', desc:'在沙海与星光下，寻觅静谧。' },
];

export default function GreenBookGrid(){
  return (
    <section className="container section">
      <h2 className="h2 text-center">GREENBOOK</h2>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map(c => (
          <div key={c.title} className="rounded-xl overflow-hidden bg-red-600 text-white flex flex-col">
            <img src={c.img} alt={c.title} className="h-40 w-full object-cover"/>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-lg font-semibold mb-2">{c.title}</h3>
              <p className="text-sm flex-1">{c.desc}</p>
              <a href="#" className="btn secondary mt-4 self-start">立即预订</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

