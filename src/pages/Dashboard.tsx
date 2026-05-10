import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Terminal, Zap, Shield, Cpu, Layers, LogIn, LogOut, Loader2 } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { waitlistAPI } from '../lib/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(0);

  useEffect(() => {
    async function fetchCount() {
      try {
        const response = await waitlistAPI.count();
        setWaitlistCount(response.data.count);
      } catch (error) {
        console.error('Failed to fetch waitlist count:', error);
      }
    }
    fetchCount();
  }, []);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    
    try {
      const response = await waitlistAPI.join(email);
      if (response.data.already) {
        alert("STATUS: ALREADY_ENROLLED");
      } else {
        setWaitlistCount(prev => prev + 1);
        setEmail('');
        alert('ACCESS_GRANTED: CHECK_YOUR_EMAIL');
      }
    } catch (error) {
      console.error('Waitlist error:', error);
      alert('SYSTEM_ERROR');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-12">
        {/* HERO SECTION */}
        <section className="relative h-[240px] bg-sidebar-bg border-2 border-border-subtle p-8 flex items-center overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0H100V100H0V0ZM10 10V90H90V10H10Z" fill="#f5c518"/>
            </svg>
          </div>
          
          <div className="max-w-xl z-10 space-y-4">
            <h1 className="text-6xl font-mono font-black italic tracking-tighter leading-none text-white uppercase translate-x-[-2px]">
              ARCHITECT <span className="text-industrial-yellow">THE VOID</span>
            </h1>
            <p className="text-[#888] font-sans text-xs mb-6 uppercase tracking-[0.2em] font-medium">
              Brutalist UI components for the modern industrial stack.
            </p>
            
            <form onSubmit={handleWaitlist} className="flex gap-0 border border-border-subtle w-fit bg-black">
              <input 
                type="email" 
                placeholder="PROMPT_EMAIL_FOR_WAITLIST" 
                className="bg-black border-none px-4 py-3 font-mono text-xs w-64 focus:outline-none focus:ring-1 focus:ring-industrial-yellow text-industrial-yellow placeholder:text-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                className="bg-industrial-yellow text-black font-mono font-bold px-6 py-3 text-xs hover:bg-white transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'SYNC...' : 'JOIN_WAITLIST'}
              </button>
            </form>
          </div>
          
          <div className="ml-auto text-right">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-mono font-bold text-industrial-yellow"
            >
              {waitlistCount.toLocaleString()}
            </motion.div>
            <div className="text-[10px] font-mono text-[#555] uppercase tracking-[0.2em]">Constructors Waiting</div>
          </div>
        </section>

        {/* Featured Section */}
        <section className="flex flex-col gap-6">
          <div className="flex justify-between items-end border-b border-[#1a1a1a] pb-2">
            <h2 className="text-[9px] font-mono font-bold tracking-[0.3em] uppercase text-[#555]">LATEST_STRUCTURES</h2>
            <button className="text-[9px] font-mono text-[#f5c518] hover:underline uppercase tracking-widest">
              VIEW_ALL_044
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <FeatureCard 
              icon={Cpu}
              title="Nucleus OS"
              description="A full-screen dashboard foundation with integrated state management."
              tag="INTERFACE"
              price="$12.00"
            />
            <FeatureCard 
              icon={Shield}
              title="Holograph UI"
              description="Semi-transparent glass components with layered blur effects."
              tag="SHELL"
              price="$0.00"
            />
            <FeatureCard 
              icon={Layers}
              title="Strata Grid"
              description="Recursive grid systems for complex data visualization layouts."
              tag="LAYOUT"
              price="$18.00"
            />
          </div>
        </section>
      </div>
    </Layout>
  );
}

function FeatureCard({ icon: Icon, title, description, tag, price }: { icon: any, title: string, description: string, tag: string, price: string }) {
  return (
    <div className="bg-[#141414] border border-[#222222] p-1 flex flex-col group cursor-pointer hover:border-[#2a2a2a] transition-colors rounded-[2px]">
      <div className="aspect-video bg-[#0a0a0a] mb-2 flex items-center justify-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-5 bg-grid" />
         <div className="border border-[#f5c518]/20 w-32 h-16 flex items-center justify-center font-mono text-[10px] font-bold text-[#f5c518] group-hover:scale-105 transition-transform duration-500">
            <Icon size={24} strokeWidth={1} />
         </div>
      </div>
      <div className="px-3 py-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[11px] font-mono font-bold text-[#e0e0e0] uppercase tracking-tighter">{title}</span>
          <span className="text-[10px] font-mono text-[#f5c518]">{price}</span>
        </div>
        <p className="text-[10px] text-[#555] uppercase leading-relaxed line-clamp-2 h-8">
          {description}
        </p>
      </div>
      <div className="mt-auto border-t border-[#222222] p-2 flex justify-between items-center bg-[#111111]">
        <span className="text-[9px] font-mono text-[#555] uppercase tracking-[0.15em]">TAG: {tag}</span>
        <div className="w-5 h-5 border border-[#333] flex items-center justify-center text-[10px] group-hover:border-[#f5c518] group-hover:text-[#f5c518] transition-colors font-bold text-[#333]">+</div>
      </div>
    </div>
  );
}
