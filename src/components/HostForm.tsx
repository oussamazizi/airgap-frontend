'use client';

function Row({i, rows, setRows, requireVersion}:{ i:number; rows:any[]; setRows:(r:any[])=>void; requireVersion?:boolean }){
  function update(key:'name'|'version', val:string){ const copy=[...rows]; copy[i][key]=val; setRows(copy); }
  function remove(){ setRows(rows.filter((_,idx)=>idx!==i)); }
  return (
    <div className="grid grid-cols-12 gap-2">
      <input value={rows[i].name} onChange={(e)=>update('name', e.target.value)} placeholder="package" className="input col-span-7"/>
      <input value={rows[i].version||''} onChange={(e)=>update('version', e.target.value)} placeholder={requireVersion?"version":"version (optionnel)"} className="input col-span-4"/>
      <button onClick={remove} className="btn-ghost col-span-1">✕</button>
    </div>
  );
}

export default function HostForm({ distroImage, setDistroImage, npmRows, setNpmRows, pipRows, setPipRows, aptRows, setAptRows }:{
  distroImage: string; setDistroImage:(v:string)=>void;
  npmRows: any[]; setNpmRows:(r:any[])=>void;
  pipRows: any[]; setPipRows:(r:any[])=>void;
  aptRows: any[]; setAptRows:(r:any[])=>void;
}){
  return (
    <div className="grid gap-6">
      <div>
        <label className="text-sm text-white/70">Distro (APT)</label>
        <input value={distroImage} onChange={(e)=>setDistroImage(e.target.value)} placeholder="ubuntu:22.04" className="input mt-1"/>
        <p className="text-xs text-white/50 mt-1">Doit correspondre à l'OS client si tu utilises APT.</p>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">npm</h3>
          <button onClick={()=>setNpmRows([...npmRows, {name:'', version:''}])} className="btn-ghost">+ Ajouter</button>
        </div>
        {npmRows.map((_,i)=>(<Row key={i} i={i} rows={npmRows} setRows={setNpmRows} requireVersion/>))}
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">pip</h3>
          <button onClick={()=>setPipRows([...pipRows, {name:'', version:''}])} className="btn-ghost">+ Ajouter</button>
        </div>
        {pipRows.map((_,i)=>(<Row key={i} i={i} rows={pipRows} setRows={setPipRows}/>))}
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">apt</h3>
          <button onClick={()=>setAptRows([...aptRows, {name:'', version:''}])} className="btn-ghost">+ Ajouter</button>
        </div>
        {aptRows.map((_,i)=>(<Row key={i} i={i} rows={aptRows} setRows={setAptRows}/>))}
        <p className="text-xs text-white/50">Version **optionnelle** pour APT. Si vide, on prendra la version présente sur la distro choisie.</p>
      </div>
    </div>
  );
}