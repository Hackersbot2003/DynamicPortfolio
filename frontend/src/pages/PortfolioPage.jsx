import { useEffect, useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import api from '../utils/api';
import Sidebar from '../components/portfolio/Sidebar';
import { About, Experience, TechStack, Projects, Achievements, Blogs, Resume, Contact } from '../components/portfolio/Sections';
import Platforms from '../components/portfolio/Platforms';

export default function PortfolioPage() {
  const [profile, setProfile] = useState(null);
  const [experience, setExperience] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [projects, setProjects] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [p, e, a, pr, pl, b] = await Promise.allSettled([
          api.get('/profile'), api.get('/experience'), api.get('/achievements'),
          api.get('/projects'), api.get('/platforms'), api.get('/blogs'),
        ]);
        if (p.status === 'fulfilled') setProfile(p.value.data);
        if (e.status === 'fulfilled') setExperience(e.value.data || []);
        if (a.status === 'fulfilled') setAchievements(a.value.data || []);
        if (pr.status === 'fulfilled') setProjects(pr.value.data || []);
        if (pl.status === 'fulfilled') setPlatforms(pl.value.data || []);
        if (b.status === 'fulfilled') setBlogs(b.value.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        {/* Animated loading */}
        <div className="flex gap-1.5">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full"
              style={{
                background: 'var(--accent)',
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
          ))}
        </div>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Loading portfolio...</p>
        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); opacity: 0.4; }
            50% { transform: translateY(-8px); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="portfolio-layout">
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40" style={{ background: 'rgba(4,7,9,0.7)', backdropFilter: 'blur(4px)' }} />
      )}

      {/* Mobile topbar */}
      <div className="mobile-topbar">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent-light)', border: '1px solid rgba(99,179,237,0.3)' }}>
            <Sparkles size={14} style={{ color: 'var(--accent)' }} />
          </div>
          <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
            {profile?.name || 'Portfolio'}
          </span>
        </div>
        <button onClick={() => setSidebarOpen(o => !o)}
          className="flex items-center p-2 rounded-xl cursor-pointer transition-all duration-200"
          style={{ border: '1px solid var(--border-md)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
          {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      <Sidebar profile={profile} open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="portfolio-main">
        <About profile={profile} />
        <Experience experience={experience} />
        <TechStack profile={profile} />
        <Projects projects={projects} />
        <Achievements achievements={achievements} />
        <Platforms platforms={platforms} />
        <Blogs blogs={blogs} />
        <Resume profile={profile} />
        <Contact profile={profile} />
      </main>
    </div>
  );
}


