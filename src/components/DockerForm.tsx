'use client';

export default function DockerForm({ platform, setPlatform, dockerImages, setDockerImages }:{
  platform: 'linux/amd64'|'linux/arm64';
  setPlatform: (v:'linux/amd64'|'linux/arm64')=>void;
  dockerImages: string;
  setDockerImages: (s:string)=>void;
}){
  return (
    <div className="grid gap-4">
      <div>
        <label className="text-sm text-white/70">Platform</label>
        <select value={platform} onChange={(e)=>setPlatform(e.target.value as any)} className="input mt-1">
          <option value="linux/amd64">linux/amd64</option>
          <option value="linux/arm64">linux/arm64</option>
        </select>
      </div>
      <div>
        <label className="text-sm text-white/70">Images Docker (une par ligne: repo:tag)</label>
        <textarea value={dockerImages} onChange={(e)=>setDockerImages(e.target.value)} className="input mt-1 h-32" placeholder="nginx:1.25-alpine\npostgres:16"/>
      </div>
    </div>
  );
}