'use client';
import { useRouter, usePathname } from 'next/navigation';
import { Box, LogIn } from 'lucide-react';

export default function Header(){
  const router = useRouter();
  const pathname = usePathname();
  const onLogin = () => router.push('/login');
  return (
    <header className="px-4">
      <div className="max-w-6xl mx-auto py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Box/>
          <span className="font-semibold">AirGap Packager</span>
        </div>
        <nav className="flex items-center gap-2">
          <button onClick={()=>router.push('/')} className={`btn-ghost ${pathname==='/'?'bg-white/10':''}`}>Dashboard</button>
          <button onClick={onLogin} className={`btn-ghost ${pathname==='/login'?'bg-white/10':''}`}><LogIn size={16}/> Login</button>
        </nav>
      </div>
    </header>
  );
}