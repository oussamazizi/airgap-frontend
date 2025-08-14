'use client';
import AutocompleteRow from '@/components/AutocompleteRow';
import { searchApt, searchNpm, searchPip, versionsApt, versionsNpm, versionsPip } from '@/lib/api';

type Row = { name: string; version?: string };

export default function HostForm({
  distroImage, setDistroImage,
  npmRows, setNpmRows,
  pipRows, setPipRows,
  aptRows, setAptRows,
}: {
  distroImage: string; setDistroImage:(v:string)=>void;
  npmRows: Row[]; setNpmRows:(r:Row[])=>void;
  pipRows: Row[]; setPipRows:(r:Row[])=>void;
  aptRows: Row[]; setAptRows:(r:Row[])=>void;
}){
  return (
    <div className="grid gap-6">
      <div>
        <label className="text-sm text-white/70">Distro (APT)</label>
        <input
          value={distroImage}
          onChange={(e)=>setDistroImage(e.target.value)}
          placeholder="ubuntu:22.04"
          className="input mt-1"
        />
        <p className="text-xs text-white/50 mt-1">
          Doit correspondre à l'OS client si tu utilises APT.
        </p>
      </div>

      {/* NPM */}
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">npm</h3>
          <button onClick={()=>setNpmRows([...npmRows, { name:'', version:'' }])} className="btn-ghost">+ Ajouter</button>
        </div>
        {npmRows.map((row, i)=>(
          <AutocompleteRow
            key={`npm-${i}`}
            value={row}
            onChange={(v)=>{ const copy=[...npmRows]; copy[i]=v; setNpmRows(copy); }}
            placeholderName="npm package"
            placeholderVersion="version (optionnelle)"
            fetchNames={(q)=>searchNpm(q)}
            fetchVersions={(name)=>versionsNpm(name)}
            requireVersion
          />
        ))}
      </div>

      {/* PIP */}
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">pip</h3>
          <button onClick={()=>setPipRows([...pipRows, { name:'', version:'' }])} className="btn-ghost">+ Ajouter</button>
        </div>
        {pipRows.map((row, i)=>(
          <AutocompleteRow
            key={`pip-${i}`}
            value={row}
            onChange={(v)=>{ const copy=[...pipRows]; copy[i]=v; setPipRows(copy); }}
            placeholderName="pip package"
            placeholderVersion="version (optionnelle)"
            fetchNames={(q)=>searchPip(q)}
            fetchVersions={(name)=>versionsPip(name)}
          />
        ))}
      </div>

      {/* APT */}
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">apt</h3>
          <button onClick={()=>setAptRows([...aptRows, { name:'', version:'' }])} className="btn-ghost">+ Ajouter</button>
        </div>
        {aptRows.map((row, i)=>(
          <AutocompleteRow
            key={`apt-${i}`}
            value={row}
            onChange={(v)=>{ const copy=[...aptRows]; copy[i]=v; setAptRows(copy); }}
            placeholderName="apt package"
            placeholderVersion="version (optionnelle)"
            fetchNames={(q)=>searchApt(q, distroImage)}
            fetchVersions={(name)=>versionsApt(name, distroImage)}
          />
        ))}
      </div>
    </div>
  );
}
