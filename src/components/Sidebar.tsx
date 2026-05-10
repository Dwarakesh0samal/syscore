import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Components', path: '/gallery' },
  { label: 'Resources', path: '/resources' },
  { label: 'Templates', path: '/templates' },
  { label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[148px] bg-[#0f0f0f] border-r border-[#1a1a1a] flex flex-col z-50">
      <Link to="/" className="p-4 border-b border-[#1a1a1a] flex flex-col gap-0.5 hover:bg-[#141414]/50 transition-colors">
        <h1 className="font-mono font-bold text-sm tracking-tighter text-[#f5c518] uppercase">SYS.CORE</h1>
        <p className="text-[9px] font-mono text-[#555] uppercase tracking-widest">BUILD_ID: 884-X0</p>
      </Link>

      <nav className="flex-1 py-6">
        <div className="px-4 mb-3 text-[9px] font-mono text-[#555] uppercase tracking-[0.2em]">NAVIGATION</div>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 flex items-center gap-2.5 font-mono text-[11px] uppercase transition-all duration-150 border-l-2",
                  isActive 
                    ? "bg-[#141414] text-[#f5c518] border-[#f5c518]" 
                    : "text-[#555] hover:bg-[#141414]/50 hover:text-[#888] border-transparent"
                )}
              >
                <div className={cn(
                  "w-3 h-3 transition-colors border",
                  isActive 
                    ? "bg-[#f5c518] border-[#f5c518]" 
                    : "border-[#333]"
                )}></div>
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-[#1a1a1a]">
        <div className="space-y-1.5">
          <h3 className="text-[9px] font-mono text-[#555] uppercase tracking-[0.15em]">Status</h3>
          <div className="text-[10px] font-mono text-[#22c55e] flex items-center gap-1.5 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            SYSTEM_LIVE
          </div>
        </div>
      </div>
    </aside>
  );
}
