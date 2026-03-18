import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';

/* ── SPOTLIGHT COMPONENT: coloured radial glow under heatmaps ── */
function HeatmapSpotlight({ color }) {
  return (
    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 pointer-events-none"
      style={{
        width: '70%', height: 36, borderRadius: '50%',
        background: color,
        filter: 'blur(16px)',
        opacity: 0.35,
      }} />
  );
}

/* ── GITHUB HEATMAP ── */
function GitHubHeatmap({ username }) {
  const [weeks, setWeeks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then(r => r.json())
      .then(data => {
        if (data?.contributions) {
          const all = data.contributions;
          const w = [];
          for (let i = 0; i < all.length; i += 7) w.push(all.slice(i, i + 7));
          setWeeks(w.slice(-53));
          setTotal(all.reduce((s, d) => s + d.count, 0));
        }
      }).catch(() => {}).finally(() => setLoading(false));
  }, [username]);

  const getColor = (c) => {
    if (!c) return 'rgba(255,255,255,0.05)';
    if (c < 3) return 'rgba(63,185,80,0.3)';
    if (c < 6) return 'rgba(63,185,80,0.55)';
    if (c < 10) return 'rgba(63,185,80,0.78)';
    return '#3fb950';
  };

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const getMonthLabels = () => {
    const labels = []; let lastMonth = -1;
    weeks.forEach((week, wi) => {
      if (week[0]) {
        const m = new Date(week[0].date).getMonth();
        if (m !== lastMonth) { labels.push({ wi, label: MONTHS[m] }); lastMonth = m; }
      }
    });
    return labels;
  };

  if (loading) return <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>Loading heatmap...</p>;
  if (!weeks.length) return null;
  const monthLabels = getMonthLabels();

  return (
    <div className="mt-4 relative">
      <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
        <span className="stat-value" style={{ color: 'var(--green)', fontSize: '1rem' }}>{total}</span>{' '}
        contributions in the last year
      </p>
      <div className="relative pb-4 overflow-x-auto">
        <div className="relative h-4 mb-1">
          {monthLabels.map(({ wi, label }) => (
            <span key={wi} className="absolute text-[0.58rem] whitespace-nowrap" style={{ left: `${wi * 13}px`, color: 'var(--text-dim)' }}>{label}</span>
          ))}
        </div>
        <div className="flex gap-[2px] w-fit">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[2px]">
              {week.map((day, di) => (
                <div key={di} title={`${day.date}: ${day.count}`}
                  className="w-[11px] h-[11px] rounded-[2px] cursor-default transition-transform duration-100 hover:scale-[1.5]"
                  style={{ background: getColor(day.count), boxShadow: day.count > 9 ? '0 0 4px rgba(63,185,80,0.6)' : 'none' }} />
              ))}
            </div>
          ))}
        </div>
        {/* Spotlight glow */}
        <HeatmapSpotlight color="rgba(63,185,80,0.6)" />
        {/* Legend */}
        <div className="flex items-center gap-1 mt-3 justify-end">
          <span className="text-[0.58rem]" style={{ color: 'var(--text-dim)' }}>Less</span>
          {[0,2,5,9,12].map((v, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-[2px]" style={{ background: getColor(v) }} />
          ))}
          <span className="text-[0.58rem]" style={{ color: 'var(--text-dim)' }}>More</span>
        </div>
      </div>
    </div>
  );
}

