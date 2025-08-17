import dunes from '../assets/hero-dunes.jpg';

export default function GreenBookIntro(){
  return (
    <section className="container section">
      <h2 className="h2 text-center">GREEN BOOK</h2>
      <div className="mt-8 flex flex-col md:flex-row items-center gap-8">
        <img src={dunes} alt="Green Book" className="rounded-xl w-full md:w-1/2"/>
        <div className="prose max-w-prose">
          <h3 className="h3">绿旅指南</h3>
          <p>探索未知的旅程，体验非洲的独特魅力。我们精选本地风情与自然奇观，为你呈现最真实的非洲。</p>
        </div>
      </div>
    </section>
  );
}

