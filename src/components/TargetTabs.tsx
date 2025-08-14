'use client';

export default function TargetTabs({ target, setTarget }:{ target: 'docker'|'host'; setTarget: (t:'docker'|'host')=>void }){
  return (
    <div className="inline-flex rounded-2xl border border-white/10 p-1 mb-4">
      <button onClick={()=>setTarget('docker')} className={`px-3 py-1.5 rounded-xl ${target==='docker'?'bg-white text-black':'text-white/80 hover:bg-white/5'}`}>Docker</button>
      <button onClick={()=>setTarget('host')} className={`px-3 py-1.5 rounded-xl ${target==='host'?'bg-white text-black':'text-white/80 hover:bg-white/5'}`}>Host (sans Docker)</button>
    </div>
  );
}