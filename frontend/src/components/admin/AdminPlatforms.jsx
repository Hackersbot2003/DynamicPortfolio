import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Field, Modal, SaveBtn, CancelBtn } from './FormHelpers';

const PRESET_PLATFORMS = [
  { name: 'GitHub', color: '#e8e8e8' },
  { name: 'LeetCode', color: '#FFA116' },
  { name: 'Codeforces', color: '#1890ff' },
  { name: 'HackerRank', color: '#00ea64' },
  { name: 'HackerEarth', color: '#323754' },
  { name: 'CodeChef', color: '#5b4638' },
  { name: 'AtCoder', color: '#e8e8e8' },
  { name: 'LinkedIn', color: '#0077b5' },
];

const EMPTY = { name: '', username: '', url: '', icon: '', color: '#a3e635', showHeatmap: false, showStats: true };

function PlatformForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [saving, setSaving] = useState(false);

  const handlePreset = (p) => setForm(f => ({ ...f, name: p.name, color: p.color }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); toast.success(form._id ? 'Updated!' : 'Platform added!'); }
    catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  return (
    <Modal title={form._id ? 'Edit Platform' : 'Add Platform'} onClose={onCancel}>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {PRESET_PLATFORMS.map(p => (
          <button key={p.name} type="button" onClick={() => handlePreset(p)}
            className="py-1 px-2.5 rounded-[6px] text-[0.72rem] cursor-pointer transition-all duration-150"
            style={{
              border: `1px solid ${form.name === p.name ? p.color : 'var(--border)'}`,
              background: form.name === p.name ? p.color + '22' : 'var(--bg-hover)',
              color: form.name === p.name ? p.color : 'var(--text-muted)',
            }}>
            {p.name}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2.5">
          <Field label="platform name *"><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></Field>
          <Field label="username *"><input className="input" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="@yourusername" required /></Field>
          <Field label="profile url *"><input className="input" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." required /></Field>
          <Field label="icon url (optional)"><input className="input" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="https://..." /></Field>
          <Field label="accent color">
            <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
              className="w-full h-[38px] rounded-lg cursor-pointer"
              style={{ border: '1px solid var(--border)', background: 'var(--bg-hover)' }} />
          </Field>
        </div>
        <div className="flex gap-4">
          {[['showStats', 'Show Stats'], ['showHeatmap', 'Show Heatmap (GitHub)']].map(([key, label]) => (
            <label key={key} className="flex items-center gap-1.5 text-xs cursor-pointer" style={{ color: 'var(--text-muted)' }}>
              <input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} />
              {label}
            </label>
          ))}
        </div>
        <div className="flex gap-2 justify-end">
          <CancelBtn onClick={onCancel} />
          <SaveBtn saving={saving} />
        </div>
      </form>
    </Modal>
  );
}

export default function AdminPlatforms() {
  const [platforms, setPlatforms] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/platforms').then(r => setPlatforms(r.data));
  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    if (data._id) await api.put(`/platforms/${data._id}`, data);
    else await api.post('/platforms', data);
    setShowForm(false); setEditing(null); load();
  };

  return (
    <div className="p-8">
      {(showForm || editing) && (
        <PlatformForm initial={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl mb-0.5 font-display" style={{ color: 'var(--text)' }}>Platforms</h1>
          <p className="font-mono text-[0.78rem]" style={{ color: 'var(--text-muted)' }}>{platforms.length} connected</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 py-2 px-4 text-white border-0 rounded-lg font-bold text-sm cursor-pointer"
          style={{ background: 'var(--accent)' }}>
          <Plus size={13} /> Add Platform
        </button>
      </div>
      <div className="flex flex-col gap-2.5">
        {platforms.map(p => (
          <div key={p._id} className="card flex items-center justify-between gap-4 px-[1.1rem] py-[0.9rem]">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: p.color }} />
              <div>
                <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{p.name}</span>
                <span className="font-mono text-[0.72rem] ml-2" style={{ color: 'var(--text-muted)' }}>@{p.username}</span>
              </div>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => setEditing(p)} className="p-1.5 rounded-[7px] cursor-pointer"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                <Edit2 size={12} />
              </button>
              <button onClick={async () => { if (!confirm('Delete?')) return; await api.delete(`/platforms/${p._id}`); toast.success('Deleted'); load(); }}
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
