export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export async function createBundle(payload: any): Promise<{ id: string }>{
  const r = await fetch(`${API_BASE}/api/bundles`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload)
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error ? JSON.stringify(data.error) : 'Request failed');
  return data;
}

export async function fetchJob(id: string){
  const r = await fetch(`${API_BASE}/api/bundles/${id}`);
  return r.json();
}

export async function fetchArtifacts(id: string){
  const r = await fetch(`${API_BASE}/api/bundles/${id}/artifacts`);
  return r.json();
}

async function jfetch<T>(url: string){
  const r = await fetch(url);
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error || `Request failed: ${url}`);
  return j as T;
}

export async function suggestNpm(name: string, version?: string){
  const u = new URL(`${API_BASE}/api/suggest/npm`);
  u.searchParams.set('name', name);
  if (version) u.searchParams.set('version', version);
  const r = await fetch(u.toString());
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error || 'suggest/npm failed');
  return j as { name:string; version:string; dependencies:{name:string; range:string}[] };
}

export async function suggestPip(name: string, version?: string){
  const u = new URL(`${API_BASE}/api/suggest/pip`);
  u.searchParams.set('name', name);
  if (version) u.searchParams.set('version', version);
  const r = await fetch(u.toString());
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error || 'suggest/pip failed');
  return j as { name:string; version:string; dependencies:{name:string; spec:string}[] };
}

// npm
export async function searchNpm(q: string): Promise<string[]>{
  const u = new URL(`${API_BASE}/api/autocomplete/npm`);
  u.searchParams.set('q', q);
  const j = await jfetch<{ items: string[] }>(u.toString());
  return j.items || [];
}
export async function versionsNpm(name: string): Promise<string[]>{
  const u = new URL(`${API_BASE}/api/versions/npm`);
  u.searchParams.set('name', name);
  const j = await jfetch<{ versions: string[] }>(u.toString());
  return j.versions || [];
}

// pip
export async function searchPip(q: string): Promise<string[]>{
  const u = new URL(`${API_BASE}/api/autocomplete/pip`);
  u.searchParams.set('q', q);
  const j = await jfetch<{ items: string[] }>(u.toString());
  return j.items || [];
}
export async function versionsPip(name: string): Promise<string[]>{
  const u = new URL(`${API_BASE}/api/versions/pip`);
  u.searchParams.set('name', name);
  const j = await jfetch<{ versions: string[] }>(u.toString());
  return j.versions || [];
}

// apt
export async function searchApt(q: string, image: string): Promise<string[]>{
  const u = new URL(`${API_BASE}/api/autocomplete/apt`);
  u.searchParams.set('q', q);
  u.searchParams.set('image', image);
  const j = await jfetch<{ items: string[] }>(u.toString());
  return j.items || [];
}
export async function versionsApt(name: string, image: string): Promise<string[]>{
  const u = new URL(`${API_BASE}/api/versions/apt`);
  u.searchParams.set('name', name);
  u.searchParams.set('image', image);
  const j = await jfetch<{ versions: string[] }>(u.toString());
  return j.versions || [];
}