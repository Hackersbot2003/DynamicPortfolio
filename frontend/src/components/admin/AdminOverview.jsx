import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { FolderOpen, Trophy, Briefcase, Globe, BookOpen, User, ExternalLink, TrendingUp, Sparkles } from 'lucide-react';

function Tile({ icon: Icon, label, value, color, gradient }) {
  return (
    <div className="glass-card p-5 flex items-center gap-4 group cursor-default">
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
        style={{ background: gradient || `${color}18`, border: `1px solid ${color}30` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none mb-0.5" style={{ color: 'var(--text)', fontFamily: 'Outfit, sans-serif' }}>{value}</p>
        <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{label}</p>
      </div>
    </div>
  );
}

export default function AdminOverview() {
  const [stats, setStats] = useState({});
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    Promise.allSettled([
      api.get('/projects'), api.get('/experience'), api.get('/achievements'),
      api.get('/platforms'), api.get('/blogs'), api.get('/profile'),
    ]).then(([pr, ex, ac, pl, bl, p]) => {
      setStats({
        projects: pr.status === 'fulfilled' ? pr.value.data.length : 0,
        experience: ex.status === 'fulfilled' ? ex.value.data.length : 0,
        achievements: ac.status === 'fulfilled' ? ac.value.data.length : 0,
        platforms: pl.status === 'fulfilled' ? pl.value.data.length : 0,
        blogs: bl.status === 'fulfilled' ? bl.value.data.length : 0,
      });
      if (p.status === 'fulfilled') setProfile(p.value.data);
    });
  }, []);

  return (
    <div className="p-8 max-w-[900px]">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>
            {profile?.name ? `👋 Welcome back` : 'Overview'}
          </h1>
          {profile?.name && (
            <p className="text-sm" style={{ color: 'var(--accent)' }}>{profile.name}</p>
          )}
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Manage your portfolio content from here
          </p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 py-2 px-4 text-xs rounded-xl no-underline transition-all duration-200"
          style={{
            background: 'var(--accent-light)',
            border: '1px solid rgba(99,179,237,0.3)',
            color: 'var(--accent)',
          }}
          onMouseOver={e => e.currentTarget.style.boxShadow = '0 0 16px rgba(99,179,237,0.2)'}
          onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
          <ExternalLink size={12} /> View Live
        </a>
      </div>

      {/* Stats bento grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        <Tile icon={User} label="Profile" value={1} color="#63b3ed" />
        <Tile icon={Briefcase} label="Experience" value={stats.experience ?? 0} color="#68d391" />
        <Tile icon={FolderOpen} label="Projects" value={stats.projects ?? 0} color="#b794f4" />
        <Tile icon={Trophy} label="Achievements" value={stats.achievements ?? 0} color="#f6d860" />
        <Tile icon={Globe} label="Platforms" value={stats.platforms ?? 0} color="#fc8181" />
        <Tile icon={BookOpen} label="Blogs" value={stats.blogs ?? 0} color="#76e4f7" />
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={14} style={{ color: 'var(--accent)' }} />
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Quick Actions
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            ['Edit Profile', '/admin/profile'],
            ['Add Experience', '/admin/experience'],
            ['Add Project', '/admin/projects'],
            ['Add Blog', '/admin/blogs'],
            ['Add Platform', '/admin/platforms'],
            ['Manage Tech', '/admin/tech'],
          ].map(([label, href]) => (
            <a key={href} href={href}
              className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg text-xs no-underline transition-all duration-200"
              style={{ border: '1px solid var(--border-md)', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(99,179,237,0.4)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-light)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-md)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Setup tip */}
      <div className="p-4 rounded-xl flex items-start gap-3"
        style={{ background: 'rgba(246,216,96,0.05)', border: '1px solid rgba(246,216,96,0.15)' }}>
        <Sparkles size={16} style={{ color: 'var(--yellow)', marginTop: '2px', flexShrink: 0 }} />
        <div>
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--yellow)' }}>First time setup?</p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Start by editing your Profile, then add Experience and Projects. Visit Tech Registry first to add your stack for auto-suggestions.
          </p>
        </div>
      </div>
    </div>
  );
}