/* ── GITHUB STATS ── */
function GitHubStats({ username }) {
  const [data, setData] = useState(null);
  useEffect(() => { fetch(`https://api.github.com/users/${username}`).then(r => r.json()).then(setData).catch(() => {}); }, [username]);
  if (!data) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {[['public_repos','Repos'],['followers','Followers'],['following','Following']].map(([key, label]) => (
        <div key={key} className="px-4 py-2 text-center rounded-xl" style={{ border: '1px solid var(--border-md)', background: 'rgba(56,139,253,0.04)' }}>
          <p className="stat-value" style={{ color: 'var(--blue-bright)', fontSize: '1.2rem' }}>{data[key]}</p>
          <p className="text-[0.62rem]" style={{ color: 'var(--text-muted)' }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

/* ── LEETCODE STATS ── */
function LeetCodeStats({ username }) {
  const [profile, setProfile] = useState(null);
  const [solved, setSolved] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetch(`https://alfa-leetcode-api.onrender.com/${username}`).then(r => r.json()),
      fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`).then(r => r.json()),
    ]).then(([p, s]) => {
      if (p.status === 'fulfilled' && p.value?.username) setProfile(p.value);
      if (s.status === 'fulfilled' && s.value?.solvedProblem !== undefined) setSolved(s.value);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [username]);

  if (loading) return <div className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>Loading LeetCode stats...</div>;

  const totalSolved = solved?.solvedProblem ?? profile?.totalSolved ?? 0;
  const easy = solved?.easySolved ?? 0;
  const med = solved?.mediumSolved ?? 0;
  const hard = solved?.hardSolved ?? 0;
  const totalEasy = solved?.totalEasy ?? 932;
  const totalMed = solved?.totalMedium ?? 2026;
  const totalHard = solved?.totalHard ?? 915;
  const ranking = profile?.ranking ?? 0;
  const R = 48; const circ = 2 * Math.PI * R;
  const ep = totalEasy > 0 ? easy / totalEasy : 0;
  const mp = totalMed > 0 ? med / totalMed : 0;
  const hp = totalHard > 0 ? hard / totalHard : 0;

  return (
    <div className="mt-4">
      <div className="flex gap-4 flex-wrap items-center">
        {/* Circle */}
        <div className="relative w-[110px] h-[110px] shrink-0">
          <svg viewBox="0 0 110 110" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="55" cy="55" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
            <circle cx="55" cy="55" r={R} fill="none" stroke="#00b8a3" strokeWidth="7"
              strokeDasharray={`${circ * ep} ${circ * (1 - ep)}`} strokeLinecap="round" />
            <circle cx="55" cy="55" r={R} fill="none" stroke="#e3b341" strokeWidth="7"
              strokeDasharray={`${circ * mp} ${circ * (1 - mp)}`}
              strokeDashoffset={`${-circ * ep}`} strokeLinecap="round" />
            <circle cx="55" cy="55" r={R} fill="none" stroke="#f85149" strokeWidth="7"
              strokeDasharray={`${circ * hp} ${circ * (1 - hp)}`}
              strokeDashoffset={`${-circ * (ep + mp)}`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="stat-value" style={{ color: 'var(--text)', fontSize: '1.35rem', lineHeight: 1 }}>{totalSolved}</span>
            <span className="text-[0.55rem]" style={{ color: 'var(--text-muted)' }}>Solved</span>
          </div>
        </div>
        {/* Breakdown */}
        <div className="flex flex-col gap-2 flex-1 min-w-[140px]">
          {[
            { label: 'Easy', s: easy, t: totalEasy, color: '#00b8a3', bg: 'rgba(0,184,163,0.08)' },
            { label: 'Med.',  s: med,  t: totalMed,  color: '#e3b341', bg: 'rgba(227,179,65,0.08)' },
            { label: 'Hard', s: hard, t: totalHard, color: '#f85149', bg: 'rgba(248,81,73,0.08)' },
          ].map(({ label, s, t, color, bg }) => (
            <div key={label} className="flex items-center gap-2 py-1.5 px-3 rounded-lg"
              style={{ border: `1px solid ${color}22`, background: bg }}>
              <span className="text-xs font-bold w-7" style={{ color }}>{label}</span>
              <span className="stat-value" style={{ color, fontSize: '0.95rem' }}>{s}</span>
              <span className="text-[0.6rem]" style={{ color: 'var(--text-muted)' }}>/{t}</span>
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <div className="h-full rounded-full" style={{ width: `${t > 0 ? (s/t)*100 : 0}%`, background: color, transition: 'width 0.6s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {ranking > 0 && (
        <div className="flex gap-2 mt-3">
          <div className="px-3 py-1.5 text-center rounded-xl" style={{ border: '1px solid var(--border-md)', background: 'rgba(255,165,22,0.06)' }}>
            <p className="stat-value" style={{ color: '#FFA116', fontSize: '0.95rem' }}>{ranking.toLocaleString()}</p>
            <p className="text-[0.6rem]" style={{ color: 'var(--text-muted)' }}>Global Rank</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── LEETCODE HEATMAP ── */
function LeetCodeHeatmap({ username }) {
  const [calendar, setCalendar] = useState(null);
  const [totalActive, setTotalActive] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    fetch(`https://alfa-leetcode-api.onrender.com/${username}/calendar`)
      .then(r => r.json())
      .then(d => {
        if (d?.submissionCalendar) {
          const cal = typeof d.submissionCalendar === 'string' ? JSON.parse(d.submissionCalendar) : d.submissionCalendar;
          setCalendar(cal);
          setTotalActive(d.totalActiveDays || 0);
          setStreak(d.streak || 0);
        }
      }).catch(() => {});
  }, [username]);

  if (!calendar) return null;

  const now = new Date();
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const startUTC = todayUTC - 52 * 7 * 86400 * 1000;
  const weeks = [];
  for (let w = 0; w < 52; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dayMs = startUTC + (w * 7 + d) * 86400 * 1000;
      const ts = String(Math.floor(dayMs / 1000));
      week.push({ count: calendar[ts] || 0, date: new Date(dayMs).toISOString().split('T')[0] });
    }
    weeks.push(week);
  }

  const getColor = (c) => {
    if (!c) return 'rgba(255,255,255,0.05)';
    if (c < 2) return 'rgba(255,165,22,0.25)';
    if (c < 4) return 'rgba(255,165,22,0.55)';
    if (c < 7) return '#FFA116';
    return '#ff8c00';
  };

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthLabels = []; let lastMonth = -1;
  weeks.forEach((week, wi) => {
    if (week[0]) {
      const m = new Date(week[0].date).getUTCMonth();
      if (m !== lastMonth) { monthLabels.push({ wi, label: MONTHS[m] }); lastMonth = m; }
    }
  });

  return (
    <div className="mt-4 relative">
      <div className="flex gap-2 mb-3 flex-wrap">
        {[
          { val: totalActive, label: 'Active Days', color: 'var(--orange)' },
          { val: streak,      label: 'Max Streak',  color: '#FFA116' },
        ].map(({ val, label, color }) => (
          <div key={label} className="px-3 py-1.5 rounded-xl text-center" style={{ border: '1px solid rgba(255,165,22,0.15)', background: 'rgba(255,165,22,0.06)' }}>
            <p className="stat-value" style={{ color, fontSize: '0.95rem' }}>{val}</p>
            <p className="text-[0.6rem]" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>
      <div className="relative pb-4 overflow-x-auto">
        <div className="relative h-4 mb-1">
          {monthLabels.map(({ wi, label }) => (
            <span key={wi} className="absolute text-[0.58rem] whitespace-nowrap" style={{ left: `${wi * 13}px`, color: 'var(--text-dim)' }}>{label}</span>
          ))}
        </div>
        <div className="flex gap-[2px] w-fit">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[2px]">
              {week.map((day, di) => (
                <div key={di} title={`${day.date}: ${day.count}`}
                  className="w-[11px] h-[11px] rounded-[2px] cursor-default transition-transform duration-100 hover:scale-[1.5]"
                  style={{ background: getColor(day.count), border: day.count === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none' }} />
              ))}
            </div>
          ))}
        </div>
        {/* Orange spotlight for LeetCode */}
        <HeatmapSpotlight color="rgba(255,165,22,0.7)" />
      </div>
    </div>
  );
}

/* ── CODEFORCES ── */
function CodeforcesStats({ username }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(`https://codeforces.com/api/user.info?handles=${username}`)
      .then(r => r.json())
      .then(d => { if (d.status === 'OK' && d.result?.[0]) setData(d.result[0]); })
      .catch(() => {});
  }, [username]);
  if (!data) return null;

  const getRatingColor = (r) => {
    if (!r) return 'var(--text-muted)';
    if (r < 1200) return '#808080'; if (r < 1400) return '#008000';
    if (r < 1600) return '#03a89e'; if (r < 1900) return '#388bfd';
    if (r < 2100) return '#a371f7'; if (r < 2400) return '#e3b341';
    return '#f85149';
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {[
        data.rating    && { val: data.rating,       label: 'Rating',       color: getRatingColor(data.rating) },
        data.maxRating && { val: data.maxRating,     label: 'Max Rating',   color: getRatingColor(data.maxRating) },
        data.rank      && { val: data.rank,          label: 'Rank',         color: getRatingColor(data.rating) },
        data.contribution !== undefined && { val: data.contribution, label: 'Contribution', color: 'var(--blue-bright)' },
      ].filter(Boolean).map(({ val, label, color }) => (
        <div key={label} className="px-3 py-2 text-center rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', minWidth: 72 }}>
          <p className="stat-value capitalize" style={{ color, fontSize: '0.95rem', lineHeight: 1.2 }}>{val}</p>
          <p className="text-[0.6rem] mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

/* ── GENERIC ── */
const GenericStats = ({ url }) => (
  <div className="mt-3">
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs action-btn">
      View Profile <ExternalLink size={11} />
    </a>
  </div>
);

/* ── PLATFORM ICONS ── */
const PLATFORM_SVGS = {
  github: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>,
  leetcode: <svg viewBox="0 0 24 24" width="20" height="20" fill="#FFA116"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/></svg>,
  codeforces: <svg viewBox="0 0 24 24" width="20" height="20" fill="#388bfd"><path d="M4.5 7.5A1.5 1.5 0 0 1 6 9v10.5A1.5 1.5 0 0 1 4.5 21h-3A1.5 1.5 0 0 1 0 19.5V9a1.5 1.5 0 0 1 1.5-1.5h3zm9-4.5A1.5 1.5 0 0 1 15 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 19.5v-15A1.5 1.5 0 0 1 10.5 3h3zm9 7.5A1.5 1.5 0 0 1 24 12v7.5A1.5 1.5 0 0 1 22.5 21h-3A1.5 1.5 0 0 1 18 19.5V12a1.5 1.5 0 0 1 1.5-1.5h3z"/></svg>,
  hackerrank: <svg viewBox="0 0 24 24" width="20" height="20" fill="#00ea64"><path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 11.885 0 13-.642 1.115-9.107 6-10.392 6-1.284 0-9.75-4.885-10.392-6C.96 17.885.96 7.115 1.608 6 2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V7.057c0-.143-.116-.258-.258-.258H8.9c-.143 0-.259.115-.259.258v9.887c0 .143.116.258.259.258h.805c.142 0 .258-.115.258-.258v-4.104h4.074v4.104c0 .143.116.258.258.258h.805c.143 0 .258-.115.258-.258V7.057c0-.143-.115-.258-.258-.258h-.806z"/></svg>,
  linkedin: <svg viewBox="0 0 24 24" width="20" height="20" fill="#0ea5e9"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
};

/* ── MAIN EXPORT ── */
export default function Platforms({ platforms }) {
  if (!platforms?.length) return null;

  const renderStats = (p) => {
    const n = p.name?.toLowerCase();
    if (n === 'github') return <><GitHubStats username={p.username} /><GitHubHeatmap username={p.username} /></>;
    if (n === 'leetcode') return <><LeetCodeStats username={p.username} /><LeetCodeHeatmap username={p.username} /></>;
    if (n === 'codeforces') return <CodeforcesStats username={p.username} />;
    return <GenericStats url={p.url} />;
  };

  // Platform accent colours for spotlight
  const PLATFORM_COLORS = {
    github: 'rgba(63,185,80,0.6)',
    leetcode: 'rgba(255,165,22,0.6)',
    codeforces: 'rgba(56,139,253,0.6)',
    hackerrank: 'rgba(0,234,100,0.6)',
    linkedin: 'rgba(14,165,233,0.6)',
  };

  return (
    <section id="platforms" className="section">
      <h2 className="section-title">
        <span className="title-bar" />
        <span className="font-bold" style={{ letterSpacing: '-0.02em' }}>Platforms</span>
      </h2>
      <div className="flex flex-col gap-4">
        {platforms.map((p) => {
          const n = p.name?.toLowerCase();
          const icon = PLATFORM_SVGS[n];
          const spotlightColor = PLATFORM_COLORS[n] || 'rgba(56,139,253,0.5)';

          return (
            <div key={p._id} className="glass-card p-5 relative overflow-visible">
              {/* Platform coloured top edge */}
              <div className="absolute top-0 left-6 right-6 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${spotlightColor}, transparent)` }} />

              {/* Header */}
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-3">
                  <div className="shrink-0" style={{ color: p.color || 'var(--text-muted)' }}>
                    {p.icon
                      ? <img src={p.icon} alt={p.name} className="w-5 h-5 object-contain" />
                      : icon || <span className="text-lg font-bold" style={{ color: p.color }}>{p.name?.charAt(0)}</span>
                    }
                  </div>
                  <div>
                    <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>{p.name}</span>
                    <span className="text-xs ml-2 font-mono" style={{ color: 'var(--text-muted)' }}>@{p.username}</span>
                  </div>
                </div>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="action-btn" style={{ padding: '0.3rem 0.8rem', fontSize: '0.7rem' }}>
                  <ExternalLink size={10} /> Visit
                </a>
              </div>

              {/* Stats + heatmaps (includes spotlight) */}
              {renderStats(p)}
            </div>
          );
        })}
      </div>
    </section>
  );
}
