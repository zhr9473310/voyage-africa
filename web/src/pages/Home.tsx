import Hero from "../components/Hero";
import GreenBookIntro from "../components/GreenBookIntro";
import GreenBookGrid from "../components/GreenBookGrid";

export default function Home(){
  return (
    <>
      <Hero/>
      <GreenBookIntro/>
      <GreenBookGrid/>
      <section className="container section text-center">
        <h2 className="h2">OUR DESTINATIONS</h2>
      </section>
    </>
  );
}

