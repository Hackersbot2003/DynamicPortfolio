import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Save, Upload, Plus, Trash2 } from 'lucide-react';
import { Field } from './FormHelpers';

export default function AdminProfile() {
  const [form, setForm] = useState({
    name: '', title: '', bio: '', location: '', email: '', resume: '',
    institution: '', institutionIcon: '',
    socials: { github: '', linkedin: '', leetcode: '', twitter: '', discord: '', codeforces: '', hackerrank: '', hackerearth: '' },
    skills: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    api.get('/profile').then(({ data }) => {
      setForm(f => ({ ...f, ...data, socials: { ...f.socials, ...data.socials } }));
      setAvatarPreview(data.avatar || '');
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let avatarUrl = form.avatar || '';
      if (avatarFile) {
        const fd = new FormData();
        fd.append('image', avatarFile);
        const { data } = await api.post('/profile/avatar', fd);
        avatarUrl = data.avatar;
        setAvatarPreview(avatarUrl);
        setAvatarFile(null);
      }
      await api.put('/profile', { ...form, avatar: avatarUrl });
      setForm(f => ({ ...f, avatar: avatarUrl }));
      toast.success('Profile saved!');
    } catch (err) {
      toast.error('Failed to save: ' + (err.response?.data?.message || err.message));
    } finally { setSaving(false); }
  };

  const addSkillGroup = () => setForm(f => ({ ...f, skills: [...f.skills, { category: 'New Category', items: [] }] }));
  const removeSkillGroup = (i) => setForm(f => ({ ...f, skills: f.skills.filter((_, idx) => idx !== i) }));
  const addSkillItem = (gi) => setForm(f => { const s = JSON.parse(JSON.stringify(f.skills)); s[gi].items.push({ name: '', icon: '' }); return { ...f, skills: s }; });
  const updateSkillItem = (gi, ii, field, val) => setForm(f => { const s = JSON.parse(JSON.stringify(f.skills)); s[gi].items[ii][field] = val; return { ...f, skills: s }; });
  const removeSkillItem = (gi, ii) => setForm(f => { const s = JSON.parse(JSON.stringify(f.skills)); s[gi].items.splice(ii, 1); return { ...f, skills: s }; });

  if (loading) return (
    <div className="p-8 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>loading...</div>
  );

  return (
    <div className="p-8 max-w-[720px]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl mb-0.5 font-display" style={{ color: 'var(--text)' }}>Profile & Bio</h1>
          <p className="font-mono text-[0.78rem]" style={{ color: 'var(--text-muted)' }}>Your public profile</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-1.5 py-2 px-4 text-white border-0 rounded-lg font-bold text-sm transition-opacity duration-150"
          style={{ background: 'var(--accent)', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
          <Save size={13} /> {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-[72px] h-[72px] rounded-full overflow-hidden shrink-0" style={{ border: '3px solid var(--accent)' }}>
            {avatarPreview
              ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-2xl font-black"
                  style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                  {form.name?.charAt(0) || '?'}
                </div>
            }
          </div>
          <label className="flex items-center gap-1.5 py-2 px-3.5 cursor-pointer text-xs"
            style={{ border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-muted)', background: 'var(--bg-hover)' }}>
            <Upload size={12} /> Upload Photo
            <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f)); } }} className="hidden" />
          </label>
        </div>

        {/* Basic info */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="full name"><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your Name" /></Field>
          <Field label="title / role"><input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Full Stack Developer" /></Field>
          <Field label="location"><input className="input" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="City, Country" /></Field>
          <Field label="email"><input className="input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" /></Field>
          <Field label="institution name"><input className="input" value={form.institution} onChange={e => setForm(f => ({ ...f, institution: e.target.value }))} placeholder="IIITDM Jabalpur" /></Field>
          <Field label="institution icon url"><input className="input" value={form.institutionIcon} onChange={e => setForm(f => ({ ...f, institutionIcon: e.target.value }))} placeholder="https://..." /></Field>
        </div>

        <Field label="bio">
          <textarea className="input" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell the world about yourself..." rows={3} style={{ resize: 'vertical' }} />
        </Field>

        <Field label="resume url">
          <input className="input" value={form.resume} onChange={e => setForm(f => ({ ...f, resume: e.target.value }))} placeholder="https://drive.google.com/..." />
        </Field>

        {/* Socials */}
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] mb-3" style={{ color: 'var(--text-muted)' }}>Social Links</p>
          <div className="grid grid-cols-2 gap-2.5">
            {Object.keys(form.socials).map(key => (
              <Field key={key} label={key}>
                <input className="input" value={form.socials[key]} onChange={e => setForm(f => ({ ...f, socials: { ...f.socials, [key]: e.target.value } }))} placeholder={`https://${key}.com/...`} />
              </Field>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>Tech Stack / Skills</p>
            <button type="button" onClick={addSkillGroup}
              className="flex items-center gap-1 text-xs bg-transparent border-0 cursor-pointer font-mono"
              style={{ color: 'var(--accent)' }}>
              <Plus size={12} /> Add Group
            </button>
          </div>
          <div className="flex flex-col gap-3.5">
            {form.skills.map((group, gi) => (
              <div key={gi} className="card p-4">
                <div className="flex justify-between items-center mb-2.5">
                  <input className="input max-w-[200px]" value={group.category}
                    onChange={e => { const s = JSON.parse(JSON.stringify(form.skills)); s[gi].category = e.target.value; setForm(f => ({ ...f, skills: s })); }}
                    placeholder="Category" />
                  <button type="button" onClick={() => removeSkillGroup(gi)} className="bg-transparent border-0 cursor-pointer" style={{ color: 'var(--text-muted)' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="flex flex-col gap-1.5">
                  {(group.items || []).map((item, ii) => (
                    <div key={ii} className="flex gap-1.5 items-center">
                      <input className="input flex-1" value={item.name} onChange={e => updateSkillItem(gi, ii, 'name', e.target.value)} placeholder="Skill name" />
                      <input className="input flex-[2]" value={item.icon} onChange={e => updateSkillItem(gi, ii, 'icon', e.target.value)} placeholder="Icon URL" />
                      {item.icon && <img src={item.icon} alt="" className="w-6 h-6 object-contain shrink-0" />}
                      <button type="button" onClick={() => removeSkillItem(gi, ii)} className="bg-transparent border-0 cursor-pointer shrink-0" style={{ color: 'var(--text-muted)' }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addSkillItem(gi)}
                    className="flex items-center gap-1 text-[0.72rem] cursor-pointer py-1.5 px-2.5 mt-1 font-mono transition-colors duration-150"
                    style={{ border: '1px dashed var(--border)', borderRadius: '6px', color: 'var(--text-muted)', background: 'transparent' }}>
                    <Plus size={11} /> Add skill
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
