import { useState } from 'react';
import { X, Plus } from 'lucide-react';

export function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[0.72rem] font-mono mb-1.5 tracking-[0.04em]" style={{ color: 'var(--text-muted)' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 bg-black/50">
      <div
        className="w-full max-w-[580px] max-h-[92vh] overflow-auto p-7"
        style={{
          background: 'var(--bg-card)',
          borderRadius: '14px',
          border: '1px solid var(--border)',
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>{title}</h2>
          <button
            onClick={onClose}
            className="p-0.5 border-0 bg-transparent cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function SaveBtn({ saving, label = 'Save' }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="py-2 px-[1.1rem] text-white border-0 rounded-lg font-semibold text-sm transition-opacity duration-150"
      style={{
        background: 'var(--accent)',
        cursor: saving ? 'not-allowed' : 'pointer',
        opacity: saving ? 0.7 : 1,
      }}
    >
      {saving ? 'Saving...' : label}
    </button>
  );
}

export function CancelBtn({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="py-2 px-4 rounded-lg text-sm cursor-pointer transition-colors duration-150"
      style={{
        border: '1px solid var(--border)',
        background: 'var(--bg-hover)',
        color: 'var(--text-muted)',
      }}
    >
      Cancel
    </button>
  );
}

export function TagInput({ value = [], onChange, placeholder }) {
  const [input, setInput] = useState('');

  const add = () => {
    if (!input.trim()) return;
    onChange([...value, input.trim()]);
    setInput('');
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-1.5">
        {value.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 py-0.5 px-2 text-xs"
            style={{
              background: 'var(--bg-hover)',
              border: '1px solid var(--border)',
              borderRadius: '5px',
              color: 'var(--text-secondary)',
            }}
          >
            {t}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="bg-transparent border-0 cursor-pointer p-0 leading-none"
              style={{ color: 'var(--text-dim)' }}
            >
              <X size={9} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-1.5">
        <input
          className="input flex-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={add}
          className="px-3 cursor-pointer"
          style={{
            background: 'var(--bg-hover)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--text-muted)',
          }}
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}

export function TechStackInput({ value = [], onChange, techList = [] }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInput = (v) => {
    setInput(v);
    if (v.length > 0) {
      setSuggestions(
        techList
          .filter(t => t.name.toLowerCase().includes(v.toLowerCase()) && !value.find(vt => vt.name === t.name))
          .slice(0, 6)
      );
    } else {
      setSuggestions([]);
    }
  };

  const addTech = (tech) => {
    if (!value.find(t => t.name === tech.name)) {
      onChange([...value, { name: tech.name, icon: tech.icon || '' }]);
    }
    setInput('');
    setSuggestions([]);
  };

  const addCustom = () => {
    if (!input.trim()) return;
    const existing = techList.find(t => t.name.toLowerCase() === input.toLowerCase());
    addTech(existing || { name: input.trim(), icon: '' });
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1.5 mb-1.5">
        {value.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 py-0.5 px-2 text-xs"
            style={{
              background: 'var(--bg-hover)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              color: 'var(--text-secondary)',
            }}
          >
            {t.icon && <img src={t.icon} alt={t.name} className="w-3 h-3 object-contain" />}
            {t.name}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="bg-transparent border-0 cursor-pointer p-0"
              style={{ color: 'var(--text-dim)' }}
            >
              <X size={9} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-1.5">
        <input
          className="input flex-1"
          value={input}
          onChange={e => handleInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } }}
          placeholder="Type tech name (suggestions appear)"
        />
        <button
          type="button"
          onClick={addCustom}
          className="px-3 cursor-pointer"
          style={{
            background: 'var(--bg-hover)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--text-muted)',
          }}
        >
          <Plus size={13} />
        </button>
      </div>
      {suggestions.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 z-10 mt-0.5 overflow-hidden"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}
        >
          {suggestions.map((t, i) => (
            <button
              key={i}
              type="button"
              onClick={() => addTech(t)}
              className="w-full py-2 px-3 bg-transparent border-0 cursor-pointer flex items-center gap-2 text-sm text-left transition-colors duration-100"
              style={{ color: 'var(--text)' }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              {t.icon && <img src={t.icon} alt={t.name} className="w-3.5 h-3.5 object-contain" />}
              {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
