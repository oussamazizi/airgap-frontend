'use client';
import { Download } from 'lucide-react';

export default function ArtifactsList({ items }:{ items: { id:string; filename:string; size:number; checksum:string }[] }){
  return (
    <div className="card rounded-3xl p-5">
      <h3 className="font-semibold mb-2">Artefacts</h3>
      {(!items || items.length===0) && <p className="text-sm text-white/60">Aucun artefact pour l'instant.</p>}
      <ul className="text-sm grid gap-2">
        {items?.map(a => (
          <li key={a.id} className="flex items-center justify-between border border-white/10 rounded-xl px-3 py-2">
            <div>
              <div className="font-mono text-white">{a.filename}</div>
              <div className="text-xs text-white/50">{Math.round(a.size/1024)} KB • sha256:{a.checksum.slice(0,12)}…</div>
            </div>
            {/* Endpoint download à ajouter côté backend plus tard */}
            <button className="btn-ghost"><Download size={16}/> Télécharger</button>
          </li>
        ))}
      </ul>
      <p className="text-xs text-white/40 mt-2">Le .zip est disponible dans <code>storage/&lt;ID&gt;.zip</code> côté serveur.</p>
    </div>
  );
}