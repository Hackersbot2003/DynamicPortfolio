import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, Upload, X, Eye, EyeOff } from 'lucide-react';
import { Field, Modal, SaveBtn, CancelBtn } from './FormHelpers';

const BLOG_PLATFORMS = ['Medium', 'Hashnode', 'Dev.to', 'Substack', 'LinkedIn', 'Personal Blog'];
const EMPTY = { title: '', description: '', topic: '', publishedAt: '', published: true, platforms: [], coverImage: '' };

function BlogForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ? { ...initial, platforms: initial.platforms || [] } : EMPTY);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(initial?.coverImage || '');
  const [saving, setSaving] = useState(false);
  const [plName, setPlName] = useState('');
  const [plUrl, setPlUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('topic', form.topic);
      fd.append('publishedAt', form.publishedAt);
      fd.append('published', form.published);
      fd.append('platforms', JSON.stringify(form.platforms));
      if (coverFile) fd.append('coverImage', coverFile);
      await onSave(fd, form._id);
      toast.success(form._id ? 'Updated!' : 'Blog added!');
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const addPlatform = () => {
    if (!plName || !plUrl) return;
    setForm(f => ({ ...f, platforms: [...f.platforms, { name: plName, url: plUrl, icon: '' }] }));
    setPlName(''); setPlUrl('');
  };

  return (
    <Modal title={form._id ? 'Edit Blog' : 'New Blog'} onClose={onCancel}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <Field label="title *">
          <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Blog title" required />
        </Field>
        <Field label="description">
          <textarea className="input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Short description..." style={{ resize: 'vertical' }} />
        </Field>
        <div className="grid grid-cols-2 gap-2.5">
          <Field label="topic">
            <input className="input" value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} placeholder="e.g. Web3, ML" />
          </Field>
          <Field label="published date">
            <input className="input" value={form.publishedAt} onChange={e => setForm(f => ({ ...f, publishedAt: e.target.value }))} placeholder="e.g. Dec 30, 2025" />
          </Field>
        </div>
        <Field label="cover image">
          <label className="inline-flex items-center gap-1.5 py-2 px-3.5 cursor-pointer text-xs w-fit"
            style={{ border: '1px dashed var(--border)', borderRadius: '8px', color: 'var(--text-muted)' }}>
            <Upload size={12} /> Choose Cover
            <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); } }} className="hidden" />
          </label>
          {coverPreview && (
            <img src={coverPreview} alt="cover" className="h-20 w-auto rounded-lg mt-1.5 object-cover"
              style={{ border: '1px solid var(--border)' }} />
          )}
        </Field>
        <Field label="publish platforms">
          <div className="flex flex-col gap-1.5 mb-1.5">
            {form.platforms.map((pl, i) => (
              <div key={i} className="flex justify-between items-center py-1.5 px-2.5 rounded-[7px]"
                style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
                <span className="text-xs">
                  <strong>{pl.name}</strong> — <span className="font-mono text-[0.7rem]" style={{ color: 'var(--text-muted)' }}>{pl.url.slice(0, 35)}...</span>
                </span>
                <button type="button" onClick={() => setForm(f => ({ ...f, platforms: f.platforms.filter((_, idx) => idx !== i) }))}
                  className="bg-transparent border-0 cursor-pointer" style={{ color: 'var(--text-muted)' }}>
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <select className="input flex-1 min-w-[120px]" value={plName} onChange={e => setPlName(e.target.value)}>
              <option value="">Select platform</option>
              {BLOG_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input className="input flex-[2] min-w-[160px]" value={plUrl} onChange={e => setPlUrl(e.target.value)} placeholder="Article URL" />
            <button type="button" onClick={addPlatform} className="px-3 rounded-lg cursor-pointer"
              style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', color: 'var(--accent)' }}>
              <Plus size={13} />
            </button>
          </div>
        </Field>
        <Field label="visibility">
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={() => setForm(f => ({ ...f, published: !f.published }))}
              className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg text-xs cursor-pointer transition-all duration-150"
              style={{
                border: `1px solid ${form.published ? 'var(--accent)' : 'var(--border)'}`,
                background: form.published ? 'var(--accent-light)' : 'var(--bg-hover)',
                color: form.published ? 'var(--accent)' : 'var(--text-muted)',
              }}>
              {form.published ? <Eye size={12} /> : <EyeOff size={12} />}
              {form.published ? 'Published' : 'Draft'}
            </button>
            <span className="font-mono text-[0.72rem]" style={{ color: 'var(--text-muted)' }}>
              {form.published ? 'Visible on portfolio' : 'Hidden from portfolio'}
            </span>
          </div>
        </Field>
        <div className="flex gap-2 justify-end mt-1">
          <CancelBtn onClick={onCancel} />
          <SaveBtn saving={saving} />
        </div>
      </form>
    </Modal>
  );
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/blogs?all=true').then(r => setBlogs(r.data));
  useEffect(() => { load(); }, []);

  const handleSave = async (fd, id) => {
    if (id) await api.put(`/blogs/${id}`, fd);
    else await api.post('/blogs', fd);
    setShowForm(false); setEditing(null); load();
  };

  const togglePublish = async (blog) => {
    await api.put(`/blogs/${blog._id}`, { ...blog, published: !blog.published });
    toast.success(blog.published ? 'Set to draft' : 'Published!');
    load();
  };

  return (
    <div className="p-8">
      {(showForm || editing) && <BlogForm initial={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl mb-0.5 font-display" style={{ color: 'var(--text)' }}>Blogs</h1>
          <p className="font-mono text-[0.78rem]" style={{ color: 'var(--text-muted)' }}>{blogs.length} blog(s)</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 py-2 px-4 text-white border-0 rounded-lg font-bold text-sm cursor-pointer"
          style={{ background: 'var(--accent)' }}>
          <Plus size={13} /> Add Blog
        </button>
      </div>
      {blogs.length === 0 ? (
        <div className="text-center py-12 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>No blogs yet.</div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {blogs.map(b => (
            <div key={b._id} className="card flex gap-3.5 items-center px-[1.1rem] py-[0.9rem]">
              {b.coverImage && (
                <img src={b.coverImage} alt="" className="w-14 h-[42px] object-cover rounded-[6px] shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{b.title}</span>
                  <span className="font-mono text-[0.62rem] py-0.5 px-1.5 rounded-[3px]"
                    style={{
                      background: b.published ? 'var(--accent-light)' : 'var(--bg-hover)',
                      color: b.published ? 'var(--accent)' : 'var(--text-dim)',
                      border: `1px solid ${b.published ? 'var(--accent)' : 'var(--border)'}`,
                    }}>
                    {b.published ? 'published' : 'draft'}
                  </span>
                </div>
                <p className="font-mono text-[0.72rem]" style={{ color: 'var(--text-muted)' }}>
                  {b.platforms?.map(p => p.name).join(' · ') || 'No platforms'}
                </p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => togglePublish(b)} className="p-1.5 rounded-[7px] cursor-pointer"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg-hover)', color: b.published ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {b.published ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
                <button onClick={() => setEditing(b)} className="p-1.5 rounded-[7px] cursor-pointer"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                  <Edit2 size={12} />
                </button>
                <button onClick={async () => { if (!confirm('Delete?')) return; await api.delete(`/blogs/${b._id}`); toast.success('Deleted'); load(); }}
                  className="p-1.5 rounded-[7px] cursor-pointer"
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
