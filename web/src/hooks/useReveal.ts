import { useEffect, useRef } from 'react';
export default function useReveal<T extends HTMLElement>(){
  const ref = useRef<T|null>(null);
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    const io = new IntersectionObserver(([e])=>{
      if(e.isIntersecting){ el.classList.add('in'); io.disconnect(); }
    },{threshold:.2});
    io.observe(el);
    return ()=>io.disconnect();
  },[]);
  return ref;
}
