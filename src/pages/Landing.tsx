import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Terminal, Zap, Shield, Cpu, ArrowRight, Layers, Hexagon, Loader2 } from 'lucide-react';
import { waitlistAPI } from '../lib/api';
import { AuthModal } from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();

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
        alert('ACCESS_GRANTED: CHECK_YOUR_EMAIL_FOR_SYNC_CODE');
      }
    } catch (error) {
      console.error('Waitlist error:', error);
      alert('SYSTEM_ERROR: RETRY_SEQUENCE');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-core-bg text-white font-sans selection:bg-industrial-yellow selection:text-black overflow-x-hidden">
      {/* Background Patterns */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,197,24,0.05)_0%,transparent_70%)]" />
      </div>

      {/* Top Navigation */}
      <nav className="relative z-50 h-20 border-b border-border-subtle bg-core-bg/80 backdrop-blur-md px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-industrial-yellow flex items-center justify-center">
            <Hexagon size={18} className="text-black fill-current" />
          </div>
          <span className="font-mono font-bold text-xl tracking-tighter text-industrial-yellow">SYS.CORE</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 font-mono text-[10px] uppercase tracking-widest text-gray-500">
          <a href="#manifesto" className="hover:text-industrial-yellow transition-colors">Manifesto</a>
          <a href="#archives" className="hover:text-industrial-yellow transition-colors">Archives</a>
          <Link to="/gallery" className="hover:text-industrial-yellow transition-colors">Components</Link>
          {user ? (
            <Link to="/dashboard" className="industrial-button py-2 px-6">
              Enter System
            </Link>
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="industrial-button py-2 px-6"
            >
              Initialize_Node
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center pt-20 pb-20 px-8 overflow-hidden border-b border-border-subtle">
        {/* Hero Video Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-30 grayscale contrast-125"
          >
            <source src="/bg-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-core-bg/40 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <span className="inline-block border border-industrial-yellow/30 bg-industrial-yellow/5 px-4 py-1 text-[10px] font-mono text-industrial-yellow uppercase tracking-widest mb-4">
              [ PROTOCOL_ENFORCED : V1.0.4 ]
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[12vw] md:text-[clamp(4rem,10vw,8rem)] font-mono font-black italic tracking-tighter leading-none text-white uppercase mb-12 mix-blend-difference"
          >
            NOT JUST UI. <br />
            <span className="text-industrial-yellow">PURE_STRUCTURE.</span>
          </motion.h1>

          <div className="max-w-md w-full mb-16">
            <form onSubmit={handleWaitlist} className="flex gap-0 border border-border-subtle bg-black p-1">
              <input 
                type="email" 
                placeholder="PROMPT_EMAIL_FOR_WAITLIST" 
                className="bg-black border-none px-4 py-4 font-mono text-xs flex-1 focus:outline-none focus:ring-1 focus:ring-industrial-yellow text-industrial-yellow placeholder:text-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                className="bg-industrial-yellow text-black font-mono font-bold px-8 py-4 text-xs hover:bg-white transition-colors flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'JOIN'}
              </button>
            </form>
            <p className="mt-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
              {waitlistCount.toLocaleString()} operators currently in queue
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8"
          >
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="group industrial-border bg-industrial-yellow text-black px-12 py-5 font-mono font-bold text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-white transition-all transform hover:-translate-y-1"
            >
              Access System <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <Link 
              to="/gallery" 
              className="industrial-border px-12 py-5 font-mono font-bold text-sm uppercase tracking-widest text-industrial-yellow hover:border-white hover:text-white transition-all transform hover:-translate-y-1"
            >
              Browse Archives
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Visual Break */}
      <section className="h-64 border-y border-border-subtle bg-industrial-yellow flex items-center overflow-hidden whitespace-nowrap select-none">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-20 text-black font-mono font-black text-6xl italic uppercase opacity-80"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="flex items-center gap-10">
              DEPLOY_MODULES <Zap fill="black" size={48} /> ARCHITECT_VOID <Terminal size={48} />
            </span>
          ))}
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section id="manifesto" className="py-32 px-8 border-t border-border-subtle bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <LandingFeature 
              icon={Cpu}
              title="Primitive DNA"
              desc="Components built from absolute roots. No bloat, no unused styles, just performant DOM structures."
            />
            <LandingFeature 
              icon={Shield}
              title="Enforced Logic"
              desc="Type-safe architecture ensuring every interaction follows the system constraints precisely."
            />
            <LandingFeature 
              icon={Zap}
              title="Instant Flux"
              desc="Deploy modules in seconds. Pre-optimized for production sequences and high-load environments."
            />
            <LandingFeature 
              icon={Layers}
              title="Layered Depth"
              desc="Leverage the industrial-brutalist aesthetic with native support for depth, blur, and high contrast."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-border-subtle text-center">
        <div className="max-w-xl mx-auto space-y-8">
          <div className="font-mono font-bold text-2xl tracking-tighter">
            SYS<span className="text-industrial-yellow">.CORE</span>
          </div>
          <p className="text-xs text-gray-600 font-mono uppercase tracking-[0.3em]">
            System.Interface / 2026 / All Rights Reserved
          </p>
          <div className="flex justify-center gap-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            <a href="#" className="hover:text-white">Status: OK</a>
            <a href="#" className="hover:text-white">API_V2.1</a>
            <a href="#" className="hover:text-white">Changelog</a>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

function LandingFeature({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="space-y-4 group">
      <div className="w-12 h-12 bg-industrial-yellow/10 border border-industrial-yellow/30 flex items-center justify-center group-hover:bg-industrial-yellow group-hover:text-black transition-all">
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <h3 className="font-mono font-bold text-white uppercase tracking-tighter text-lg">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed font-sans uppercase">
        {desc}
      </p>
    </div>
  );
}
