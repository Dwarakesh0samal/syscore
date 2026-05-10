import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layout } from '../components/Layout';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { billingAPI } from '../lib/api';
import { X, Lock, Download, Zap } from 'lucide-react';

const CATEGORIES = ['ALL', 'DASHBOARD', 'PAGES', 'COMPONENTS', 'FORMS'];
const TIER_FILTERS = ['ALL', 'FREE', 'PRO'];

const TEMPLATES_DATA = [
  { name: "ADMIN_CONSOLE", type: "DASHBOARD", tier: "PRO", desc: "Enterprise-grade command center for complex systems." },
  { name: "AUTH_FLOW_SHELL", type: "PAGES", tier: "FREE", desc: "Secure multi-step identity verification sequences." },
  { name: "DATA_VISUALIZATION", type: "DASHBOARD", tier: "PRO", desc: "Recursive metric grids and telemetry nodes." },
  { name: "FORM_MATRIX", type: "FORMS", tier: "FREE", desc: "Standardized input arrays for massive data entry." },
  { name: "OPERATOR_PORTAL", type: "PAGES", tier: "PRO", desc: "User-facing structural dashboard with profile sync." },
  { name: "COMPONENT_SANDBOX", type: "COMPONENTS", tier: "FREE", desc: "Isolated environment for testing digital primitives." },
  { name: "METRICS_HUB", type: "DASHBOARD", tier: "PRO", desc: "Real-time performance monitoring and flux analysis." },
  { name: "INPUT_FRAMEWORK", type: "FORMS", tier: "PRO", desc: "Dynamic form generation with protocol-level validation." },
  { name: "NAV_STRUCTURE", type: "COMPONENTS", tier: "FREE", desc: "Persistent sidebar and top-bar layout protocols." },
];

