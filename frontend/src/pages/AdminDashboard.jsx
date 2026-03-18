import { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, User, Briefcase, Trophy, FolderOpen, Globe, BookOpen, Cpu, LogOut, Sun, Moon, ExternalLink, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AdminOverview from '../components/admin/AdminOverview';
import AdminProfile from '../components/admin/AdminProfile';
import AdminExperience from '../components/admin/AdminExperience';
import AdminAchievements from '../components/admin/AdminAchievements';
import AdminProjects from '../components/admin/AdminProjects';
import AdminPlatforms from '../components/admin/AdminPlatforms';
import AdminBlogs from '../components/admin/AdminBlogs';
import AdminTech from '../components/admin/AdminTech';

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/admin/profile', icon: User, label: 'Profile' },
  { to: '/admin/experience', icon: Briefcase, label: 'Experience' },
  { to: '/admin/achievements', icon: Trophy, label: 'Achievements' },
  { to: '/admin/projects', icon: FolderOpen, label: 'Projects' },
  { to: '/admin/platforms', icon: Globe, label: 'Platforms' },
  { to: '/admin/blogs', icon: BookOpen, label: 'Blogs' },
  { to: '/admin/tech', icon: Cpu, label: 'Tech Registry' },
];

function AdminSidebarNav() {
  const { logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  return (
    <aside className="admin-sidebar">
      <div>
        <div className="flex items-center gap-2.5 mb-7 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent-light)', border: '1px solid rgba(99,179,237,0.3)' }}>
            <Sparkles size={14} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>Admin Panel</p>
            <p className="text-[0.65rem]" style={{ color: 'var(--text-dim)' }}>Portfolio CMS</p>
          </div>
        </div>

        <p className="text-[0.6rem] font-semibold uppercase tracking-widest mb-2 px-3" style={{ color: 'var(--text-dim)' }}>Menu</p>
        <nav className="flex flex-col gap-0.5">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
              <Icon size={14} />{label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-1 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        <a href="/" target="_blank" rel="noopener noreferrer" className="admin-nav-link">
          <ExternalLink size={13} /> View Site
        </a>
        <button onClick={toggle} className="admin-nav-link">
          {dark ? <Sun size={13} /> : <Moon size={13} />} {dark ? 'Light' : 'Dark'}
        </button>
        <button onClick={() => { logout(); navigate('/admin/login'); }} className="admin-nav-link"
          style={{ color: 'var(--red)' }}
          onMouseOver={e => { e.currentTarget.style.background = 'var(--red-bg)'; e.currentTarget.style.color = 'var(--red)'; }}
          onMouseOut={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--red)'; }}>
          <LogOut size={13} /> Logout
        </button>
      </div>
    </aside>
  );
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-deep)' }}>
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40"
          style={{ background: 'rgba(4,7,9,0.7)', backdropFilter: 'blur(4px)' }} />
      )}

      {/* Mobile drawer */}
      <div className="md:hidden fixed top-0 left-0 bottom-0 z-50 transition-transform duration-300 ease-in-out"
        style={{ transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        <AdminSidebarNav />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block shrink-0 w-[220px]">
        <div className="sticky top-0 h-screen">
          <AdminSidebarNav />
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 px-5 py-3 sticky top-0 z-30"
          style={{ borderBottom: '1px solid var(--border)', background: 'rgba(7,11,20,0.9)', backdropFilter: 'blur(20px)' }}>
          <button onClick={() => setSidebarOpen(o => !o)}
            className="flex items-center p-1.5 rounded-xl cursor-pointer"
            style={{ border: '1px solid var(--border-md)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}>
            {sidebarOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
          <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Admin Panel</span>
        </div>

        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="achievements" element={<AdminAchievements />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="platforms" element={<AdminPlatforms />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="tech" element={<AdminTech />} />
        </Routes>
      </div>
    </div>
  );
}
