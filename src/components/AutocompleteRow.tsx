'use client';
import { useEffect, useRef, useState } from 'react';

type Fetcher = (q: string) => Promise<string[]>;
type VersionsFetcher = (name: string) => Promise<string[]>;

export default function AutocompleteRow({
  value,
  onChange,
  placeholderName = 'package',
  placeholderVersion = 'version (optionnelle)',
  fetchNames,
  fetchVersions,
  requireVersion = false,
}: {
  value: { name: string; version?: string };
  onChange: (v: { name: string; version?: string }) => void;
  placeholderName?: string;
  placeholderVersion?: string;
  fetchNames: Fetcher;
  fetchVersions: VersionsFetcher;
  requireVersion?: boolean;
}) {
  const [q, setQ] = useState(value.name || '');
  const [nameOpen, setNameOpen] = useState(false);
  const [nameItems, setNameItems] = useState<string[]>([]);
  const [nameIdx, setNameIdx] = useState(-1);

  const [verOpen, setVerOpen] = useState(false);
  const [verItems, setVerItems] = useState<string[]>([]);
  const [verIdx, setVerIdx] = useState(-1);

  const nameRef = useRef<HTMLInputElement>(null);
  const verRef = useRef<HTMLInputElement>(null);
  const timer = useRef<any>(null);
  const suppressNextFetch = useRef(false);

  const isNameFocused = () => document.activeElement === nameRef.current;
  const isVerFocused  = () => document.activeElement === verRef.current;

  // sync externe
  useEffect(() => { setQ(value.name || ''); }, [value.name]);

  // debounce recherche noms
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!q?.trim()) {
      setNameItems([]); setNameOpen(false); return;
    }
    timer.current = setTimeout(async () => {
      if (suppressNextFetch.current) { suppressNextFetch.current = false; return; }
      try {
        const list = await fetchNames(q.trim());
        setNameItems(list.slice(0, 20));
        setNameIdx(-1);
        setNameOpen(isNameFocused() && list.length > 0); // n’ouvre que si l’input a le focus
      } catch {
        setNameOpen(false);
      }
    }, 250);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [q, fetchNames]);

  // charger versions quand un nom valide est présent
  useEffect(() => {
    const name = value.name?.trim();
    if (!name) { setVerItems([]); setVerOpen(false); return; }
    (async () => {
      try {
        const list = await fetchVersions(name);
        setVerItems(list.slice(0, 80));
        // on n’ouvre pas automatiquement ici : on ouvre au focus ou après choix de nom
      } catch {
        setVerItems([]); setVerOpen(false);
      }
    })();
  }, [value.name, fetchVersions]);

  function chooseName(name: string) {
    onChange({ name, version: value.version || '' });
    setQ(name);
    // fermer proprement la liste et éviter le refetch instantané
    setNameItems([]); setNameOpen(false); suppressNextFetch.current = true;
    // si on a des versions, ouvrir le menu versions et focus
    if (verItems.length) setVerOpen(true);
    verRef.current?.focus();
  }

  function chooseVersion(v: string) {
    onChange({ name: value.name, version: v });
    setVerOpen(false);
  }

  function onKeyDownName(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!nameOpen) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setNameIdx(i => Math.min(i + 1, nameItems.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setNameIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (nameIdx >= 0) chooseName(nameItems[nameIdx]); }
    else if (e.key === 'Escape') { setNameOpen(false); }
  }
  function onKeyDownVer(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!verOpen) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setVerIdx(i => Math.min(i + 1, verItems.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setVerIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (verIdx >= 0) chooseVersion(verItems[verIdx]); }
    else if (e.key === 'Escape') { setVerOpen(false); }
  }

  return (
    <div className="relative grid grid-cols-12 gap-2">
      {/* name */}
      <div className="col-span-7 relative">
        <input
          ref={nameRef}
          value={q}
          onChange={(e) => { setQ(e.target.value); onChange({ name: e.target.value, version: value.version || '' }); }}
          onFocus={() => { if (nameItems.length) setNameOpen(true); }}
          onBlur={() => setTimeout(() => setNameOpen(false), 120)}
          onKeyDown={onKeyDownName}
          placeholder={placeholderName}
          className="input w-full"
        />
        {nameOpen && (
          <ul className="absolute z-20 mt-1 w-full max-h-56 overflow-auto rounded-xl border border-white/10 bg-[#0f131a] shadow-lg">
            {nameItems.map((it, idx) => (
              <li
                key={it}
                className={`px-3 py-2 text-sm cursor-pointer ${idx === nameIdx ? 'bg-white/10' : ''}`}
                onMouseDown={(e) => { e.preventDefault(); chooseName(it); }}
              >
                {it}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* version */}
      <div className="col-span-4 relative">
        <input
          ref={verRef}
          value={value.version || ''}
          onChange={(e) => onChange({ name: value.name, version: e.target.value })}
          onFocus={() => { if (verItems.length) setVerOpen(true); }}
          onBlur={() => setTimeout(() => setVerOpen(false), 120)}
          onKeyDown={onKeyDownVer}
          placeholder={requireVersion ? 'version' : placeholderVersion}
          className="input w-full"
        />
        {verOpen && (
          <ul className="absolute z-20 mt-1 w-full max-h-56 overflow-auto rounded-xl border border-white/10 bg-[#0f131a] shadow-lg">
            {verItems.map((it, idx) => (
              <li
                key={it}
                className={`px-3 py-2 text-sm cursor-pointer ${idx === verIdx ? 'bg-white/10' : ''}`}
                onMouseDown={(e) => { e.preventDefault(); chooseVersion(it); }}
              >
                {it}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="col-span-1">
        <button
          type="button"
          onClick={() => onChange({ name: '', version: '' })}
          className="btn-ghost w-full h-[42px]"
          title="Retirer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
