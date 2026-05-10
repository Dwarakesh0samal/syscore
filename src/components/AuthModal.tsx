import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'login' | 'register';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, register } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    displayName: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (activeTab === 'login') {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register({
          email: formData.email,
          username: formData.username.toLowerCase().replace(/\s/g, ''),
          password: formData.password,
          display_name: formData.displayName
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="relative w-full max-w-md bg-[#111] border border-[#2a2a2a] shadow-2xl overflow-hidden"
          >
            {/* Header Tabs */}
            <div className="flex border-b border-[#2a2a2a]">
              <button 
                onClick={() => setActiveTab('login')}
                className={cn(
                  "flex-1 py-4 font-mono text-[11px] uppercase tracking-widest transition-all",
                  activeTab === 'login' ? "text-industrial-yellow border-b-2 border-industrial-yellow" : "text-gray-500 hover:text-white"
                )}
              >
                Login
              </button>
              <button 
                onClick={() => setActiveTab('register')}
                className={cn(
                  "flex-1 py-4 font-mono text-[11px] uppercase tracking-widest transition-all",
                  activeTab === 'register' ? "text-industrial-yellow border-b-2 border-industrial-yellow" : "text-gray-500 hover:text-white"
                )}
              >
                Register
              </button>
              <button 
                onClick={onClose}
                className="px-4 text-gray-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {activeTab === 'register' && (
                <>
                  <div className="space-y-2">
                    <label className="block font-mono text-[11px] uppercase text-gray-500 tracking-widest">Display Name</label>
                    <input 
                      name="displayName"
                      required
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] p-3 font-mono text-sm text-white focus:outline-none focus:border-industrial-yellow transition-colors"
                      placeholder="OPERATOR_NAME"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-mono text-[11px] uppercase text-gray-500 tracking-widest">Username</label>
                    <input 
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] p-3 font-mono text-sm text-white focus:outline-none focus:border-industrial-yellow transition-colors"
                      placeholder="SYS_HANDLE"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="block font-mono text-[11px] uppercase text-gray-500 tracking-widest">Email Address</label>
                <input 
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] p-3 font-mono text-sm text-white focus:outline-none focus:border-industrial-yellow transition-colors"
                  placeholder="IDENTITY@CORE.IO"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-[11px] uppercase text-gray-500 tracking-widest">Security Code</label>
                <input 
                  type="password"
                  name="password"
                  required
                  minLength={activeTab === 'register' ? 8 : undefined}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] p-3 font-mono text-sm text-white focus:outline-none focus:border-industrial-yellow transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-xs font-mono uppercase">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-industrial-yellow text-black font-mono font-bold py-4 text-xs uppercase tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Processing...' : activeTab === 'login' ? 'Initialize_Session' : 'Create_Identity'}
              </button>

              <div className="text-center pt-2">
                <button 
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
                  className="font-mono text-[10px] text-gray-500 uppercase tracking-widest hover:text-industrial-yellow transition-colors underline underline-offset-4"
                >
                  {activeTab === 'login' ? "Don't have an identity? Register" : "Already registered? Login"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
