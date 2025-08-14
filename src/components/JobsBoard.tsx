'use client';
import { Download } from 'lucide-react';

type JobStatus = 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';

type Artifact = {
  id: string;
  filename: string;
  size: number;
  checksum: string;
};

type JobItem = {
  id: string;
  status: JobStatus;
  error?: string;
  artifacts?: Artifact[];
};

export default function JobsBoard({ items }: { items: JobItem[] }) {
  return (
    <div className="card rounded-3xl p-5">
      <h3 className="font-semibold mb-3">Jobs récents</h3>

      <div className="grid gap-3 min-w-0">
        {items.length === 0 && (
          <p className="text-sm text-white/60">Aucun job lancé pour l’instant.</p>
        )}

        {items.map((j) => (
          <div key={j.id} className="border border-white/10 rounded-2xl p-3 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm min-w-0">
                <div className="font-mono truncate">{j.id}</div>
                <div className="text-xs text-white/60">
                  Status: <b>{j.status}</b>
                </div>
              </div>
              <span
                className={`badge shrink-0 ${
                  j.status === 'SUCCEEDED'
                    ? 'border-green-500/40'
                    : j.status === 'FAILED'
                    ? 'border-red-500/40'
                    : ''
                }`}
              >
                {j.status === 'SUCCEEDED'
                  ? 'Terminé'
                  : j.status === 'RUNNING'
                  ? 'En cours'
                  : j.status === 'QUEUED'
                  ? 'En file'
                  : 'Échec'}
              </span>
            </div>

            {/* Error */}
            {j.error && (
              <pre className="mt-2 text-xs bg-red-900/30 border border-red-500/30 p-3 rounded overflow-x-auto">
                {j.error}
              </pre>
            )}

            {/* Artifacts */}
            {j.artifacts && j.artifacts.length > 0 && (
              <ul className="mt-2 grid gap-2 text-sm">
                {j.artifacts.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center gap-3 border border-white/10 rounded-xl px-3 py-2 min-w-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-white truncate">{a.filename}</div>
                      <div className="text-xs text-white/50">
                        {Math.round(a.size / 1024)} KB • sha256:{a.checksum.slice(0, 12)}…
                      </div>
                    </div>
                    <button className="btn-ghost flex-none">
                      <Download size={16} /> Télécharger
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
