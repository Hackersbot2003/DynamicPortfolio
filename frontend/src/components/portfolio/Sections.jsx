import { useState, useRef, useEffect } from 'react';
export { default as Platforms } from './Platforms';
import { ExternalLink, Github, Download, Play, X, ChevronLeft, ChevronRight, Sparkles, Zap, Send, CheckCircle } from 'lucide-react';

/* ─── helpers ─── */
function SectionTitle({ children, handwritten }) {
  return (
    <h2 className="section-title">
      <span className="title-bar" />
      {handwritten
        ? <span className="title-handwritten">{children}</span>
        : <span className="font-bold" style={{ letterSpacing: '-0.02em' }}>{children}</span>
      }
    </h2>
  );
}

/* ─── IMAGE CAROUSEL ─── */
function Carousel({ photos, alt }) {
  const [idx, setIdx] = useState(0);
  if (!photos?.length) return null;
  const prev = () => setIdx(i => (i - 1 + photos.length) % photos.length);
  const next = () => setIdx(i => (i + 1) % photos.length);
  return (
    <div className="relative overflow-hidden rounded-2xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="carousel-track" style={{ transform: `translateX(-${idx * 100}%)` }}>
        {photos.map((src, i) => (
          <img key={i} src={src} alt={`${alt} ${i + 1}`} className="carousel-img object-cover"
            style={{ height: '220px', objectFit: 'cover' }} />
        ))}
      </div>
      {photos.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
            style={{ background: 'rgba(8,16,32,0.75)', border: '1px solid rgba(56,139,253,0.3)', color: 'var(--accent-bright)' }}>
            <ChevronLeft size={14} />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
            style={{ background: 'rgba(8,16,32,0.75)', border: '1px solid rgba(56,139,253,0.3)', color: 'var(--accent-bright)' }}>
            <ChevronRight size={14} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {photos.map((_, i) => (
              <div key={i} onClick={() => setIdx(i)} className="cursor-pointer rounded-full transition-all duration-200"
                style={{ width: i === idx ? 16 : 6, height: 6, background: i === idx ? 'var(--accent-bright)' : 'rgba(255,255,255,0.3)' }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── PROJECT MODAL (glassmorphism z-index) ─── */
function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="project-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="project-modal">
        {/* Glow accent top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(56,139,253,0.6), transparent)' }} />

        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>{project.title}</h3>
            <div className="flex items-center gap-2">
              {project.status === 'completed' && <span className="badge-completed">✓ Completed</span>}
              {project.status === 'in-progress' && <span className="badge-in-progress">⚡ In Progress</span>}
              {project.status === 'archived' && <span className="badge-archived">Archived</span>}
              {project.topic && (
                <span className="text-[0.65rem] px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: 'var(--accent-light)', color: 'var(--accent-bright)', border: '1px solid rgba(56,139,253,0.2)' }}>
                  {project.topic}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-md)', color: 'var(--text-muted)' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(248,81,73,0.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
            <X size={14} />
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* Carousel */}
          {project.photos?.length > 0 && <div className="mb-5"><Carousel photos={project.photos} alt={project.title} /></div>}

          {/* Description */}
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            {project.description}
          </p>

          {/* Features */}
          {project.features?.length > 0 && (
            <div className="mb-5">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-dim)' }}>Key Features</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs py-1.5 px-3 rounded-lg"
                    style={{ background: 'rgba(56,139,253,0.04)', border: '1px solid rgba(56,139,253,0.1)' }}>
                    <span style={{ color: 'var(--accent)', marginTop: '2px' }}>▸</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack */}
          {project.techStack?.length > 0 && (
            <div className="mb-5">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-dim)' }}>Tech Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((t, i) => (
                  <span key={i} className="tech-badge">
                    {t.icon && <img src={t.icon} alt={t.name} />} {t.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-2 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="action-btn">
                <Github size={13} /> Source Code
              </a>
            )}
            {project.deployedLink && (
              <a href={project.deployedLink} target="_blank" rel="noopener noreferrer" className="action-btn"
                style={{ background: 'var(--accent-light)', borderColor: 'rgba(56,139,253,0.3)', color: 'var(--accent-bright)' }}>
                <ExternalLink size={13} /> Live Demo
              </a>
            )}
            {project.extraLinks?.map((l, i) => (
              <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="action-btn">
                <ExternalLink size={13} /> {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── PROJECT CARD ─── */
function ProjectCard({ project, onClick }) {
  return (
    <div className="glass-card masonry-item cursor-pointer" onClick={onClick}>
      {project.photos?.[0] && (
        <div className="relative overflow-hidden" style={{ borderRadius: '16px 16px 0 0', height: '160px' }}>
          <img src={project.photos[0]} alt={project.title} className="w-full h-full object-cover transition-transform duration-500"
            style={{ transformOrigin: 'center' }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(4,8,15,0.7) 0%, transparent 55%)' }} />
          <div className="absolute bottom-2 right-2">
            {project.status === 'completed' && <span className="badge-completed">✓ Done</span>}
            {project.status === 'in-progress' && <span className="badge-in-progress">⚡ Live</span>}
          </div>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-sm font-bold mb-1.5 flex items-center justify-between gap-2" style={{ color: 'var(--text)' }}>
          {project.title}
          <ExternalLink size={11} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
        </h3>
        <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
          {project.description}
        </p>
        {project.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.techStack.slice(0, 4).map((t, i) => (
              <span key={i} className="tech-badge">{t.icon && <img src={t.icon} alt={t.name} />}{t.name}</span>
            ))}
            {project.techStack.length > 4 && (
              <span className="tech-badge" style={{ color: 'var(--text-dim)' }}>+{project.techStack.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── STATUS BADGE ─── */
function StatusBadge({ status }) {
  if (status === 'completed') return <span className="badge-completed">✓ Completed</span>;
  if (status === 'in-progress') return <span className="badge-in-progress">⚡ In Progress</span>;
  return <span className="badge-archived">Archived</span>;
}

/* ═══════════════════════════════════════════
   EXPORTED SECTIONS
═══════════════════════════════════════════ */

export function About({ profile }) {
  if (!profile) return null;
  return (
    <section id="about" className="section fade-in">
      <SectionTitle handwritten>About Me</SectionTitle>
      <div className="glass-card p-6">
        <div className="flex items-start gap-5">
          {profile.institutionIcon && (
            <img src={profile.institutionIcon} alt="institution"
              className="w-14 h-14 rounded-2xl object-contain p-2 shrink-0"
              style={{ border: '1px solid var(--border-md)', background: 'rgba(255,255,255,0.04)' }} />
          )}
          <div>
            {profile.institution && (
              <span className="inline-block text-xs px-3 py-1 rounded-lg font-medium mb-3"
                style={{ background: 'var(--accent-light)', color: 'var(--accent-bright)', border: '1px solid rgba(56,139,253,0.2)' }}>
                🎓 {profile.institution}
              </span>
            )}
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: 1.85 }}>
              {profile.bio}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Experience({ experience }) {
  return (
    <section id="experience" className="section py-20 px-6">
      <SectionTitle>Experience</SectionTitle>
      
      <div className="max-w-3xl mx-auto relative">
        {/* The Vertical "Running" Line */}
        <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500 via-purple-500 to-transparent opacity-30" />

        {experience.map((exp, idx) => (
          <div key={exp._id} className={`relative mb-12 flex flex-col md:flex-row items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
            
            {/* The Glowing Dot */}
            <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[#040709] border-2 border-blue-500 z-10 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />

            {/* Content Card */}
            <div className="w-full md:w-[45%] ml-8 md:ml-0">
              <div className="glass-card p-6 hover:translate-y-[-5px] transition-transform duration-300 group">
                <span className="text-[10px] font-mono text-blue-400 tracking-widest uppercase">{exp.duration}</span>
                <h3 className="text-xl font-bold text-white mt-1 group-hover:text-blue-400 transition-colors">{exp.role}</h3>
                <p className="text-gray-400 font-medium mb-3">{exp.company}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{exp.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-4">
                   {exp.techStack?.map((t, i) => (
                     <span key={i} className="text-[10px] text-gray-400 border border-white/10 px-2 py-1 rounded">
                       {t.name}
                     </span>
                   ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TechStack({ profile }) {
  const skills = profile?.skills || [];
  if (!skills.length) return null;
  return (
    <section id="techstack" className="section">
      <SectionTitle>Tech Stack</SectionTitle>
      <div className="flex flex-col gap-4">
        {skills.map((group, gi) => (
          <div key={gi} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={13} style={{ color: 'var(--accent)' }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{group.category}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.items?.map((item, ii) => (
                <span key={ii} className="tech-badge">
                  {item.icon && <img src={item.icon} alt={item.name} />}{item.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Projects({ projects }) {
  const [selected, setSelected] = useState(null);

  return (
    <section id="projects" className="section px-4">
      <SectionTitle handwritten>Featured Works</SectionTitle>
      
      {/* Pinterest Masonry Container */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {projects.map((project) => (
          <div 
            key={project._id}
            onClick={() => setSelected(project)}
            className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer border border-white/5 bg-[#0a0c10] hover:border-white/20 transition-all duration-300"
          >
            {/* Image Handling */}
            {project.photos?.[0] && (
              <img 
                src={project.photos[0]} 
                alt={project.title}
                className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            )}
            
            {/* Hover Content */}
            <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-bold text-lg">{project.title}</h3>
              <p className="text-gray-400 text-xs mt-1 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {project.techStack?.slice(0, 3).map((t, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/5">
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

export function Achievements({ achievements }) {
  if (!achievements?.length) return null;
  return (
    <section id="achievements" className="section">
      <SectionTitle>Achievements</SectionTitle>
      <div className="flex flex-col gap-3">
        {achievements.map((item, idx) => (
          <div key={item._id} className="glass-card flex items-start gap-4 p-4">
            {item.icon
              ? <img src={item.icon} alt="" className="w-10 h-10 object-contain shrink-0 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-md)' }} />
              : <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--yellow-bg)', border: '1px solid rgba(227,179,65,0.2)' }}>
                  <Sparkles size={15} style={{ color: 'var(--yellow)' }} />
                </div>
            }
            <div className="flex-1">
              <div className="flex justify-between items-start flex-wrap gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>{item.title}</span>
                  {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}><ExternalLink size={11} /></a>}
                </div>
                {item.date && (
                  <span className="text-[0.65rem] font-mono px-2 py-0.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                    {item.date}
                  </span>
                )}
              </div>
              {item.description && <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Blogs({ blogs }) {
  const pub = blogs?.filter(b => b.published);
  if (!pub?.length) return null;
  return (
    <section id="blogs" className="section">
      <SectionTitle handwritten>Blogs</SectionTitle>
      <div className="masonry">
        {pub.map((blog) => (
          <div key={blog._id} className="glass-card masonry-item overflow-hidden">
            {blog.coverImage && (
              <div className="overflow-hidden" style={{ height: 150 }}>
                <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
            )}
            <div className="p-4">
              {blog.topic && (
                <span className="inline-block text-[0.62rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-2"
                  style={{ background: 'var(--accent-light)', color: 'var(--accent-bright)' }}>
                  {blog.topic}
                </span>
              )}
              <h3 className="text-sm font-bold leading-snug mb-2" style={{ color: 'var(--text)' }}>{blog.title}</h3>
              {blog.description && <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-muted)', lineHeight: 1.65 }}>{blog.description}</p>}
              {blog.publishedAt && <p className="text-[0.65rem] font-mono mb-3" style={{ color: 'var(--text-dim)' }}>{blog.publishedAt}</p>}
              <div className="flex flex-wrap gap-1.5">
                {blog.platforms?.map((pl, i) => (
                  <a key={i} href={pl.url} target="_blank" rel="noopener noreferrer" className="action-btn">
                    {pl.icon && <img src={pl.icon} alt={pl.name} className="w-3 h-3 object-contain" />} {pl.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Resume({ profile }) {
  if (!profile?.resume) return null;
  return (
    <section id="resume" className="section">
      <SectionTitle>Resume</SectionTitle>
      <div className="glass-card p-6">
        <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>Download or view my complete resume.</p>
        <div className="flex gap-3">
          <a href={profile.resume} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 py-2.5 px-6 rounded-xl text-sm font-semibold no-underline transition-all duration-200"
            style={{ background: 'var(--accent-light)', border: '1px solid rgba(56,139,253,0.3)', color: 'var(--accent-bright)' }}
            onMouseOver={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(56,139,253,0.25)'}
            onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
            <Play size={13} /> View Online
          </a>
          <a href={profile.resume} download className="action-btn" style={{ padding: '0.625rem 1.5rem', fontSize: '0.875rem' }}>
            <Download size={13} /> Download
          </a>
        </div>
      </div>
    </section>
  );
}

export function Contact({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      // Send via mailto as fallback (works without backend)
      // Also try formsubmit.co for actual email delivery
      const res = await fetch('https://formsubmit.co/ajax/482003vinaypatidar@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _subject: `Portfolio Contact from ${form.name}`,
        }),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed');
      }
    } catch {
      // Fallback: open mailto
      const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`);
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
      window.location.href = `mailto:4822003vinaypatidar@gmail.com?subject=${subject}&body=${body}`;
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    }
  };

  return (
    <section id="contact" className="section">
      <SectionTitle handwritten>Get In Touch</SectionTitle>
      <div className="glass-card p-7 max-w-[580px] relative overflow-hidden">
        {/* Subtle glow bg */}
        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(56,139,253,0.06) 0%, transparent 70%)' }} />

        {status === 'success' ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(63,185,80,0.1)', border: '2px solid rgba(63,185,80,0.3)' }}>
              <CheckCircle size={32} style={{ color: 'var(--green)' }} />
            </div>
            <div className="text-center">
              <p className="font-bold text-lg mb-1 handwritten" style={{ color: 'var(--text)', fontSize: '1.5rem' }}>Message Sent!</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                I'll get back to you at <span style={{ color: 'var(--accent-bright)' }}>4822003vinaypatidar@gmail.com</span>
              </p>
            </div>
            <button onClick={() => setStatus('idle')}
              className="text-xs py-1.5 px-4 rounded-lg transition-all duration-200 cursor-pointer"
              style={{ border: '1px solid var(--border-md)', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)' }}>
              Send another
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
              Open to collaborations, internships, and interesting conversations. I'll reply ASAP!
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-dim)' }}>Name</label>
                  <input type="text" className="input" placeholder="Your name" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-dim)' }}>Email</label>
                  <input type="email" className="input" placeholder="your@email.com" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="block text-[0.65rem] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-dim)' }}>Message</label>
                <textarea className="input" placeholder="What's on your mind?" rows={4} value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ resize: 'vertical' }} required />
              </div>
              <button type="submit" disabled={status === 'sending'}
                className="flex items-center justify-center gap-2 py-3 text-white border-0 rounded-xl font-bold text-sm cursor-pointer transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #1a6fe0, #388bfd)',
                  opacity: status === 'sending' ? 0.7 : 1,
                  boxShadow: status === 'sending' ? 'none' : '0 4px 20px rgba(56,139,253,0.3)',
                  letterSpacing: '-0.01em',
                }}
                onMouseOver={e => { if (status !== 'sending') e.currentTarget.style.boxShadow = '0 6px 30px rgba(56,139,253,0.45)'; }}
                onMouseOut={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(56,139,253,0.3)'}>
                {status === 'sending'
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.6s linear infinite' }} /> Sending...</>
                  : <><Send size={14} /> Send Message</>
                }
              </button>
            </form>

            {profile?.email && (
              <p className="text-center mt-5 text-[0.7rem]" style={{ color: 'var(--text-dim)' }}>
                Or email directly:{' '}
                <a href={`mailto:${profile.email}`} className="transition-colors duration-150"
                  style={{ color: 'var(--accent)' }}
                  onMouseOver={e => e.currentTarget.style.color = 'var(--accent-bright)'}
                  onMouseOut={e => e.currentTarget.style.color = 'var(--accent)'}>
                  {profile.email}
                </a>
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
