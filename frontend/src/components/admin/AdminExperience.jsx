import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, Upload } from 'lucide-react';
import { Field, Modal, SaveBtn, CancelBtn, TagInput, TechStackInput } from './FormHelpers';

const EMPTY = { company: '', role: '', duration: '', description: '', link: '', techStack: [], points: [] };

function ExpForm({ initial, onSave, onCancel, techList }) {
  const [form, setForm] = useState(initial ? { ...initial, techStack: initial.techStack || [], points: initial.points || [] } : EMPTY);
  const [iconFile, setIconFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('company', form.company);
      fd.append('role', form.role);
      fd.append('duration', form.duration || '');
      fd.append('description', form.description || '');
      fd.append('link', form.link || '');
      fd.append('techStack', JSON.stringify(form.techStack));
      fd.append('points', JSON.stringify(form.points));
      if (iconFile) fd.append('companyIcon', iconFile);
      await onSave(fd, form._id);
      toast.success(form._id ? 'Updated!' : 'Added!');
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  return (
    <Modal title={form._id ? 'Edit Experience' : 'New Experience'} onClose={onCancel}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div className="grid grid-cols-2 gap-2.5">
          <Field label="company *"><input className="input" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} required /></Field>
          <Field label="role *"><input className="input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} required /></Field>
          <Field label="duration"><input className="input" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="Jan 2025 - Mar 2025" /></Field>
          <Field label="company url"><input className="input" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="https://..." /></Field>
        </div>
        <Field label="description">
          <textarea className="input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} style={{ resize: 'vertical' }} />
        </Field>
        <Field label="company icon">
          <div className="flex items-center gap-2.5">
            <label className="inline-flex items-center gap-1.5 py-1.5 px-3 cursor-pointer text-xs"
              style={{ border: '1px dashed var(--border)', borderRadius: '7px', color: 'var(--text-muted)' }}>
              <Upload size={11} /> Upload Icon
              <input type="file" accept="image/*" onChange={e => setIconFile(e.target.files[0])} className="hidden" />
            </label>
            {(iconFile || form.companyIcon) && (
              <img src={iconFile ? URL.createObjectURL(iconFile) : form.companyIcon} alt=""
                className="w-8 h-8 rounded-[7px] object-contain"
                style={{ border: '1px solid var(--border)' }} />
            )}
          </div>
        </Field>
        <Field label="tech stack">
          <TechStackInput value={form.techStack} onChange={v => setForm(f => ({ ...f, techStack: v }))} techList={techList} />
        </Field>
        <Field label="work points">
          <TagInput value={form.points} onChange={v => setForm(f => ({ ...f, points: v }))} placeholder="Add bullet point (Enter)" />
        </Field>
        <div className="flex gap-2 justify-end">
          <CancelBtn onClick={onCancel} />
          <SaveBtn saving={saving} />
        </div>
      </form>
    </Modal>
  );
}

export default function AdminExperience() {
  const [items, setItems] = useState([]);
  const [techList, setTechList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const [e, t] = await Promise.all([api.get('/experience'), api.get('/tech')]);
    setItems(e.data); setTechList(t.data);
  };
  useEffect(() => { load(); }, []);

  const handleSave = async (fd, id) => {
    if (id) await api.put(`/experience/${id}`, fd);
    else await api.post('/experience', fd);
    setShowForm(false); setEditing(null); load();
  };

  return (
    <div className="p-8">
      {(showForm || editing) && (
        <ExpForm initial={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} techList={techList} />
      )}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl mb-0.5 font-display" style={{ color: 'var(--text)' }}>Experience</h1>
          <p className="font-mono text-[0.78rem]" style={{ color: 'var(--text-muted)' }}>{items.length} entries</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 py-2 px-4 text-white border-0 rounded-lg font-bold text-sm cursor-pointer"
          style={{ background: 'var(--accent)' }}>
          <Plus size={13} /> Add
        </button>
      </div>
      <div className="flex flex-col gap-2.5">
        {items.map(item => (
          <div key={item._id} className="card flex justify-between items-center gap-4 px-[1.1rem] py-[0.9rem]">
            <div className="flex items-center gap-3">
              {item.companyIcon && (
                <img src={item.companyIcon} alt="" className="w-8 h-8 rounded-[7px] object-contain"
                  style={{ border: '1px solid var(--border)' }} />
              )}
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{item.company}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {item.role}{item.duration && <span className="font-mono text-[0.68rem] ml-1">· {item.duration}</span>}
                </p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => setEditing(item)} className="p-1.5 rounded-[7px] cursor-pointer"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                <Edit2 size={12} />
              </button>
              <button onClick={async () => { if (!confirm('Delete?')) return; await api.delete(`/experience/${item._id}`); toast.success('Deleted'); load(); }}
                className="p-1.5 rounded-[7px] cursor-pointer"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-hover)', color: '#dc2626' }}>
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
