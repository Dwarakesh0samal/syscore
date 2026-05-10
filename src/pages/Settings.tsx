import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, 
  Key, 
  CreditCard, 
  Trash2, 
  Plus, 
  RefreshCw, 
  ChevronRight,
  Shield,
  Zap,
  Check,
  Copy,
  AlertCircle,
  X,
  Loader2
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { keysAPI, billingAPI, userAPI, ApiKey } from '../lib/api';

const TABS = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'keys', label: 'API Keys', icon: Key },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth();

  return (
    <Layout>
      <div className="space-y-12">
        <div className="space-y-2 border-b border-border-subtle pb-8">
          <h1 className="text-4xl font-mono font-bold text-white uppercase tracking-tighter">System Settings</h1>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Operator Configuration / ID: {user?.id || 'GHOST_SESSION'}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Settings Sidebar */}
          <div className="w-full lg:w-64 space-y-2">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center justify-between px-6 py-4 font-mono text-xs uppercase tracking-widest border transition-all",
                  activeTab === tab.id 
                    ? "bg-industrial-yellow text-black border-industrial-yellow" 
                    : "bg-card-bg text-gray-500 border-border-subtle hover:text-gray-200 hover:border-gray-700"
                )}
              >
                <div className="flex items-center gap-3">
                  <tab.icon size={16} />
                  {tab.label}
                </div>
                <ChevronRight size={14} className={activeTab === tab.id ? "opacity-100" : "opacity-0"} />
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="flex-1 min-h-[600px]">
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'keys' && <ApiKeysTab />}
            {activeTab === 'billing' && <BillingTab />}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ProfileTab() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    display_name: user?.display_name || '',
    username: user?.username || '',
    bio: user?.bio || ''
  });
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await updateUser(formData);
      alert('PROFILE_SYNC_COMPLETE');
    } catch (error: any) {
      alert(`ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('ERROR: FILE_TOO_LARGE (MAX 2MB)');
      return;
    }

    try {
      const response = await userAPI.uploadAvatar(file);
      await updateUser({ ...formData }); // Refresh user state
      alert('AVATAR_SYNCED');
    } catch (error: any) {
      alert(`ERROR: ${error.message}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="industrial-border p-8 bg-card-bg space-y-8">
        <div className="flex items-center gap-8">
          <div className="w-24 h-24 bg-core-bg border border-border-subtle flex items-center justify-center relative group">
            {user?.avatar_url ? (
              <img src={`${import.meta.env.VITE_API_URL.replace('/api/v1', '')}${user.avatar_url}`} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={48} className="text-gray-700" />
            )}
            <label className="absolute inset-0 bg-industrial-yellow/80 text-black font-mono font-bold text-[10px] uppercase tracking-widest flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              Update
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            </label>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-mono font-bold text-white uppercase tracking-tighter">{user?.display_name || 'OPERATOR_00'}</h3>
            <p className="text-sm text-gray-500 font-mono">{user?.email || 'N/A'}</p>
            <div className="flex gap-2 mt-2">
               <span className="bg-industrial-yellow/10 text-industrial-yellow border border-industrial-yellow/30 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1">
                 <Zap size={10} /> {user?.plan || 'FREE'} Tier
               </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Display Name</label>
            <input 
              value={formData.display_name} 
              onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
              className="industrial-input w-full" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Username</label>
            <input 
              value={formData.username} 
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="industrial-input w-full" 
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Bio / Mission Statement</label>
            <textarea 
              value={formData.bio} 
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="industrial-input w-full min-h-[100px] resize-none" 
            />
          </div>
        </div>

        <button 
          onClick={handleUpdateProfile}
          disabled={loading}
          className="industrial-button w-full sm:w-auto px-12 mt-4 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Save Configuration
        </button>
      </div>

      <div className="industrial-border p-8 bg-card-bg/20 space-y-4">
        <h3 className="text-sm font-mono font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
          <Trash2 size={16} /> Danger Zone
        </h3>
        <p className="text-xs text-gray-500 font-sans leading-relaxed">
          Terminating your operator profile will permanently wipe all associated API keys, components, and subscription data. This action is irreversible.
        </p>
        <button className="border border-red-900 text-red-900 px-4 py-2 text-[10px] font-mono uppercase tracking-widest hover:bg-red-900 hover:text-white transition-colors">
          Initialize Deletion Sequence
        </button>
      </div>
    </motion.div>
  );
}

