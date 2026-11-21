import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, User, Phone, AlertCircle, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { user, login, register, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      if (isAdmin) navigate('/admin/dashboard', { replace: true });
      else navigate('/account', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const loggedUser = await login(email, password);
      if (loggedUser && (loggedUser.role === 'super_admin' || loggedUser.role === 'staff')) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        const from = location.state?.from || '/account';
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(regName, regEmail, regPassword, regPhone);
      navigate('/account', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAdmin = () => { setIsRegister(false); setEmail('admin@colorlex.com'); setPassword('admin123'); };
  const fillDemoStaff = () => { setIsRegister(false); setEmail('staff@colorlex.com'); setPassword('staff123'); };
  const fillDemoCustomer = () => { setIsRegister(false); setEmail('customer@colorlex.com'); setPassword('customer123'); };

  const inputCls = "w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition";

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-950">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-800/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-800 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/images/logo.png" alt="ColorLex Logo" className="w-36 h-36 mx-auto rounded-3xl object-contain shadow-lg mb-4" />
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {isRegister ? 'Create ColorLex Account' : 'Sign In to ColorLex'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isRegister ? 'Join our premium custom digital print studio' : 'Access order history, approvals & dashboard'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl mb-6 border border-slate-800">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${!isRegister ? 'bg-slate-800 text-white shadow-md border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${isRegister ? 'bg-slate-800 text-white shadow-md border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Register Account
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!isRegister ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@domain.com" className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} />
              </div>
            </div>
            <button type="submit" disabled={submitting} className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 text-sm">
              <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {[
              { label: 'Full Name', icon: User, type: 'text', value: regName, onChange: setRegName, placeholder: 'John Doe' },
              { label: 'Email Address', icon: Mail, type: 'email', value: regEmail, onChange: setRegEmail, placeholder: 'customer@domain.com' },
              { label: 'Phone Number', icon: Phone, type: 'tel', value: regPhone, onChange: setRegPhone, placeholder: '+91 98765 43210', required: false },
              { label: 'Password', icon: Lock, type: 'password', value: regPassword, onChange: setRegPassword, placeholder: '••••••••' },
            ].map(({ label, icon: Icon, type, value, onChange, placeholder, required = true }) => (
              <div key={label}>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">{label}</label>
                <div className="relative">
                  <Icon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
                </div>
              </div>
            ))}
            <button type="submit" disabled={submitting} className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 text-sm">
              <span>{submitting ? 'Creating Account...' : 'Register Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Demo Credentials */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex items-center space-x-1.5 text-xs text-purple-400 font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Demo Login Credentials</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button type="button" onClick={fillDemoAdmin} className="text-left p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-[11px] transition-all">
              <span className="font-bold text-purple-400 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Admin</span>
              <span className="text-slate-400 block truncate text-[10px]">admin@colorlex.com</span>
            </button>
            <button type="button" onClick={fillDemoStaff} className="text-left p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-[11px] transition-all">
              <span className="font-bold text-indigo-400 block">Staff</span>
              <span className="text-slate-400 block truncate text-[10px]">staff@colorlex.com</span>
            </button>
            <button type="button" onClick={fillDemoCustomer} className="text-left p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-pink-500/50 text-[11px] transition-all">
              <span className="font-bold text-pink-400 block">Customer</span>
              <span className="text-slate-400 block truncate text-[10px]">customer@colorlex.com</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
