import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Trash2, Edit2, X } from 'lucide-react';

const POPULAR_TECHS = [
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
  { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
  { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg' },
  { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
  { name: 'Rust', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg' },
  { name: 'Go', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg' },
  { name: 'Kotlin', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg' },
  { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
  { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
  { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'Redis', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg' },
  { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
  { name: 'Vue', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
  { name: 'Svelte', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg' },
  { name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
  { name: 'OpenCV', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg' },
  { name: 'Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
  { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
  { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
];

export default function AdminTech() {
  const [techs, setTechs] = useState([]);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState('');

  const load = () => api.get('/tech').then(r => setTechs(r.data));
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!name.trim()) return;
    await api.post('/tech', { name: name.trim(), icon });
    toast.success('Tech saved!');
    setName(''); setIcon(''); setEditId(null);
    load();
  };

  const handleEdit = (t) => { setEditId(t._id); setName(t.name); setIcon(t.icon || ''); };

  const handleUpdate = async () => {
    await api.put(`/tech/${editId}`, { name, icon });
    toast.success('Updated!');
    setName(''); setIcon(''); setEditId(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    await api.delete(`/tech/${id}`);
    toast.success('Deleted'); load();
  };

  const addFromPopular = async (t) => {
    if (techs.find(e => e.name === t.name)) { toast.error('Already exists'); return; }
    await api.post('/tech', t);
    toast.success(`${t.name} added!`);
    load();
  };

  const filtered = techs.filter(t => t.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl mb-0.5 font-display" style={{ color: 'var(--text)' }}>Tech Registry</h1>
        <p className="font-mono text-[0.78rem]" style={{ color: 'var(--text-muted)' }}>
          {techs.length} techs — used as suggestions when adding projects & experience
        </p>
      </div>

      {/* Add / Edit form */}
      <div className="card p-5 mb-6">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] mb-3" style={{ color: 'var(--text-muted)' }}>
          {editId ? 'Edit Tech' : 'Add Tech'}
        </p>
        <div className="flex flex-wrap gap-2">
          <input className="input flex-[2] min-w-[140px]" value={name} onChange={e => setName(e.target.value)} placeholder="Tech name (e.g. React)" />
          <input className="input flex-[3] min-w-[200px]" value={icon} onChange={e => setIcon(e.target.value)} placeholder="Icon URL (devicon or custom)" />
          {icon && (
            <img src={icon} alt="" className="w-[34px] h-[34px] rounded-[6px] object-contain p-[3px]"
              style={{ border: '1px solid var(--border)', background: 'var(--bg-hover)' }} />
          )}
          <button onClick={editId ? handleUpdate : handleAdd}
            className="py-2.5 px-4 border-0 rounded-lg font-bold text-sm cursor-pointer whitespace-nowrap"
            style={{ background: 'var(--accent)', color: '#000' }}>
            {editId ? 'Update' : '+ Add'}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setName(''); setIcon(''); }}
              className="py-2.5 px-3 rounded-lg cursor-pointer"
              style={{ border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Popular presets */}
      <div className="card p-5 mb-6">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] mb-3" style={{ color: 'var(--text-muted)' }}>
          Quick Add Popular Techs
        </p>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_TECHS.filter(t => !techs.find(e => e.name === t.name)).map(t => (
            <button key={t.name} onClick={() => addFromPopular(t)}
              className="flex items-center gap-1.5 py-1 px-2.5 text-xs cursor-pointer transition-all duration-150"
              style={{ border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg-hover)', color: 'var(--text-muted)' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
              <img src={t.icon} alt={t.name} className="w-3.5 h-3.5 object-contain" />
              {t.name}
            </button>
          ))}
          {POPULAR_TECHS.every(t => techs.find(e => e.name === t.name)) && (
            <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>All popular techs added ✓</p>
          )}
        </div>
      </div>

      {/* Tech list */}
      <div className="flex justify-between items-center mb-3">
        <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>Your Tech Registry</p>
        <input className="input text-xs py-1.5 px-3" value={filter} onChange={e => setFilter(e.target.value)}
          placeholder="Filter..." style={{ width: '180px' }} />
      </div>
      <div className="flex flex-wrap gap-2">
        {filtered.map(t => (
          <div key={t._id} className="flex items-center gap-1.5 py-1.5 px-2.5 text-xs"
            style={{ border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg-card)' }}>
            {t.icon && <img src={t.icon} alt={t.name} className="w-[15px] h-[15px] object-contain" />}
            <span style={{ color: 'var(--text)' }}>{t.name}</span>
            <button onClick={() => handleEdit(t)} className="bg-transparent border-0 cursor-pointer px-0.5" style={{ color: 'var(--text-dim)' }}>
              <Edit2 size={10} />
            </button>
            <button onClick={() => handleDelete(t._id)} className="bg-transparent border-0 cursor-pointer px-0.5" style={{ color: 'var(--text-dim)' }}>
              <Trash2 size={10} />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>No techs yet. Add from presets above!</p>
        )}
      </div>
    </div>
  );
}
