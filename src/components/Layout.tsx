import React from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/AuthContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-[#e0e0e0] font-mono overflow-hidden selection:bg-[#f5c518] selection:text-black">
      <Sidebar />
      <main className="flex-1 flex flex-col ml-[148px] relative overflow-y-auto">
        {/* HEADER */}
        <header className="h-[36px] border-b border-[#1a1a1a] flex items-center justify-between px-4 bg-[#0a0a0a] shrink-0 z-20">
          <div className="flex items-center gap-6">
            <div className="text-[10px] font-mono text-[#555] uppercase">SEARCH: <span className="text-[#f5c518]">_</span></div>
            <div className="text-[10px] font-mono text-[#555] uppercase tracking-widest">NETWORK: <span className="text-[#e0e0e0]">INDUSTRIAL_NET_04</span></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end leading-none">
              <span className="text-[10px] font-mono font-bold uppercase text-[#e0e0e0]">{user?.username || 'GHOST_OPERATOR'}</span>
              <span className="text-[9px] font-mono text-[#555] uppercase tracking-tighter">{(user?.plan || 'FREE').toUpperCase()}_LEVEL_ACCESS</span>
            </div>
            <div className="w-7 h-7 bg-[#f5c518] flex items-center justify-center text-black font-bold uppercase text-[10px] rounded-[2px]">
              {(user?.username || 'OP').substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 p-6 relative z-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="h-[20px] bg-[#0a0a0a] border-t border-[#1a1a1a] flex items-center px-4 justify-between font-mono text-[9px] text-[#333] shrink-0">
          <div className="flex gap-6 uppercase">
            <span>UPTIME: 99.98%</span>
            <span>LATENCY: 12ms</span>
            <span>JWT_AUTH_ACTIVE: TRUE</span>
          </div>
          <div className="text-[#333] uppercase">
            © 2026 SYS.CORE_INDUSTRIES
          </div>
        </footer>
      </main>

      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #222; }
        ::-webkit-scrollbar-thumb:hover { background: #2a2a2a; }
      `}</style>
    </div>
  );
}