function ApiKeysTab() {
  const { user } = useAuth();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyData, setNewKeyData] = useState<{key: string} | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const response = await keysAPI.list();
      setKeys(response.data);
    } catch (error) {
      console.error('Failed to fetch keys');
    }
  };

  const handleGenerateKey = async () => {
    setIsCreating(true);
    try {
      const response = await keysAPI.generate();
      setNewKeyData(response.data);
      fetchKeys();
    } catch (error: any) {
      alert(`ERROR: ${error.response?.data?.error || 'Generation failed'}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm('CONFIRM_REVOCATION_SEQUENCE?')) return;
    try {
      await keysAPI.revoke(id);
      setKeys(prev => prev.filter(k => k.id !== id));
    } catch (error) {
      alert('ERROR: REVOCATION_FAILED');
    }
  };

  const keyLimit = user?.plan === 'pro' ? 10 : 2;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-xl font-mono font-bold text-white uppercase tracking-tighter">API Access Keys</h3>
          <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-widest">
            Active Keys: {keys.length} / Limit: {keyLimit}
          </p>
        </div>
        <button 
          onClick={handleGenerateKey}
          disabled={isCreating || keys.length >= keyLimit}
          className={cn(
            "industrial-button flex items-center gap-2 border-industrial-yellow disabled:opacity-50",
            keys.length >= keyLimit && "border-gray-800 text-gray-700"
          )}
        >
           {isCreating ? <RefreshCw size={16} className="animate-spin" /> : <Plus size={16} />} 
           {keys.length >= keyLimit ? 'LIMIT_REACHED' : 'GENERATE_NEW_KEY'}
        </button>
      </div>

      <div className="space-y-4">
        {keys.map(key => (
          <div key={key.id} className="industrial-border p-6 bg-card-bg flex flex-col md:flex-row justify-between gap-6 group hover:border-industrial-yellow/50 transition-all">
            <div className="space-y-1">
              <h4 className="font-mono font-bold text-white uppercase tracking-widest text-sm">{key.label || 'SYSTEM_KEY'}</h4>
              <p className="font-mono text-gray-500 text-xs tracking-tighter">{key.key_prefix}••••••••••••••••</p>
              <div className="flex gap-4 mt-3">
                <span className="text-[10px] font-mono text-gray-600 uppercase">Created: {new Date(key.created_at).toLocaleDateString()}</span>
                {key.last_used && <span className="text-[10px] font-mono text-gray-600 uppercase">Last Used: {new Date(key.last_used).toLocaleDateString()}</span>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleDeleteKey(key.id)}
                className="p-2 border border-border-subtle text-gray-500 hover:text-red-500 hover:border-red-500 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {newKeyData && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full bg-[#111] border border-industrial-yellow p-8 space-y-6"
            >
              <div className="flex items-center gap-3 text-industrial-yellow">
                <AlertCircle size={24} />
                <h3 className="font-mono font-bold uppercase tracking-tighter text-xl">SAVE_YOUR_KEY</h3>
              </div>
              <p className="text-xs text-gray-400 font-mono uppercase leading-relaxed">
                This token will only be displayed once. If lost, the sequence must be re-initialized.
              </p>
              <div className="relative">
                <input 
                  readOnly 
                  value={newKeyData.key}
                  className="w-full bg-black border border-[#2a2a2a] p-4 font-mono text-xs text-industrial-yellow pr-12"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(newKeyData.key);
                    alert('COPIED');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <Copy size={18} />
                </button>
              </div>
              <button 
                onClick={() => setNewKeyData(null)}
                className="w-full bg-industrial-yellow text-black font-mono font-bold py-4 text-xs uppercase tracking-widest hover:bg-white transition-colors"
              >
                I_HAVE_SAVED_THE_SEQUENCE
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function BillingTab() {
  const { user } = useAuth();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await billingAPI.status();
      setStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch billing status');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    const priceId = billingCycle === 'monthly' 
      ? import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID 
      : import.meta.env.VITE_STRIPE_ANNUAL_PRICE_ID;
    
    try {
      const response = await billingAPI.createCheckout(priceId, billingCycle);
      window.location.href = response.data.checkout_url;
    } catch (error) {
      alert('BILLING_ERROR: REDIRECT_FAILED');
    }
  };

  const handlePortal = async () => {
    try {
      const response = await billingAPI.portal();
      window.location.href = response.data.portal_url;
    } catch (error) {
      alert('PORTAL_ERROR');
    }
  };

  const handleCancel = async () => {
    if (!confirm('CONFIRM_CANCELLATION?')) return;
    try {
      const response = await billingAPI.cancel();
      alert(`CANCELED: ACCESS_UNTIL_${new Date(response.data.access_until).toLocaleDateString()}`);
      fetchStatus();
    } catch (error) {
      alert('CANCEL_ERROR');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 font-mono text-gray-500 animate-pulse">POLLING_STRIPE_STATUS...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-12"
    >
      {user?.plan === 'free' ? (
        <div className="space-y-8">
           <div className="flex justify-center mb-8">
              <div className="bg-card-bg p-1 border border-border-subtle flex">
                <button 
                  onClick={() => setBillingCycle('monthly')}
                  className={cn("px-6 py-2 font-mono text-[10px] uppercase", billingCycle === 'monthly' ? "bg-industrial-yellow text-black" : "text-gray-500")}
                >Monthly</button>
                <button 
                  onClick={() => setBillingCycle('annual')}
                  className={cn("px-6 py-2 font-mono text-[10px] uppercase", billingCycle === 'annual' ? "bg-industrial-yellow text-black" : "text-gray-500")}
                >Annual (-20%)</button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="industrial-border p-8 bg-card-bg space-y-6 opacity-50">
              <h3 className="text-2xl font-mono font-bold text-white uppercase tracking-tighter">Standard</h3>
              <p className="text-xs text-gray-500 font-mono">Current Tier / Limited Access</p>
              <div className="pt-4 border-t border-border-subtle font-mono text-white">$0.00</div>
            </div>

            <div className="industrial-border p-8 bg-industrial-yellow text-black space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={100} /></div>
              <h3 className="text-2xl font-mono font-bold uppercase tracking-tighter">PRO OPERATOR</h3>
              <p className="text-xs font-medium uppercase leading-relaxed">Unrestricted components, 10 keys, and industrial priority support.</p>
              <div className="pt-4 border-t border-black/10 flex justify-between items-center">
                <span className="font-mono font-bold">{billingCycle === 'monthly' ? '$12.00' : '$99.00'}</span>
                <button 
                  onClick={handleUpgrade}
                  className="bg-black text-industrial-yellow px-6 py-2 font-mono text-[10px] font-bold uppercase hover:bg-white hover:text-black transition-colors"
                >Upgrade_Now</button>
              </div>
            </div>
           </div>
        </div>
      ) : (
        <div className="industrial-border p-8 bg-card-bg space-y-8">
           <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-3xl font-mono font-bold text-white uppercase tracking-tighter">PRO_STATUS: ACTIVE</h3>
                  <span className="bg-industrial-yellow text-black px-2 py-0.5 text-[10px] font-mono font-bold uppercase">PRO</span>
                </div>
                <p className="text-xs font-mono text-gray-500 uppercase">Billing Cycle: {status?.billing_cycle} / Next sync: {new Date(status?.period_end).toLocaleDateString()}</p>
              </div>
              <button 
                onClick={handlePortal}
                className="industrial-button flex items-center gap-2"
              >
                <CreditCard size={14} /> MANAGE_PAYMENTS
              </button>
           </div>

           <div className="pt-8 border-t border-border-subtle flex justify-between items-center">
              <div className="text-xs font-mono text-gray-500 uppercase">Status: {status?.status?.toUpperCase()}</div>
              <button 
                onClick={handleCancel}
                className="text-[10px] font-mono text-red-500/50 hover:text-red-500 uppercase underline"
              >
                Terminate_Subscription
              </button>
           </div>
        </div>
      )}
    </motion.div>
  );
}
