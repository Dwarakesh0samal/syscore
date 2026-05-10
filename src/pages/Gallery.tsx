import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Copy, Check, X, Code, Eye, Zap, AlertTriangle, RefreshCw } from 'lucide-react';
import { Layout } from '../components/Layout';
import { cn } from '../lib/utils';
import { componentsAPI, Component } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Input', 'Navigation', 'Card', 'Overlay', 'Data'];

export default function Gallery() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [fullComponentData, setFullComponentData] = useState<Component | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const fetchComponents = useCallback(async (searchQuery: string, cat: string) => {
    setLoading(true);
    setError(false);
    try {
      const params: any = {};
      if (cat !== 'All') params.category = cat;
      if (searchQuery) params.search = searchQuery;
      
      const res = await componentsAPI.list(params);
      setComponents(res.data.components);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchComponents(search, category);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category, fetchComponents]);

  const handleOpenPreview = async (comp: Component) => {
    setSelectedComponent(comp);
    if (comp.tier === 'pro' && user?.plan !== 'pro') return;

    setLoadingPreview(true);
    try {
      const res = await componentsAPI.get(comp.slug);
      setFullComponentData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPreview(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-12">
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border-subtle pb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-mono font-bold text-white uppercase tracking-tighter">Component Gallery</h1>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Library / Index / V1.0.4</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH_MODULE..."
                className="bg-card-bg border border-border-subtle p-3 pl-10 h-12 w-full sm:w-64 outline-none focus:border-industrial-yellow font-mono text-xs uppercase text-industrial-yellow"
              />
            </div>
            <div className="flex bg-card-bg border border-border-subtle p-1 overflow-x-auto no-scrollbar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-all whitespace-nowrap",
                    category === cat ? "bg-industrial-yellow text-black" : "text-gray-500 hover:text-gray-200"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {error ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="border border-red-500/20 bg-red-500/5 p-8 flex flex-col items-center text-center space-y-4 max-w-md">
              <AlertTriangle className="text-red-500" size={32} />
              <div className="space-y-1">
                <h3 className="font-mono text-xs font-bold text-red-500 uppercase tracking-tighter">[ CONNECTION_FAILED ]</h3>
                <p className="font-mono text-[9px] text-gray-500 uppercase">Unable to reach sys.core_api</p>
              </div>
              <button 
                onClick={() => fetchComponents(search, category)}
                className="flex items-center gap-2 font-mono text-[10px] text-industrial-yellow hover:underline uppercase pt-4"
              >
                <RefreshCw size={12} /> RETRY_CONNECTION →
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card-bg border border-border-subtle p-1 flex flex-col h-[300px] animate-pulse">
                <div className="aspect-video bg-[#1a1a1a] mb-3" />
                <div className="px-4 py-2 space-y-3">
                  <div className="h-3 bg-[#222] w-2/3" />
                  <div className="h-2 bg-[#1a1a1a] w-full" />
                  <div className="h-2 bg-[#1a1a1a] w-5/6" />
                </div>
                <div className="mt-auto border-t border-border-subtle p-3 bg-[#151515] h-10" />
              </div>
            ))}
            <div className="col-span-full flex justify-center pt-8">
              <span className="font-mono text-[9px] text-[#333] uppercase tracking-[0.3em]">LOADING_ASSETS...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {components.map(comp => (
                <motion.div
                  key={comp.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-card-bg border border-border-subtle p-1 flex flex-col group cursor-pointer hover:border-industrial-yellow/50 transition-colors"
                  onClick={() => handleOpenPreview(comp)}
                >
                  <div className="aspect-video bg-core-bg mb-3 flex items-center justify-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-grid opacity-10" />
                     <div className="relative z-10 w-full h-full flex items-center justify-center border border-dashed border-gray-800 p-4">
                        <div className={cn(
                          "w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500",
                          comp.tier === 'pro' && user?.plan !== 'pro' && "opacity-50 blur-[4px]"
                        )}>
                          <BoxIcon size={64} className="text-industrial-yellow/20" />
                          <span className="absolute font-mono text-[10px] text-gray-700 tracking-[0.2em]">{comp.preview_label}</span>
                        </div>
                        
                        {comp.tier === 'pro' && user?.plan !== 'pro' && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
                            <span className="text-industrial-yellow font-mono font-bold text-[11px] uppercase tracking-widest">◆ PRO_ACCESS_REQUIRED</span>
                            <Link 
                              to="/billing" 
                              onClick={(e) => e.stopPropagation()}
                              className="bg-industrial-yellow text-black font-mono text-[9px] px-3 py-1 uppercase font-bold hover:bg-white transition-colors"
                            >
                              UPGRADE_PROTOCOL →
                            </Link>
                          </div>
                        )}
                     </div>
                  </div>
                  <div className="px-4 py-2">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-xs font-mono font-bold text-white uppercase tracking-tighter group-hover:text-industrial-yellow transition-colors">{comp.name}</h3>
                      {comp.tier === 'pro' ? <Zap size={10} className="text-industrial-yellow" /> : <span className="text-[10px] font-mono text-industrial-yellow">$0.00</span>}
                    </div>
                    <p className="text-[10px] text-[#666] uppercase leading-relaxed line-clamp-2 h-8">{comp.description}</p>
                  </div>
                  <div className="mt-auto border-t border-border-subtle p-3 flex justify-between items-center bg-[#151515]">
                    <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">TYPE: {comp.category}</span>
                    <div className="w-6 h-6 border border-[#333] flex items-center justify-center text-[10px] group-hover:border-industrial-yellow group-hover:text-industrial-yellow transition-colors font-bold text-gray-600">+</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {components.length === 0 && (
              <div className="col-span-full py-24 flex flex-col items-center justify-center space-y-2 opacity-30">
                <span className="font-mono text-xs uppercase tracking-widest">NO_COMPONENTS_FOUND</span>
                <span className="font-mono text-[9px] uppercase tracking-tighter">TRY_RESETTING_FILTERS</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {selectedComponent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => {
                setSelectedComponent(null);
                setFullComponentData(null);
              }}
            />
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="relative w-full max-w-5xl bg-card-bg border border-border-subtle shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center bg-sidebar-bg border-b border-border-subtle px-6 py-4">
                <div className="flex items-center gap-3">
                  <Eye className="text-industrial-yellow" size={18} />
                  <h2 className="font-mono font-bold text-white uppercase tracking-tighter">{selectedComponent.preview_label}</h2>
                </div>
                <button 
                  onClick={() => {
                    setSelectedComponent(null);
                    setFullComponentData(null);
                  }}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {selectedComponent.tier === 'pro' && user?.plan !== 'pro' ? (
                <div className="p-24 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-16 h-16 border border-industrial-yellow flex items-center justify-center">
                    <Zap className="text-industrial-yellow" size={32} fill="currentColor" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-mono text-xl font-bold text-white uppercase">Pro Access Required</h3>
                    <p className="font-mono text-[10px] text-gray-500 max-w-xs uppercase tracking-widest">This component is part of the sys.core/pro vault. upgrade your protocol to access source code and live previews.</p>
                  </div>
                  <Link 
                    to="/billing" 
                    className="bg-industrial-yellow text-black font-mono text-xs px-8 py-3 uppercase font-bold hover:bg-white transition-colors"
                  >
                    UPGRADE_TO_PRO_NOW →
                  </Link>
                </div>
              ) : (
                <div className="p-0 grid grid-cols-1 lg:grid-cols-2 gap-0 h-[600px]">
                  {/* Left: Preview */}
                  <div className="border-r border-border-subtle bg-core-bg flex flex-col">
                    <div className="bg-[#151515] px-4 py-2 border-b border-border-subtle flex justify-between items-center">
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Live_Preview</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-red-500/20" />
                        <div className="w-2 h-2 bg-industrial-yellow/20" />
                        <div className="w-2 h-2 bg-green-500/20" />
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center p-8 bg-grid opacity-90 overflow-auto">
                      {loadingPreview ? (
                        <span className="font-mono text-[9px] text-gray-700 uppercase animate-pulse">BOOTING_PREVIEW...</span>
                      ) : (
                        <div className="w-full flex items-center justify-center min-h-[200px]">
                          <iframe 
                            title="Preview"
                            srcDoc={`
                              <html>
                                <head>
                                  <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
                                  <style>
                                    body { margin: 0; padding: 20px; background: transparent; display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 40px); }
                                    * { font-family: 'Space Mono', monospace; box-sizing: border-box; }
                                  </style>
                                </head>
                                <body>${fullComponentData?.code_html || ''}</body>
                              </html>
                            `}
                            className="w-full h-full border-none"
                            style={{ background: 'transparent' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Code */}
                  <div className="bg-card-bg flex flex-col">
                    <div className="bg-[#151515] px-4 py-2 border-b border-border-subtle flex justify-between items-center">
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Source_Code</span>
                      <span className="text-[10px] font-mono text-gray-700 uppercase tracking-widest">HTML / CSS</span>
                    </div>
                    <div className="flex-1 overflow-auto p-6 font-mono text-[11px] text-gray-400 leading-relaxed bg-[#0d0d0d]">
                      {loadingPreview ? (
                        <div className="space-y-2">
                          {[...Array(12)].map((_, i) => (
                            <div key={i} className="h-2 bg-[#1a1a1a] rounded animate-pulse" style={{ width: `${Math.random() * 40 + 60}%` }} />
                          ))}
                        </div>
                      ) : (
                        <pre className="whitespace-pre-wrap break-all">
                          <code>{fullComponentData?.code_html}</code>
                        </pre>
                      )}
                    </div>
                    <div className="p-4 border-t border-border-subtle bg-[#151515]">
                       <CopyButton component={fullComponentData} />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

function CopyButton({ component }: { component: Component | null }) {
  const [copied, setCopied] = useState(false);
  const [limitError, setLimitError] = useState<string | null>(null);

  const handleCopy = async () => {
    if (!component) return;
    
    try {
      await componentsAPI.trackCopy(component.slug);
      navigator.clipboard.writeText(component.code_html);
      setCopied(true);
      setLimitError(null);
      setTimeout(() => setCopied(false), 2000);
    } catch (err: any) {
      if (err.response?.status === 403 && err.response?.data?.error === 'LIMIT_REACHED') {
        setLimitError("MONTHLY_LIMIT_REACHED (20/20)");
      } else {
        console.error(err);
      }
    }
  };

  if (limitError) {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest text-center">{limitError}</span>
        <Link 
          to="/billing"
          className="bg-industrial-yellow text-black font-mono text-[10px] py-2 uppercase font-bold text-center hover:bg-white transition-colors"
        >
          ◆ UPGRADE_TO_PRO →
        </Link>
      </div>
    );
  }

  return (
    <button 
      onClick={handleCopy}
      disabled={!component}
      className={cn(
        "w-full h-10 border border-border-subtle bg-card-bg font-mono text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2",
        copied ? "bg-green-500 border-green-600 text-black" : "text-gray-300 hover:border-industrial-yellow hover:text-industrial-yellow",
        !component && "opacity-50 cursor-not-allowed"
      )}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'COPIED ✓' : 'COPY_SOURCE'}
    </button>
  );
}

function BoxIcon({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