export default function Templates() {
  const [filter, setFilter] = useState('ALL');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const { user } = useAuth();

  const filtered = TEMPLATES_DATA.filter(t => {
    const matchesCat = filter === 'ALL' || t.type === filter;
    const matchesTier = tierFilter === 'ALL' || t.tier === tierFilter;
    return matchesCat && matchesTier;
  });

  const handleTemplateClick = (template: any) => {
    setSelectedTemplate(template);
  };

  const handleDownload = (name: string) => {
    const element = document.createElement("a");
    const file = new Blob([`SYS.CORE TEMPLATE PACKAGE: ${name}\n\n[ STATUS: PRODUCTION_READY ]\n[ BUILD_ID: 884-X9 ]`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${name.toLowerCase()}_package.txt`;
    document.body.appendChild(element);
    element.click();
    setSelectedTemplate(null);
  };

  const handleUpgrade = async () => {
    try {
      const response = await billingAPI.createCheckout(import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID, 'monthly');
      window.location.href = response.data.checkout_url;
    } catch (error) {
      alert('SYSTEM_ERROR: UPGRADE_PROTOCOL_FAILED');
    }
  };

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="space-y-4"
      >
        {/* Header */}
        <div className="space-y-2">
          <h1 className="font-mono text-[22px] font-bold uppercase tracking-[0.08em] text-[#e0e0e0]">TEMPLATE_VAULT</h1>
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#888]">PRODUCTION_READY LAYOUTS / DEPLOY_READY STRUCTURES</p>
        </div>

        <div className="h-px bg-[#1a1a1a] w-full mt-4 mb-5" />

        {/* Featured Block */}
        <div className="w-full bg-[#141414] border border-[#222222] rounded-[2px] flex h-[160px] overflow-hidden mb-4">
          <div className="w-[30%] bg-[#0d1a0d] border-r border-[#1a2a1a] flex items-center justify-center p-4">
            <span className="font-mono text-[9px] text-[#2a4a2a] uppercase tracking-[0.15em] text-center">
              [ FEATURED_TEMPLATE ]
            </span>
          </div>
          <div className="w-[70%] p-5 flex flex-col justify-between">
            <div>
              <div className="flex gap-2">
                <span className="bg-[#f5c518] text-black font-mono text-[9px] px-2 py-0.5 font-bold uppercase">◆ PRO</span>
                <span className="border border-[#2a2a2a] text-[#555] font-mono text-[9px] px-2 py-0.5 uppercase">WEB_APP</span>
              </div>
              <h2 className="font-mono text-[16px] font-bold text-[#e0e0e0] mt-2 uppercase tracking-[0.05em]">MACHINE_ANALYTICS_HUB</h2>
              <p className="font-mono text-[10px] text-[#555] mt-1 line-height-[1.7] max-w-xl">
                Complete telemetry dashboard. Dense data grids + real-time metric cards + collapsible structural sidebar.
              </p>
            </div>
            <button className="font-mono text-[9px] text-[#f5c518] uppercase tracking-[0.15em] w-fit hover:opacity-70 transition-opacity">
              INITIALIZE_TEMPLATE →
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "font-mono text-[9px] px-[10px] py-[4px] border uppercase tracking-[0.12em] transition-colors",
                  filter === cat ? "border-[#f5c518] text-[#f5c518]" : "border-[#222222] text-[#555555] hover:text-[#e0e0e0]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {TIER_FILTERS.map(tier => (
              <button
                key={tier}
                onClick={() => setTierFilter(tier)}
                className={cn(
                  "font-mono text-[9px] px-[10px] py-[4px] border uppercase tracking-[0.12em] transition-colors",
                  tierFilter === tier ? "border-[#f5c518] text-[#f5c518]" : "border-[#222222] text-[#555555] hover:text-[#e0e0e0]"
                )}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {filtered.map((item, i) => (
            <div
              key={item.name}
              onClick={() => handleTemplateClick(item)}
              className="bg-[#141414] border border-[#222222] rounded-[2px] overflow-hidden group cursor-pointer hover:border-[#2a2a2a] hover:-translate-y-[2px] transition-all duration-150"
            >
              <div className={cn(
                "aspect-video flex items-center justify-center relative",
                item.type === 'DASHBOARD' ? "bg-[#0d1a0d]" : 
                item.type === 'PAGES' ? "bg-[#0d0d1a]" : 
                item.type === 'FORMS' ? "bg-[#1a0d1a]" : "bg-[#1a1a1a]"
              )}>
                <span className="font-mono text-[9px] text-[#2a3a2a] uppercase">[ {item.type}.LAYOUT ]</span>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <span className="font-mono text-[9px] text-[#f5c518] opacity-0 group-hover:opacity-100 transition-opacity uppercase">PREVIEW_STRUCTURE</span>
                </div>
              </div>
              <div className="p-3 flex justify-between items-center">
                <div>
                  <h3 className="font-mono text-[11px] font-bold text-[#e0e0e0] uppercase">{item.name}</h3>
                  <p className="font-mono text-[9px] text-[#555] uppercase mt-0.5">{item.type}</p>
                </div>
                {item.tier === 'FREE' ? (
                  <span className="border border-[#222222] text-[#555555] font-mono text-[9px] px-2 py-0.5 uppercase tracking-tighter">FREE_ACCESS</span>
                ) : (
                  <span className="border border-[#a07d00] text-[#f5c518] font-mono text-[9px] px-2 py-0.5 uppercase tracking-tighter flex items-center gap-1">
                    <Zap size={8} fill="#f5c518" /> PRO_ONLY
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modals */}
        <AnimatePresence>
          {selectedTemplate && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85">
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="bg-[#141414] border border-[#222222] rounded-[2px] w-full max-w-[480px] p-6 shadow-2xl relative"
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-mono text-[14px] font-bold text-[#e0e0e0] uppercase">
                    {selectedTemplate.tier === 'FREE' ? 'TEMPLATE_DOWNLOAD' : 'ACCESS_RESTRICTED'}
                  </h2>
                  <button 
                    onClick={() => setSelectedTemplate(null)}
                    className="font-mono text-[10px] text-[#555] hover:text-[#f5c518] transition-colors flex items-center gap-2"
                  >
                    × CLOSE
                  </button>
                </div>

                <div className="h-px bg-[#1a1a1a] w-full mt-3 mb-4" />

                {selectedTemplate.tier === 'FREE' ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-mono text-[12px] font-bold text-[#e0e0e0] uppercase tracking-[0.05em]">{selectedTemplate.name}</h3>
                      <p className="font-mono text-[11px] text-[#555] leading-relaxed uppercase">{selectedTemplate.desc}</p>
                    </div>
                    <button 
                      onClick={() => handleDownload(selectedTemplate.name)}
                      className="w-full bg-transparent border border-[#f5c518] text-[#f5c518] font-mono text-[10px] font-bold uppercase tracking-[0.15em] py-3 hover:bg-[#f5c518] hover:text-black transition-all flex items-center justify-center gap-2"
                    >
                      DOWNLOAD_PACKAGE →
                    </button>
                  </div>
                ) : user?.plan === 'pro' ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-mono text-[12px] font-bold text-[#e0e0e0] uppercase tracking-[0.05em]">{selectedTemplate.name} (PRO)</h3>
                      <p className="font-mono text-[11px] text-[#555] leading-relaxed uppercase">{selectedTemplate.desc}</p>
                    </div>
                    <button 
                      onClick={() => handleDownload(selectedTemplate.name)}
                      className="w-full bg-[#f5c518] border border-[#f5c518] text-black font-mono text-[10px] font-bold uppercase tracking-[0.15em] py-3 hover:bg-white transition-all flex items-center justify-center gap-2"
                    >
                      INITIALIZE_PRO_PACKAGE →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Lock size={32} className="text-[#f5c518] mb-2" />
                      <h3 className="font-mono text-[14px] font-bold text-[#f5c518] uppercase">◆ PRO_CLEARANCE_REQUIRED</h3>
                    </div>

                    <div className="border border-[#222222] bg-black/40 p-1">
                      <table className="w-full font-mono text-[10px] text-[#555]">
                        <thead>
                          <tr className="border-b border-[#222222]">
                            <th className="text-left p-2 uppercase">FEATURE</th>
                            <th className="p-2 uppercase">FREE</th>
                            <th className="p-2 uppercase text-[#f5c518]">PRO</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[#111]">
                            <td className="p-2 uppercase">TEMPLATES</td>
                            <td className="p-2 text-center uppercase">3</td>
                            <td className="p-2 text-center uppercase text-[#f5c518]">ALL</td>
                          </tr>
                          <tr className="border-b border-[#111]">
                            <td className="p-2 uppercase">API_KEYS</td>
                            <td className="p-2 text-center uppercase">2</td>
                            <td className="p-2 text-center uppercase text-[#f5c518]">10</td>
                          </tr>
                          <tr className="border-b border-[#111]">
                            <td className="p-2 uppercase">COMPONENTS</td>
                            <td className="p-2 text-center uppercase">20/MO</td>
                            <td className="p-2 text-center uppercase text-[#f5c518]">∞</td>
                          </tr>
                          <tr>
                            <td className="p-2 uppercase">PRIORITY_SUP</td>
                            <td className="p-2 text-center uppercase">NO</td>
                            <td className="p-2 text-center uppercase text-[#f5c518]">YES</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <button 
                      onClick={handleUpgrade}
                      className="w-full bg-[#f5c518] border border-[#f5c518] text-black font-mono text-[10px] font-bold uppercase tracking-[0.15em] py-4 hover:bg-white transition-all"
                    >
                      UPGRADE_PROTOCOL →
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
}
