import { useEffect, useState } from 'react';

type Props = {
  purpose: 'login'|'verify'|'reset'|'send-code';
  onChange: (v: { id: string|null, answer: string }) => void;
};
export default function CaptchaImage({ purpose, onChange }: Props){
  const [id,setId]=useState<string|null>(null);
  const [svg,setSvg]=useState<string>('');
  const [ans,setAns]=useState('');
  const load=async()=>{
    const r=await fetch('/api/auth/captcha?purpose='+purpose,{credentials:'include'});
    const j=await r.json(); setId(j.id); setSvg(j.svg); setAns(''); onChange({id:j.id,answer:''});
  };
  useEffect(()=>{ load() },[purpose]);
  useEffect(()=>{ onChange({id,answer:ans}) },[id,ans]);
  return (
    <div className="flex items-center gap-2">
      <div className="bg-white border border-[#2a3045] rounded-lg overflow-hidden px-2 py-1 shadow-sm"
           style={{width:150,height:54}}
           dangerouslySetInnerHTML={{__html:svg}} />
      <input value={ans} onChange={e=>setAns(e.target.value)} placeholder="验证码"
             className="w-28 bg-[#111523] border border-[#2a3045] rounded-lg p-2"/>
      <button type="button" onClick={load} className="px-2 py-1 text-sm border border-[#2a3045] rounded-lg">换一张</button>
    </div>
  );
}
