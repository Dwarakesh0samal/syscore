import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layout } from '../components/Layout';
import { cn } from '../lib/utils';

const CATEGORIES = ['ALL', 'DOCUMENTATION', 'TUTORIAL', 'REFERENCE', 'TOOL'];
const SORT_OPTIONS = ['NEWEST', 'OLDEST', 'A–Z', 'Z–A'];

const RESOURCES_DATA = [
  { title: "GRID_SYSTEM_API", category: "DOCUMENTATION", date: "MAY 03", desc: "Foundational grid logic for structural consistency." },
  { title: "CUSTOM_SHELL_BUILD", category: "TUTORIAL", date: "APR 28", desc: "Step-by-step assembly of industrial UI shells." },
  { title: "COLOR_TOKEN_MATRIX", category: "REFERENCE", date: "APR 22", desc: "Hex-code mapping for all protocol colors." },
  { title: "NOISE_GENERATOR", category: "TOOL", date: "APR 15", desc: "Procedural grain and noise for depth simulation." },
  { title: "TYPOGRAPHY_HIERARCHY", category: "DOCUMENTATION", date: "APR 10", desc: "Space Mono scale and letter-spacing protocols." },
  { title: "ANIM_TRANSITIONS", category: "REFERENCE", date: "MAR 30", desc: "Ease-out constants for industrial motion." },
  { title: "ICONOGRAPHY_INDEX", category: "REFERENCE", date: "MAR 22", desc: "Full glyph library for system status display." },
  { title: "CONTRAST_CHECKER", category: "TOOL", date: "MAR 15", desc: "Validation tool for accessibility compliance." },
  { title: "FORM_VALIDATION", category: "TUTORIAL", date: "MAR 05", desc: "Regex patterns for secure operator input." },
  { title: "ADVANCED_OVERLAYS", category: "DOCUMENTATION", date: "FEB 24", desc: "Layering techniques for complex dialog systems." },
  { title: "ANIMATION_CURVES", category: "REFERENCE", date: "FEB 18", desc: "Visual guide to protocol motion paths." },
  { title: "TOKEN_EXPORTER", category: "TOOL", date: "FEB 10", desc: "Sync design tokens with industrial-grade compilers." },
];

export default function Resources() {
  const [filter, setFilter] = useState('ALL');
  const [sort, setSort] = useState('NEWEST');

  const filtered = RESOURCES_DATA.filter(r => filter === 'ALL' || r.category === filter);

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
          <h1 className="font-mono text-[22px] font-bold uppercase tracking-[0.08em] text-[#e0e0e0]">RESOURCE_LIBRARY</h1>
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#888]">STRUCTURAL ASSETS / FRAMEWORK DOCUMENTATION</p>
        </div>

        <div className="h-px bg-[#1a1a1a] w-full mt-4 mb-5" />

        {/* Filter Bar */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "font-mono text-[9px] px-[10px] py-[4px] border uppercase tracking-[0.12em] transition-colors",
                  filter === cat ? "border-[#f5c518] text-[#f5c518]" : "border-[#222222] text-[#555555] hover:text-[#e0e0e0] hover:border-[#2a2a2a]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-[#141414] border border-[#222222] font-mono text-[10px] text-[#888] px-3 py-2 outline-none focus:border-[#f5c518]"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="text-right">
          <p className="font-mono text-[9px] text-[#555] uppercase">SHOWING {filtered.length} ASSETS</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? filtered.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.02 }}
                className="bg-[#141414] border border-[#222222] p-4 group cursor-pointer hover:border-[#2a2a2a] hover:-translate-y-[1px] transition-all duration-150"
              >
                <div className="flex justify-between items-center">
                  <Badge category={item.category} />
                  <span className="font-mono text-[9px] text-[#555]">{item.date}</span>
                </div>

                <h3 className="font-mono text-[12px] font-bold text-[#e0e0e0] uppercase tracking-[0.06em] mt-3">
                  {item.title}
                </h3>

                <p className="font-mono text-[10px] text-[#555] mt-2 line-height-[1.7] line-clamp-2">
                  {item.desc}
                </p>

                <div className="mt-4 font-mono text-[9px] text-[#f5c518] uppercase tracking-[0.12em] group-hover:opacity-70 transition-opacity">
                  ACCESS →
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full bg-[#141414] border border-[#222222] p-24 flex flex-col items-center justify-center text-center space-y-2">
                <p className="font-mono text-[12px] text-[#555] uppercase">[ NO_ASSETS_FOUND ]</p>
                <p className="font-mono text-[9px] text-[#333] uppercase tracking-[0.15em]">ADJUST FILTER PARAMETERS</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </Layout>
  );
}

function Badge({ category }: { category: string }) {
  const styles: Record<string, string> = {
    DOCUMENTATION: "border-[#2a4a2a] text-[#22c55e]",
    TUTORIAL: "border-[#1a2a4a] text-[#60a5fa]",
    REFERENCE: "border-[#2a1a4a] text-[#c084fc]",
    TOOL: "border-[#4a3a1a] text-[#fbbf24]",
  };

  return (
    <span className={cn(
      "font-mono text-[9px] px-2 py-0.5 border uppercase tracking-[0.12em]",
      styles[category] || "border-[#222] text-[#555]"
    )}>
      {category}
    </span>
  );
}
