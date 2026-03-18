import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { Sun, Moon, Sparkles, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const { login } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch { toast.error('Invalid credentials'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative" style={{ background: 'var(--bg-deep)' }}>
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,179,237,0.05) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(183,148,244,0.04) 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />

      {/* Theme toggle */}
      <button onClick={toggle}
        className="fixed top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl cursor-pointer transition-all duration-200"
        style={{ border: '1px solid var(--border-md)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}>
        {dark ? <Sun size={13} /> : <Moon size={13} />}
      </button>

      <div className="w-full max-w-[380px] relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(99,179,237,0.2), rgba(183,148,244,0.2))', border: '1px solid rgba(99,179,237,0.3)' }}>
            <Sparkles size={18} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Admin Panel</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Portfolio management</p>
          </div>
        </div>

        {/* Card */}
        <div className="glass-card p-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Email
              </label>
              <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@portfolio.com" required />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Password
              </label>
              <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading}
              className="mt-2 py-3 text-white border-0 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, rgba(99,179,237,0.8), rgba(183,148,244,0.8))',
                opacity: loading ? 0.7 : 1,
                boxShadow: loading ? 'none' : '0 4px 20px rgba(99,179,237,0.25)',
              }}>
              {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={14} /></>}
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-xs" style={{ color: 'var(--text-muted)' }}>
          <a href="/" className="transition-colors duration-150"
            style={{ color: 'var(--accent)' }}
            onMouseOver={e => e.currentTarget.style.color = 'var(--accent-bright)'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--accent)'}>
            ← Back to portfolio
          </a>
        </p>
      </div>
    </div>
  );
}
