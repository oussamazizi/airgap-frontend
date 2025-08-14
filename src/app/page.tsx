'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, TerminalSquare, Settings2, CheckCircle2, AlertTriangle, Rocket } from 'lucide-react';
import Header from '@/components/Header';
import TargetTabs from '@/components/TargetTabs';
import DockerForm from '@/components/DockerForm';
import HostForm from '@/components/HostForm';
import StatusCard from '@/components/StatusCard';
import ArtifactsList from '@/components/ArtifactsList';
import JobsBoard from '@/components/JobsBoard';
import { createBundle, fetchArtifacts, fetchJob, API_BASE } from '@/lib/api';

type JobStatus = 'QUEUED'|'RUNNING'|'SUCCEEDED'|'FAILED';

type JobRow = {
  id: string;
  status: JobStatus;
  error?: string;
  artifacts?: { id:string; filename:string; size:number; checksum:string }[];
};

export default function Dashboard(){
  const [target, setTarget] = useState<'docker'|'host'>('docker');
  const [platform, setPlatform] = useState<'linux/amd64'|'linux/arm64'>('linux/amd64');
  const [distroImage, setDistroImage] = useState('ubuntu:22.04');
  const [dockerImages, setDockerImages] = useState<string>('nginx:1.25-alpine\nnode:18-alpine');
  const [npmRows, setNpmRows] = useState([{ name: 'express', version: '4.18.2' }]);
  const [pipRows, setPipRows] = useState([{ name: 'flask', version: '2.2.5' }]);
  const [aptRows, setAptRows] = useState([{ name: 'curl', version: '' }]);

  const [jobs, setJobs] = useState<JobRow[]>([]);
  const timers = useRef<Record<string, any>>({});

  const pollRef = useRef<NodeJS.Timeout|null>(null);

  const payload = useMemo(()=>{
    if (target === 'docker'){
      const images = dockerImages.split(/\n|,/).map(s=>s.trim()).filter(Boolean).map(line=>{
        const [name, tag='latest'] = line.split(':');
        return { name, tag };
      });
      return { target, platform, images } as const;
    }
    return {
      target,
      distroImage,
      npm: npmRows.filter(r=>r.name && r.version),
      pip: pipRows.filter(r=>r.name),
      apt: aptRows.filter(r=>r.name)
    } as const;
  }, [target, platform, dockerImages, distroImage, npmRows, pipRows, aptRows]);

   async function startPolling(id: string){
    stopPolling(id);
    timers.current[id] = setInterval(async ()=>{
      const j = await fetchJob(id);
      setJobs(prev => prev.map(row => row.id===id ? { ...row, status:j.status as JobStatus, error:j.error } : row));
      if (j?.status === 'SUCCEEDED' || j?.status === 'FAILED'){
        stopPolling(id);
        const a = await fetchArtifacts(id);
        setJobs(prev => prev.map(row => row.id===id ? { ...row, artifacts:a } : row));
      }
    }, 1500);
  }

  function stopPolling(){ if (pollRef.current) clearInterval(pollRef.current); pollRef.current = null; }

 async function onCreate(){
    const { id } = await createBundle(payload as any);
    // ajoute le job au tableau sans écraser les autres
    setJobs(prev => [{ id, status: 'QUEUED' as JobStatus }, ...prev]);
    await startPolling(id);
  }

  useEffect(()=>()=>stopPolling(), []);

  return (
    <main>
      <Header/>

      <section className="max-w-6xl mx-auto px-4 pt-8 pb-16 grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold flex items-center gap-2"><Rocket size={20}/> Dashboard</h1>
          <span className="text-xs text-white/50">Backend: {API_BASE}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="card rounded-3xl p-5 lg:col-span-2">
            <TargetTabs target={target} setTarget={setTarget} />
            {target==='docker' ? (
              <DockerForm platform={platform} setPlatform={setPlatform} dockerImages={dockerImages} setDockerImages={setDockerImages}/>
            ) : (
              <HostForm distroImage={distroImage} setDistroImage={setDistroImage}
                npmRows={npmRows} setNpmRows={setNpmRows}
                pipRows={pipRows} setPipRows={setPipRows}
                aptRows={aptRows} setAptRows={setAptRows}
              />
            )}
            <div className="pt-4">
              <button onClick={onCreate} className="btn-primary">
                Créer le bundle
              </button>
            </div>
          </div>
          <JobsBoard items={jobs} />
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-4 pb-12">
        <p className="text-xs text-white/40">© {new Date().getFullYear()} AirGap Packager — Demo</p>
      </footer>
    </main>
  );
}