'use client';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';

export default function LoginPage(){
  const router = useRouter();
  return (
    <main className="max-w-md mx-auto pt-28 px-4">
      <div className="card rounded-3xl p-8 text-center">
        <h1 className="text-2xl font-semibold mb-2">Bienvenue</h1>
        <p className="text-white/70 mb-8">Accédez au tableau de bord AirGap Packager.</p>
        <button onClick={()=>router.push('/')} className="btn-primary w-full gap-2">
          <LogIn size={18}/> Se connecter (faux login)
        </button>
        <p className="text-xs text-white/50 mt-4">Pas d’auth réelle pour l’instant • démo</p>
      </div>
    </main>
  );
}