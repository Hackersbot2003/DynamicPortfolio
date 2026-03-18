import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Field, Modal, SaveBtn, CancelBtn } from './FormHelpers';

const EMPTY = { title: '', description: '', date: '', link: '', icon: '' };

function AchForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [saving, setSaving] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await onSave(form); toast.success(form._id ? 'Updated!' : 'Added!'); }
    catch { toast.error('Failed'); } finally { setSaving(false); }
  };
  return (
    <Modal title={form._id ? 'Edit Achievement' : 'New Achievement'} onClose={onCancel}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Field label="title *">
          <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
        </Field>
        <Field label="description">
          <textarea className="input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} style={{ resize: 'vertical' }} />
        </Field>
        <div className="grid grid-cols-2 gap-2.5">
          <Field label="date">
            <input className="input" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} placeholder="Jan 2025" />
          </Field>
          <Field label="link">
            <input className="input" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="https://..." />
          </Field>
          <Field label="icon url (optional)">
            <input className="input" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="https://..." />
          </Field>
        </div>
        <div className="flex gap-2 justify-end">
          <CancelBtn onClick={onCancel} /><SaveBtn saving={saving} />
        </div>
      </form>
    </Modal>
  );
}

export default function AdminAchievements() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const load = () => api.get('/achievements').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);
  const handleSave = async (data) => {
    if (data._id) await api.put(`/achievements/${data._id}`, data);
    else await api.post('/achievements', data);
    setShowForm(false); setEditing(null); load();
  };
  return (
    <div className="p-8">
      {(showForm || editing) && <AchForm initial={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl mb-0.5 font-display" style={{ color: 'var(--text)' }}>Achievements</h1>
          <p className="font-mono text-[0.78rem]" style={{ color: 'var(--text-muted)' }}>{items.length} items</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 py-2 px-4 text-white border-0 rounded-lg font-bold text-sm cursor-pointer"
          style={{ background: 'var(--accent)' }}
        >
          <Plus size={13} /> Add
        </button>
      </div>
      <div className="flex flex-col gap-2.5">
        {items.map(item => (
          <div key={item._id} className="card flex justify-between items-center gap-4 px-[1.1rem] py-[0.9rem]">
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{item.title}</p>
              {item.date && <p className="text-[0.7rem] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.date}</p>}
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => setEditing(item)}
                className="p-1.5 rounded-[7px] cursor-pointer transition-colors duration-150"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-muted)' }}
              >
                <Edit2 size={12} />
              </button>
              <button
                onClick={async () => { if (!confirm('Delete?')) return; await api.delete(`/achievements/${item._id}`); toast.success('Deleted'); load(); }}
                className="p-1.5 rounded-[7px] cursor-pointer"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-hover)', color: '#dc2626' }}
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
