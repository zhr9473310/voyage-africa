import { BRAND } from '../brand';
export default function Brand(){
  return (
    <a href="/" style={{display:'flex',alignItems:'center',gap:10}}>
      <img src="/favicon.svg" alt="logo" width={28} height={28}/>
      <span style={{fontWeight:800}}>{BRAND.short}</span>
    </a>
  );
}
