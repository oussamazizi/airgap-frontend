'use client';
import { AlertTriangle, CheckCircle2, Clock3 } from 'lucide-react';

export default function StatusCard({ jobId, status, error }:{ jobId?: string; status?: 'QUEUED'|'RUNNING'|'SUCCEEDED'|'FAILED'; error?: string }){
  return (
    <div className="card rounded-3xl p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Statut</h3>
        {status==='SUCCEEDED' && <span className="badge">Terminé</span>}
        {status==='RUNNING' && <span className="badge">En cours</span>}
        {status==='QUEUED' && <span className="badge">En file</span>}
        {status==='FAILED' && <span className="badge">Échec</span>}
      </div>
      <p className="text-sm text-white/70">Job ID: <code className="text-white">{jobId ?? '-'}</code></p>
      <p className="text-sm">Status: <b>{status ?? '-'}</b></p>
      {error && <pre className="mt-3 text-xs bg-red-900/30 border border-red-500/30 p-3 rounded">{error}</pre>}
    </div>
  );
}