import { useEffect, useState } from 'react';
import { ExternalLink, Home, Briefcase, Code2, FolderOpen, Trophy, Globe, BookOpen, FileText, Mail, ChevronRight } from 'lucide-react';

const NAV = [
  { id: 'about',        label: 'About',        icon: Home },
  { id: 'experience',   label: 'Experience',   icon: Briefcase },
  { id: 'techstack',    label: 'Tech Stack',   icon: Code2 },
  { id: 'projects',     label: 'Projects',     icon: FolderOpen },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'platforms',    label: 'Platforms',    icon: Globe },
  { id: 'blogs',        label: 'Blogs',        icon: BookOpen },
  { id: 'resume',       label: 'Resume',       icon: FileText },
  { id: 'contact',      label: 'Contact',      icon: Mail },
];

const SOCIAL_ICONS = {
  leetcode: { label: 'LeetCode', color: '#FFA116', svg: <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/></svg> },
  github:   { label: 'GitHub',   color: '#e8edf5', svg: <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg> },
  linkedin: { label: 'LinkedIn', color: '#0ea5e9', svg: <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  twitter:  { label: 'Twitter',  color: '#1d9bf0', svg: <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  discord:  { label: 'Discord',  color: '#5865f2', svg: <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.119 18.1.141 18.113a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg> },
};

export default function Sidebar({ profile, open, setOpen }) {
  const [active, setActive] = useState('about');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { const v = entries.find(e => e.isIntersecting); if (v) setActive(v.target.id); },
      { rootMargin: '-20% 0px -65% 0px' }
    );
    NAV.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setOpen(false);
  };

  return (
    <aside className={`portfolio-sidebar${open ? ' open' : ''}`}>
      {/* Avatar */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative mb-4">
          {profile?.avatar
            ? <img src={profile.avatar} alt={profile?.name} className="w-[82px] h-[82px] rounded-full object-cover avatar-ring" />
            : <div className="w-[82px] h-[82px] rounded-full flex items-center justify-center text-3xl font-black avatar-ring"
                style={{ background: 'rgba(56,139,253,0.1)', color: 'var(--accent)' }}>
                {profile?.name?.charAt(0) || 'P'}
              </div>
          }
          <div className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-[#020508]"
            style={{ background: 'var(--green)', boxShadow: '0 0 8px rgba(63,185,80,0.7)' }} />
        </div>

        <h2 className="text-base font-bold tracking-tight mb-0.5" style={{ color: 'var(--text)' }}>
          {profile?.name || 'Your Name'}
        </h2>
        {profile?.title && (
          <p className="text-xs font-semibold mb-1 handwritten" style={{ color: 'var(--accent-bright)', fontSize: '0.85rem' }}>
            {profile.title}
          </p>
        )}
        {profile?.location && (
          <p className="text-[0.7rem]" style={{ color: 'var(--text-muted)' }}>📍 {profile.location}</p>
        )}
      </div>

      {profile?.bio && (
        <p className="text-[0.73rem] leading-relaxed text-center mb-5 px-1" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
          {profile.bio}
        </p>
      )}

      {/* Socials */}
      {profile?.socials && (
        <div className="flex flex-wrap justify-center gap-1.5 mb-5">
          {Object.entries(profile.socials).filter(([, v]) => v).map(([key, url]) => {
            const meta = SOCIAL_ICONS[key];
            if (!meta) return null;
            return (
              <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="social-link">
                <span style={{ color: meta.color }}>{meta.svg}</span> {meta.label}
              </a>
            );
          })}
        </div>
      )}

      {/* Resume */}
      {profile?.resume && (
        <a href={profile.resume} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold no-underline mb-5 rounded-xl w-full transition-all duration-200"
          style={{ background: 'linear-gradient(135deg, rgba(56,139,253,0.12), rgba(163,113,247,0.12))', border: '1px solid rgba(56,139,253,0.25)', color: 'var(--accent-bright)' }}
          onMouseOver={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(56,139,253,0.2)'; }}
          onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; }}>
          <ExternalLink size={12} /> View Resume
        </a>
      )}

      <div className="glow-divider" />

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => scrollTo(id)} className={`nav-link${active === id ? ' active' : ''}`}>
            <Icon size={13} style={{ opacity: active === id ? 1 : 0.45 }} />
            {label}
            {active === id && <ChevronRight size={11} className="ml-auto opacity-50" />}
          </button>
        ))}
      </nav>

      {/* Admin link only */}
      <div className="mt-5 pt-4 flex justify-center" style={{ borderTop: '1px solid var(--border)' }}>
        <a href="/admin/login" className="text-[0.65rem] no-underline px-3 py-1 rounded-lg transition-colors duration-150"
          style={{ color: 'var(--text-dim)', border: '1px solid var(--border)' }}
          onMouseOver={e => e.currentTarget.style.color = 'var(--text-muted)'}
          onMouseOut={e => e.currentTarget.style.color = 'var(--text-dim)'}>
          ⚙ admin
        </a>
      </div>
    </aside>
  );
}
