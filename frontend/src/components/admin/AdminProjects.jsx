import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, Upload, X } from 'lucide-react';
import { Field, Modal, SaveBtn, CancelBtn, TagInput, TechStackInput } from './FormHelpers';

const EMPTY = { title: '', description: '', features: [], topic: '', status: 'completed', deployedLink: '', githubLink: '', extraLinks: [], techStack: [], featured: false };

function ProjectForm({ initial, onSave, onCancel, categories, techList }) {
  const [form, setForm] = useState(initial ? { ...initial, features: initial.features || [], extraLinks: initial.extraLinks || [], techStack: initial.techStack || [] } : EMPTY);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [extraLabel, setExtraLabel] = useState('');
  const [extraUrl, setExtraUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('topic', form.topic);
      fd.append('status', form.status);
      fd.append('deployedLink', form.deployedLink || '');
      fd.append('githubLink', form.githubLink || '');
      fd.append('featured', form.featured);
      fd.append('features', JSON.stringify(form.features));
      fd.append('techStack', JSON.stringify(form.techStack));
      fd.append('extraLinks', JSON.stringify(form.extraLinks));
      photoFiles.forEach(f => fd.append('photos', f));
      await onSave(fd, form._id);
      toast.success(form._id ? 'Updated!' : 'Project created!');
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  return (
    <Modal title={form._id ? 'Edit Project' : 'New Project'} onClose={onCancel}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <Field label="title *">
          <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Project title" required />
        </Field>
        <Field label="description *">
          <textarea className="input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Short description..." required style={{ resize: 'vertical' }} />
        </Field>
        <Field label="features / bullet points">
          <TagInput value={form.features} onChange={v => setForm(f => ({ ...f, features: v }))} placeholder="Add feature (Enter)" />
        </Field>
        <div className="grid grid-cols-2 gap-2.5">
          <Field label="topic / category">
            <div className="flex gap-1.5">
              <select className="input" value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}>
                <option value="">Select topic</option>
                {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex gap-1.5 mt-1.5">
              <input className="input flex-1 text-xs" value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="Or add new category" />
              <button type="button" onClick={async () => {
                if (!newCat.trim()) return;
                await api.post('/projects/categories', { name: newCat.trim() });
                setForm(f => ({ ...f, topic: newCat.trim() }));
                setNewCat('');
                toast.success('Category added');
              }} className="px-2.5 py-0 text-xs cursor-pointer"
                style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: '7px', color: 'var(--accent)' }}>
                + Add
              </button>
            </div>
          </Field>
          <Field label="status">
            <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
          <Field label="deployed link">
            <input className="input" value={form.deployedLink} onChange={e => setForm(f => ({ ...f, deployedLink: e.target.value }))} placeholder="https://..." />
          </Field>
          <Field label="github link">
            <input className="input" value={form.githubLink} onChange={e => setForm(f => ({ ...f, githubLink: e.target.value }))} placeholder="https://github.com/..." />
          </Field>
        </div>
        <Field label="extra links (Play Store, etc.)">
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            {form.extraLinks.map((l, i) => (
              <span key={i} className="inline-flex items-center gap-1 py-0.5 px-2 text-[0.72rem]"
                style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: '5px' }}>
                {l.label}: {l.url.slice(0, 20)}...
                <button type="button" onClick={() => setForm(f => ({ ...f, extraLinks: f.extraLinks.filter((_, idx) => idx !== i) }))}
                  className="bg-transparent border-0 cursor-pointer" style={{ color: 'var(--text-dim)' }}>
                  <X size={9} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-1.5">
            <input className="input flex-1" value={extraLabel} onChange={e => setExtraLabel(e.target.value)} placeholder="Label (e.g. Play Store)" />
            <input className="input flex-[2]" value={extraUrl} onChange={e => setExtraUrl(e.target.value)} placeholder="URL" />
            <button type="button" onClick={() => {
              if (!extraLabel || !extraUrl) return;
              setForm(f => ({ ...f, extraLinks: [...f.extraLinks, { label: extraLabel, url: extraUrl }] }));
              setExtraLabel(''); setExtraUrl('');
            }} className="px-2.5 cursor-pointer"
              style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: '7px', color: 'var(--text-muted)' }}>
              <Plus size={13} />
            </button>
          </div>
        </Field>
        <Field label="tech stack (type to search from registry)">
          <TechStackInput value={form.techStack} onChange={v => setForm(f => ({ ...f, techStack: v }))} techList={techList} />
        </Field>
        <Field label="photos (up to 5)">
          <label className="inline-flex items-center gap-1.5 py-2 px-3.5 cursor-pointer text-xs w-fit"
            style={{ border: '1px dashed var(--border)', borderRadius: '8px', color: 'var(--text-muted)' }}>
            <Upload size={12} /> Choose photos
            <input type="file" accept="image/*" multiple onChange={e => setPhotoFiles([...e.target.files])} className="hidden" />
          </label>
          {photoFiles.length > 0 && (
            <p className="text-[0.7rem] font-mono mt-1" style={{ color: 'var(--accent)' }}>{photoFiles.length} file(s) selected</p>
          )}
          {form.photos?.length > 0 && !photoFiles.length && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {form.photos.map((p, i) => (
                <img key={i} src={p} alt="" className="h-14 w-auto rounded-[6px]" style={{ border: '1px solid var(--border)' }} />
              ))}
            </div>
          )}
        </Field>
        <div className="flex gap-2 justify-end mt-1">
          <CancelBtn onClick={onCancel} />
          <SaveBtn saving={saving} />
        </div>
      </form>
    </Modal>
  );
}

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [techList, setTechList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const [pr, ca, te] = await Promise.all([api.get('/projects'), api.get('/projects/categories'), api.get('/tech')]);
    setProjects(pr.data); setCategories(ca.data); setTechList(te.data);
  };
  useEffect(() => { load(); }, []);

  const handleSave = async (fd, id) => {
    if (id) await api.put(`/projects/${id}`, fd);
    else await api.post('/projects', fd);
    setShowForm(false); setEditing(null); load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    toast.success('Deleted'); load();
  };

  return (
    <div className="p-8">
      {(showForm || editing) && (
        <ProjectForm initial={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} categories={categories} techList={techList} />
      )}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl mb-0.5 font-display" style={{ color: 'var(--text)' }}>Projects</h1>
          <p className="font-mono text-[0.78rem]" style={{ color: 'var(--text-muted)' }}>{projects.length} project(s) · {categories.length} categories</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 py-2 px-4 text-white border-0 rounded-lg font-bold text-sm cursor-pointer"
          style={{ background: 'var(--accent)' }}>
          <Plus size={13} /> Add Project
        </button>
      </div>
      {projects.length === 0 ? (
        <div className="text-center py-12 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>No projects yet.</div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {projects.map(p => (
            <div key={p._id} className="card flex justify-between items-center gap-4 px-[1.1rem] py-[0.9rem]">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{p.title}</span>
                  <span className={`status-badge status-${p.status}`}>{p.status}</span>
                  {p.topic && (
                    <span className="font-mono text-[0.65rem] px-1.5 py-0.5 rounded-[4px]"
                      style={{ color: 'var(--accent)', background: 'var(--accent-light)' }}>
                      {p.topic}
                    </span>
                  )}
                </div>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{p.description}</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => setEditing(p)} className="p-1.5 rounded-[7px] cursor-pointer"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                  <Edit2 size={12} />
                </button>
                <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-[7px] cursor-pointer"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg-hover)', color: '#dc2626' }}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
