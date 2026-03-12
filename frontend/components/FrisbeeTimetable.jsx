'use client';

import { useState } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:#0D0D0D;color:#F0EDE8;font-family:'DM Sans',sans-serif}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#1A1A1A}::-webkit-scrollbar-thumb{background:#A3E635;border-radius:2px}
.app{min-height:100vh;background:#0D0D0D}
.nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(13,13,13,.92);backdrop-filter:blur(12px);border-bottom:1px solid #222;padding:0 32px;height:60px;display:flex;align-items:center;justify-content:space-between}
.nav-logo{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:900;color:#A3E635;letter-spacing:.02em;cursor:pointer}
.nav-logo span{color:#F0EDE8}
.nav-right{display:flex;align-items:center;gap:16px}
.role-badge{font-size:11px;font-weight:600;padding:4px 12px;border-radius:20px;letter-spacing:.06em;text-transform:uppercase}
.role-admin{background:#A3E635;color:#0D0D0D}
.role-leader{background:#3B82F6;color:#fff}
.role-user{background:#333;color:#aaa}
.role-btn{font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;border:1px solid #333;background:transparent;color:#888;cursor:pointer;transition:all .15s;letter-spacing:.05em;text-transform:uppercase}
.role-btn:hover{border-color:#A3E635;color:#A3E635}
.role-btn.active{background:#A3E635;border-color:#A3E635;color:#0D0D0D}
.page{padding:80px 32px 80px;max-width:1200px;margin:0 auto}
.page-label{font-size:11px;font-weight:600;color:#A3E635;letter-spacing:.15em;text-transform:uppercase;margin-bottom:12px}
.page-title{font-family:'Barlow Condensed',sans-serif;font-size:clamp(48px,7vw,88px);font-weight:900;line-height:.9;letter-spacing:-.01em;color:#F0EDE8}
.page-title em{color:#A3E635;font-style:normal}
.section-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:20px}
.section-title{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:800;color:#F0EDE8;letter-spacing:.02em}
.section-count{font-size:12px;color:#555;font-weight:500}
.btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;border:none;letter-spacing:.02em}
.btn-primary{background:#A3E635;color:#0D0D0D}
.btn-primary:hover{background:#B5F03F;transform:translateY(-1px)}
.btn-primary:disabled{background:#333;color:#666;cursor:not-allowed;transform:none}
.btn-secondary{background:#1E1E1E;color:#F0EDE8;border:1px solid #333}
.btn-secondary:hover{border-color:#A3E635;color:#A3E635}
.btn-danger{background:#3D1515;color:#F87171;border:1px solid #5A2020}
.btn-danger:hover{background:#5A2020}
.btn-ghost{background:transparent;color:#888;border:1px solid #2A2A2A}
.btn-ghost:hover{border-color:#555;color:#F0EDE8}
.btn-sm{padding:5px 12px;font-size:12px}
.back-btn{display:flex;align-items:center;gap:8px;background:none;border:none;color:#666;font-size:13px;font-weight:500;cursor:pointer;margin-bottom:24px;padding:0;transition:color .15s;font-family:'DM Sans',sans-serif}
.back-btn:hover{color:#A3E635}
.tabs{display:flex;gap:2px;border-bottom:1px solid #1E1E1E;margin-bottom:28px;overflow-x:auto}
.tab{padding:11px 18px;font-size:13px;font-weight:600;color:#555;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .15s;background:none;border-left:none;border-right:none;border-top:none;font-family:'DM Sans',sans-serif;white-space:nowrap}
.tab:hover{color:#F0EDE8}
.tab.active{color:#A3E635;border-bottom-color:#A3E635}
.tournament-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:18px}
.tournament-card{background:#141414;border:1px solid #1E1E1E;border-radius:12px;padding:26px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
.tournament-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#A3E635,#4ADE80);opacity:0;transition:opacity .2s}
.tournament-card:hover{border-color:#2A2A2A;transform:translateY(-3px);box-shadow:0 20px 40px rgba(0,0,0,.4)}
.tournament-card:hover::before{opacity:1}
.tc-format{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:3px 10px;border-radius:20px;margin-bottom:14px;display:inline-block}
.fmt-pool{background:rgba(163,230,53,.12);color:#A3E635}
.fmt-roundrobin{background:rgba(59,130,246,.12);color:#60A5FA}
.fmt-bracket{background:rgba(251,146,60,.12);color:#FB923C}
.tc-name{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:800;line-height:1;margin-bottom:6px}
.tc-location{font-size:13px;color:#666;margin-bottom:14px;display:flex;align-items:center;gap:6px}
.tc-meta{display:flex;gap:18px;border-top:1px solid #1E1E1E;padding-top:14px;margin-top:14px}
.tc-meta-item{font-size:12px;color:#555}
.tc-meta-item strong{display:block;font-size:15px;font-weight:700;color:#F0EDE8;font-family:'Barlow Condensed',sans-serif;letter-spacing:.02em}
.tc-status{position:absolute;top:18px;right:18px;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:3px 10px;border-radius:20px}
.status-upcoming{background:rgba(251,191,36,.12);color:#FCD34D}
.status-ongoing{background:rgba(163,230,53,.15);color:#A3E635;animation:pulse 2s infinite}
.status-completed{background:rgba(255,255,255,.06);color:#555}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
.tournament-hero{display:grid;grid-template-columns:1fr auto;gap:28px;align-items:start;margin-bottom:36px;padding-bottom:28px;border-bottom:1px solid #1E1E1E}
.t-name{font-family:'Barlow Condensed',sans-serif;font-size:clamp(38px,5vw,66px);font-weight:900;line-height:.95;color:#F0EDE8}
.t-location{font-size:14px;color:#666;margin-top:8px}
.t-stats{display:flex;background:#141414;border:1px solid #1E1E1E;border-radius:10px;overflow:hidden;flex-shrink:0}
.t-stat{padding:18px 22px;text-align:center;border-right:1px solid #1E1E1E}
.t-stat:last-child{border-right:none}
.t-stat-val{font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:900;color:#A3E635}
.t-stat-label{font-size:10px;color:#555;font-weight:600;letter-spacing:.08em;text-transform:uppercase;margin-top:2px}
.pool-section{background:#141414;border:1px solid #1E1E1E;border-radius:12px;overflow:hidden;margin-bottom:18px}
.pool-header{padding:14px 22px;background:#1A1A1A;border-bottom:1px solid #1E1E1E;display:flex;align-items:center;justify-content:space-between}
.pool-name{font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:800;letter-spacing:.05em}
.pool-badge{font-size:10px;font-weight:700;letter-spacing:.1em;color:#A3E635;background:rgba(163,230,53,.1);padding:3px 10px;border-radius:20px;text-transform:uppercase}
.standings-table{width:100%;border-collapse:collapse}
.standings-table th{padding:9px 14px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#444;border-bottom:1px solid #1E1E1E}
.standings-table td{padding:11px 14px;font-size:13px;border-bottom:1px solid #111}
.standings-table tr:last-child td{border-bottom:none}
.standings-table tr:hover td{background:#1A1A1A}
.team-rank{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:900;color:#333;width:28px;display:inline-block}
.team-rank.top{color:#A3E635}
.team-name-link{font-weight:600;cursor:pointer;transition:color .15s}
.team-name-link:hover{color:#A3E635}
.record{font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:700}
.game-list{display:flex;flex-direction:column;gap:7px;padding:14px}
.game-card{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;padding:13px 18px;background:#0D0D0D;border:1px solid #1E1E1E;border-radius:8px;transition:border-color .15s;position:relative}
.game-card:hover{border-color:#2A2A2A}
.game-card.highlight{border-color:rgba(163,230,53,.3);background:rgba(163,230,53,.03)}
.game-team{font-size:13px;font-weight:600}
.game-team.home{text-align:right}
.game-center{text-align:center}
.game-score{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:900;letter-spacing:.05em;color:#A3E635}
.game-time{font-size:11px;color:#555;margin-top:2px}
.game-vs{font-size:12px;color:#444;font-weight:700;letter-spacing:.05em}
.game-field-badge{font-size:10px;color:#60A5FA;background:rgba(59,130,246,.1);padding:2px 7px;border-radius:8px;font-weight:600;letter-spacing:.04em;display:inline-block;margin-top:3px}
.game-edit-btn{position:absolute;top:8px;right:8px;background:#1A1A1A;border:1px solid #2A2A2A;border-radius:4px;color:#555;cursor:pointer;padding:2px 8px;font-size:11px;transition:all .15s}
.game-edit-btn:hover{border-color:#A3E635;color:#A3E635}
.round-header{padding:12px 20px;background:#1A1A1A;border-bottom:1px solid #1E1E1E;display:flex;justify-content:space-between;align-items:center}
.round-title{font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#60A5FA}
.teams-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
.team-card{background:#141414;border:1px solid #1E1E1E;border-radius:10px;padding:18px;cursor:pointer;transition:all .15s;position:relative}
.team-card:hover{border-color:#2A2A2A;transform:translateY(-2px)}
.team-card-logo{font-size:32px;margin-bottom:10px;display:block}
.team-card-name{font-family:'Barlow Condensed',sans-serif;font-size:21px;font-weight:800;margin-bottom:4px}
.team-card-leader{font-size:12px;color:#555;margin-bottom:10px}
.team-card-meta{display:flex;justify-content:space-between;font-size:12px;color:#666;border-top:1px solid #1E1E1E;padding-top:10px;margin-top:10px}
.application-card{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;background:#141414;border:1px solid #1E1E1E;border-radius:10px;margin-bottom:10px}
.app-team-name{font-weight:600;font-size:14px;margin-bottom:3px}
.app-team-leader{font-size:12px;color:#555}
.app-status-badge{padding:3px 11px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.app-approved{background:rgba(163,230,53,.12);color:#A3E635}
.app-rejected{background:rgba(248,113,113,.12);color:#F87171}
.app-pending{background:rgba(251,191,36,.12);color:#FCD34D}
.team-hero{display:grid;grid-template-columns:1fr auto;gap:28px;align-items:start;margin-bottom:36px}
.roster-list{display:flex;flex-direction:column;gap:7px}
.member-card{display:flex;align-items:center;gap:14px;padding:14px 18px;background:#141414;border:1px solid #1E1E1E;border-radius:10px;transition:border-color .15s;cursor:pointer}
.member-card:hover{border-color:#2A2A2A}
.member-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#A3E635,#4ADE80);display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:900;color:#0D0D0D;flex-shrink:0}
.member-name{font-weight:600;font-size:14px}
.member-pos{font-size:12px;color:#555;margin-top:1px}
.member-tag{margin-left:auto;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:3px 10px;border-radius:20px;background:rgba(163,230,53,.12);color:#A3E635}
.empty-state{text-align:center;padding:56px 32px;color:#444}
.empty-icon{font-size:44px;margin-bottom:14px}
.empty-title{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:#333;margin-bottom:6px}
.empty-sub{font-size:13px;color:#444}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)}
.modal{background:#141414;border:1px solid #2A2A2A;border-radius:16px;width:100%;max-width:540px;max-height:90vh;overflow-y:auto}
.modal-header{padding:22px 26px 18px;border-bottom:1px solid #1E1E1E;display:flex;justify-content:space-between;align-items:center}
.modal-title{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800}
.modal-close{background:none;border:none;color:#555;cursor:pointer;font-size:18px;padding:4px;transition:color .15s}
.modal-close:hover{color:#F0EDE8}
.modal-body{padding:22px 26px}
.modal-footer{padding:18px 26px;border-top:1px solid #1E1E1E;display:flex;justify-content:flex-end;gap:8px}
.form-group{margin-bottom:18px}
.form-label{display:block;font-size:11px;font-weight:600;color:#888;letter-spacing:.08em;text-transform:uppercase;margin-bottom:7px}
.form-input{width:100%;background:#0D0D0D;border:1px solid #2A2A2A;border-radius:8px;padding:9px 13px;color:#F0EDE8;font-family:'DM Sans',sans-serif;font-size:14px;transition:border-color .15s;outline:none}
.form-input:focus{border-color:#A3E635}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.form-select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23555' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:34px}
.filter-bar{display:flex;align-items:center;gap:10px;margin-bottom:22px;flex-wrap:wrap}
.filter-label{font-size:11px;font-weight:600;color:#555;letter-spacing:.08em;text-transform:uppercase}
.filter-btn{padding:5px 13px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid #2A2A2A;background:transparent;color:#666;transition:all .15s}
.filter-btn:hover{border-color:#555;color:#F0EDE8}
.filter-btn.active{background:rgba(163,230,53,.12);border-color:rgba(163,230,53,.4);color:#A3E635}
.info-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;margin-bottom:28px}
.info-card{background:#141414;border:1px solid #1E1E1E;border-radius:10px;padding:16px}
.info-card-label{font-size:10px;font-weight:700;color:#444;letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px}
.info-card-val{font-family:'Barlow Condensed',sans-serif;font-size:19px;font-weight:800;color:#F0EDE8}
.notice{padding:13px 17px;border-radius:8px;font-size:13px;margin-bottom:18px}
.notice-info{background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);color:#93C5FD}
.notice-success{background:rgba(163,230,53,.08);border:1px solid rgba(163,230,53,.2);color:#A3E635}
.notice-warn{background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.2);color:#FCD34D}
.create-tournament-btn{position:fixed;bottom:28px;right:28px;padding:13px 22px;background:#A3E635;color:#0D0D0D;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;border:none;border-radius:50px;cursor:pointer;box-shadow:0 8px 32px rgba(163,230,53,.3);transition:all .2s}
.create-tournament-btn:hover{background:#B5F03F;transform:translateY(-2px)}
.tag{display:inline-block;font-size:11px;font-weight:600;padding:3px 9px;border-radius:20px;background:#1E1E1E;color:#666;letter-spacing:.04em}
/* Spirit scoring */
.spirit-row{display:grid;grid-template-columns:1fr 160px;align-items:center;gap:16px;padding:14px 18px;background:#0D0D0D;border:1px solid #1E1E1E;border-radius:8px;margin-bottom:8px}
.spirit-cat-label{font-size:12px;color:#888;font-weight:500}
.spirit-rating{display:flex;gap:4px}
.spirit-dot{width:26px;height:26px;border-radius:6px;border:1.5px solid #2A2A2A;background:transparent;color:#555;font-size:11px;font-weight:700;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;font-family:'DM Sans',sans-serif}
.spirit-dot.active{background:#A3E635;border-color:#A3E635;color:#0D0D0D}
.spirit-dot:hover:not(.active){border-color:#A3E635;color:#A3E635}
.spirit-table{width:100%;border-collapse:collapse}
.spirit-table th{padding:9px 14px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#444;border-bottom:1px solid #1E1E1E}
.spirit-table td{padding:11px 14px;font-size:13px;border-bottom:1px solid #111}
.spirit-table tr:last-child td{border-bottom:none}
.spirit-table tr:hover td{background:#1A1A1A}
.spirit-score-pill{font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:900}
.spirit-score-high{color:#A3E635}
.spirit-score-mid{color:#FCD34D}
.spirit-score-low{color:#F87171}
/* Emoji picker */
.emoji-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:8px}
.emoji-option{width:38px;height:38px;border-radius:7px;border:1.5px solid #2A2A2A;background:transparent;cursor:pointer;font-size:19px;display:flex;align-items:center;justify-content:center;transition:all .15s}
.emoji-option:hover{border-color:#A3E635;background:rgba(163,230,53,.1)}
.emoji-option.selected{border-color:#A3E635;background:rgba(163,230,53,.15)}
/* Pool preview */
.pool-preview{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.pool-pill{padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:.05em}
/* Admin game management */
.games-admin-table{width:100%;border-collapse:collapse}
.games-admin-table th{padding:8px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#444;border-bottom:1px solid #1E1E1E;white-space:nowrap}
.games-admin-table td{padding:10px 12px;font-size:12px;border-bottom:1px solid #111}
.games-admin-table tr:hover td{background:#1A1A1A}
.next-round-banner{background:rgba(163,230,53,.06);border:1px solid rgba(163,230,53,.2);border-radius:10px;padding:14px 18px;margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
`;

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const EMOJI_LOGOS = ['🐦‍⬛','🦈','🥷','⚔️','🦅','⚡','🔥','💨','🏴‍☠️','☄️','🌪️','🐆','✨','🐂','🔱','🐻','🌊','🦁','🦊','🐝','🦋','🐯','🦉','🐺','🐉'];
const SPIRIT_CATS = ['Rules Knowledge','Fouls & Contact','Fair-mindedness','Attitude & Comm.','Overall Spirit'];
const FIELDS = ['Field 1','Field 2','Field 3','Field 4','Main Field','Side Field'];
const USERS = {
  admin: { id: 'u1', name: 'Alex Admin', role: 'admin' },
  leader: { id: 'u2', name: 'Sam Leader', role: 'leader', teamId: 't1' },
  user: { id: 'u3', name: 'Jordan Fan', role: 'user' },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const initials = (n) => n ? n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '??';

function calcPoolCount(n, format) {
  if (format !== 'pool') return 0;
  if (n <= 4) return 1;
  if (n <= 8) return 2;
  if (n <= 12) return 3;
  return Math.ceil(n / 4);
}
function getMinTeams(format) { return format === 'roundrobin' ? 3 : 4; }

function assignToPools(teams, poolCount) {
  const labels = 'ABCDEFGH'.split('');
  return teams.map((t, i) => ({ ...t, pool: labels[i % poolCount] }));
}

function genPoolGames(teams, tid, date) {
  const byPool = {};
  teams.forEach(t => { if (!byPool[t.pool]) byPool[t.pool] = []; byPool[t.pool].push(t); });
  const games = []; let c = 0;
  const times = ['09:00','10:30','12:00','13:30','15:00','16:30'];
  Object.entries(byPool).forEach(([pool, pts]) => {
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      games.push({ id: `gen_${crypto.randomUUID()}_${c}`, tournamentId: tid, pool, round: null, homeId: pts[i].id, awayId: pts[j].id, homeTeam: pts[i].name, awayTeam: pts[j].name, time: times[c % times.length], date: date || '', field: `Field ${(c % 2) + 1}`, score: null, status: 'scheduled' });
      c++;
    }
  });
  return games;
}

function genRRGames(teams, tid, date) {
  const games = []; let c = 0;
  const times = ['09:00','10:30','12:00','13:30','15:00'];
  const roundSize = Math.floor(teams.length / 2);
  for (let i = 0; i < teams.length; i++) for (let j = i + 1; j < teams.length; j++) {
    const round = `Round ${Math.floor(c / Math.max(roundSize, 1)) + 1}`;
    games.push({ id: `gen_${crypto.randomUUID()}_${c}`, tournamentId: tid, pool: null, round, homeId: teams[i].id, awayId: teams[j].id, homeTeam: teams[i].name, awayTeam: teams[j].name, time: times[c % times.length], date: date || '', field: `Field ${(c % 2) + 1}`, score: null, status: 'scheduled' });
    c++;
  }
  return games;
}

function genBracketGames(teams, tid, date) {
  const games = []; const n = teams.length;
  const roundName = n <= 2 ? 'Final' : n <= 4 ? 'Semi Final' : 'Quarter Final';
  for (let i = 0; i < Math.floor(n / 2); i++) {
    games.push({ id: `gen_${crypto.randomUUID()}_${i}`, tournamentId: tid, pool: null, round: roundName, homeId: teams[i].id, awayId: teams[n - 1 - i].id, homeTeam: teams[i].name, awayTeam: teams[n - 1 - i].name, time: `${9 + i * 2}:00`, date: date || '', field: `Field ${(i % 2) + 1}`, score: null, status: 'scheduled' });
  }
  return games;
}

function getRecord(teamId, tid, games) {
  const played = games.filter(g => g.tournamentId === tid && (g.homeId === teamId || g.awayId === teamId) && g.status === 'completed' && g.score);
  let w = 0, l = 0, pf = 0, pa = 0;
  played.forEach(g => {
    const [h, a] = g.score.split('-').map(Number);
    if (g.homeId === teamId) { pf += h; pa += a; (h > a ? w++ : l++); }
    else { pf += a; pa += h; (a > h ? w++ : l++); }
  });
  return { w, l, pf, pa, played: played.length };
}

function generateCrossovers(tournament, teams, games) {
  const tTeams = teams.filter(t => t.tournamentId === tournament.id && t.pool);
  const pools = [...new Set(tTeams.map(t => t.pool))].sort();
  const standings = {};
  pools.forEach(p => {
    standings[p] = tTeams.filter(t => t.pool === p)
      .map(t => ({ ...t, ...getRecord(t.id, tournament.id, games) }))
      .sort((a, b) => (b.w - a.w) || ((b.pf - b.pa) - (a.pf - a.pa)));
  });
  const newGames = [];
  const maxRank = Math.min(...pools.map(p => standings[p].length));
  for (let r = 0; r < maxRank; r++) {
    const rankTeams = pools.map(p => standings[p][r]).filter(Boolean);
    if (rankTeams.length >= 2) {
      const label = r === 0 ? 'Final' : r === 1 ? '3rd Place' : `Crossover ${r + 1}`;
      newGames.push({ id: `cross_${crypto.randomUUID()}_${r}`, tournamentId: tournament.id, pool: null, round: label, homeId: rankTeams[0].id, awayId: rankTeams[1].id, homeTeam: rankTeams[0].name, awayTeam: rankTeams[1].name, time: `${9 + r * 2}:00`, date: tournament.endDate || tournament.date, field: `Field ${(r % 2) + 1}`, score: null, status: 'scheduled' });
    }
  }
  return newGames;
}

function generateNextBracketRound(tournament, games) {
  const roundOrder = ['Quarter Final', 'Semi Final', 'Final'];
  const tGames = games.filter(g => g.tournamentId === tournament.id);
  for (let ri = 0; ri < roundOrder.length; ri++) {
    const rGames = tGames.filter(g => g.round === roundOrder[ri]);
    if (!rGames.length) continue;
    if (!rGames.every(g => g.status === 'completed' && g.score)) return null;
    const nextRound = roundOrder[ri + 1]; if (!nextRound) return null;
    if (tGames.some(g => g.round === nextRound)) return null;
    const winners = rGames.map(g => {
      const [h, a] = g.score.split('-').map(Number);
      return h > a ? { id: g.homeId, name: g.homeTeam } : { id: g.awayId, name: g.awayTeam };
    });
    const newGames = [];
    for (let i = 0; i < winners.length; i += 2) {
      if (winners[i + 1]) newGames.push({ id: `next_${crypto.randomUUID()}_${i}`, tournamentId: tournament.id, pool: null, round: nextRound, homeId: winners[i].id, awayId: winners[i + 1].id, homeTeam: winners[i].name, awayTeam: winners[i + 1].name, time: '14:00', date: tournament.endDate || tournament.date, field: 'Field 1', score: null, status: 'scheduled' });
    }
    return newGames.length ? newGames : null;
  }
  return null;
}

function canGenerateCrossovers(tournament, teams, games) {
  if (tournament.format !== 'pool') return false;
  const tTeams = teams.filter(t => t.tournamentId === tournament.id && t.pool);
  const pools = [...new Set(tTeams.map(t => t.pool))];
  if (pools.length < 2) return false;
  const poolGames = games.filter(g => g.tournamentId === tournament.id && g.pool);
  if (!poolGames.length) return false;
  const hasCross = games.some(g => g.tournamentId === tournament.id && !g.pool && (g.round === 'Final' || g.round === '3rd Place' || g.round?.startsWith('Cross')));
  if (hasCross) return false;
  return poolGames.every(g => g.status === 'completed');
}

function getSpiritColor(avg) {
  if (avg >= 14) return 'spirit-score-high';
  if (avg >= 10) return 'spirit-score-mid';
  return 'spirit-score-low';
}

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const INIT_DATA = {
  tournaments: [
    { id: 'tr1', name: 'Cardiff Open 2025', location: 'Bute Park, Cardiff', date: '2025-06-14', endDate: '2025-06-15', status: 'ongoing', format: 'pool', description: 'Annual open tournament in Cardiff. 6 teams across 2 pools, top 2 advance to crossovers.', teamLimit: 8, memberLimit: [10, 16], teamsJoined: 6 },
    { id: 'tr2', name: 'Bristol Summer Cup', location: 'Ashton Court, Bristol', date: '2025-07-20', endDate: '2025-07-20', status: 'upcoming', format: 'roundrobin', description: 'Single-day round-robin with 4 teams. Fun and fast paced.', teamLimit: 4, memberLimit: [8, 12], teamsJoined: 4 },
    { id: 'tr3', name: 'London Masters 2025', location: 'Hackney Marshes, London', date: '2025-08-09', endDate: '2025-08-10', status: 'upcoming', format: 'bracket', description: 'Competitive bracket tournament for top-tier teams. 8 teams, single elimination.', teamLimit: 8, memberLimit: [12, 20], teamsJoined: 8 },
    { id: 'tr4', name: 'Welsh Winter Classic', location: 'Sophia Gardens, Cardiff', date: '2024-12-07', endDate: '2024-12-07', status: 'completed', format: 'roundrobin', description: 'End-of-year round robin event. 4 teams, all games played.', teamLimit: 4, memberLimit: [8, 12], teamsJoined: 4 },
  ],
  teams: [
    // TR1 - Pool Play
    { id: 't1', tournamentId: 'tr1', name: 'Cardiff Crows', logo: '🐦‍⬛', leader: 'Sam Leader', leaderId: 'u2', pool: 'A', members: [{ id: 'm1', name: 'Sam Leader', position: 'Handler', number: 7, isLeader: true }, { id: 'm2', name: 'Priya Shah', position: 'Cutter', number: 12 }, { id: 'm3', name: 'Tobias Fox', position: 'Handler', number: 3 }, { id: 'm4', name: 'Nina Chen', position: 'Cutter', number: 18 }, { id: 'm5', name: 'Jake Morris', position: 'Hybrid', number: 5 }] },
    { id: 't2', tournamentId: 'tr1', name: 'Swansea Sharks', logo: '🦈', leader: 'Megan Price', leaderId: 'u5', pool: 'A', members: [{ id: 'm6', name: 'Megan Price', position: 'Handler', number: 1, isLeader: true }, { id: 'm7', name: 'Dan Hughes', position: 'Cutter', number: 9 }, { id: 'm8', name: 'Lily Park', position: 'Cutter', number: 22 }, { id: 'm9', name: 'Kai Brent', position: 'Handler', number: 4 }] },
    { id: 't3', tournamentId: 'tr1', name: 'Newport Ninjas', logo: '🥷', leader: 'Aaron Walsh', leaderId: 'u13', pool: 'A', members: [{ id: 'm10', name: 'Aaron Walsh', position: 'Handler', number: 2, isLeader: true }, { id: 'm11', name: 'Fiona Lam', position: 'Cutter', number: 14 }, { id: 'm12', name: 'Rhys Evans', position: 'Hybrid', number: 8 }] },
    { id: 't4', tournamentId: 'tr1', name: 'Bristol Blades', logo: '⚔️', leader: 'Ollie Grant', leaderId: 'u6', pool: 'B', members: [{ id: 'm13', name: 'Ollie Grant', position: 'Handler', number: 4, isLeader: true }, { id: 'm14', name: 'Amy Chang', position: 'Cutter', number: 11 }, { id: 'm15', name: 'Ryan Bell', position: 'Hybrid', number: 6 }, { id: 'm16', name: 'Zara Ahmed', position: 'Cutter', number: 15 }] },
    { id: 't5', tournamentId: 'tr1', name: 'Oxford Hawks', logo: '🦅', leader: 'Will Turner', leaderId: 'u7', pool: 'B', members: [{ id: 'm17', name: 'Will Turner', position: 'Handler', number: 2, isLeader: true }, { id: 'm18', name: 'Faye Liu', position: 'Cutter', number: 8 }, { id: 'm19', name: 'Oscar Patel', position: 'Hybrid', number: 16 }] },
    { id: 't6', tournamentId: 'tr1', name: 'Bath Storm', logo: '⚡', leader: 'Clara Wells', leaderId: 'u14', pool: 'B', members: [{ id: 'm20', name: 'Clara Wells', position: 'Handler', number: 10, isLeader: true }, { id: 'm21', name: 'Hamid Khan', position: 'Cutter', number: 3 }, { id: 'm22', name: 'Jen Okafor', position: 'Cutter', number: 19 }, { id: 'm23', name: 'Tom Reid', position: 'Handler', number: 7 }] },
    // TR2 - Round Robin
    { id: 't7', tournamentId: 'tr2', name: 'Bath Burn', logo: '🔥', leader: 'Chris Lane', leaderId: 'u8', pool: null, members: [{ id: 'm24', name: 'Chris Lane', position: 'Handler', number: 10, isLeader: true }, { id: 'm25', name: 'Asha Roy', position: 'Cutter', number: 5 }] },
    { id: 't8', tournamentId: 'tr2', name: 'Swindon Surge', logo: '💨', leader: 'Tommy Nash', leaderId: 'u12', pool: null, members: [{ id: 'm26', name: 'Tommy Nash', position: 'Handler', number: 1, isLeader: true }] },
    { id: 't9', tournamentId: 'tr2', name: 'Exeter Eagles', logo: '🦅', leader: 'Sofia Green', leaderId: 'u11', pool: null, members: [{ id: 'm27', name: 'Sofia Green', position: 'Cutter', number: 9, isLeader: true }] },
    { id: 't10', tournamentId: 'tr2', name: 'Plymouth Pirates', logo: '🏴‍☠️', leader: 'Lucas Ray', leaderId: 'u10', pool: null, members: [{ id: 'm28', name: 'Lucas Ray', position: 'Handler', number: 6, isLeader: true }] },
    // TR3 - Bracket
    { id: 't11', tournamentId: 'tr3', name: 'London Lightning', logo: '⚡', leader: 'Maya Ford', leaderId: 'u20', pool: null, members: [{ id: 'm29', name: 'Maya Ford', position: 'Handler', number: 1, isLeader: true }] },
    { id: 't12', tournamentId: 'tr3', name: 'Cambridge Comets', logo: '☄️', leader: 'Pete Shaw', leaderId: 'u21', pool: null, members: [{ id: 'm30', name: 'Pete Shaw', position: 'Cutter', number: 11, isLeader: true }] },
    { id: 't13', tournamentId: 'tr3', name: 'Manchester Mavs', logo: '🌪️', leader: 'Isla Brennan', leaderId: 'u22', pool: null, members: [{ id: 'm31', name: 'Isla Brennan', position: 'Handler', number: 7, isLeader: true }] },
    { id: 't14', tournamentId: 'tr3', name: 'Leeds Lynx', logo: '🐆', leader: 'Zack Moore', leaderId: 'u23', pool: null, members: [{ id: 'm32', name: 'Zack Moore', position: 'Hybrid', number: 4, isLeader: true }] },
    { id: 't15', tournamentId: 'tr3', name: 'Sheffield Sparks', logo: '✨', leader: 'Bea Cross', leaderId: 'u24', pool: null, members: [{ id: 'm33', name: 'Bea Cross', position: 'Cutter', number: 8, isLeader: true }] },
    { id: 't16', tournamentId: 'tr3', name: 'Birmingham Bulls', logo: '🐂', leader: 'Ray Osei', leaderId: 'u25', pool: null, members: [{ id: 'm34', name: 'Ray Osei', position: 'Handler', number: 2, isLeader: true }] },
    { id: 't17', tournamentId: 'tr3', name: 'Liverpool Legends', logo: '🔱', leader: 'Nat Dunn', leaderId: 'u26', pool: null, members: [{ id: 'm35', name: 'Nat Dunn', position: 'Cutter', number: 17, isLeader: true }] },
    { id: 't18', tournamentId: 'tr3', name: 'Newcastle Ninjas', logo: '🥷', leader: 'Cass Ward', leaderId: 'u27', pool: null, members: [{ id: 'm36', name: 'Cass Ward', position: 'Handler', number: 5, isLeader: true }] },
    // TR4 - Completed
    { id: 't19', tournamentId: 'tr4', name: 'Cardiff Crows B', logo: '🐦‍⬛', leader: 'Sam Leader', leaderId: 'u2', pool: null, members: [{ id: 'm37', name: 'Sam Leader', position: 'Handler', number: 7, isLeader: true }, { id: 'm38', name: 'Priya Shah', position: 'Cutter', number: 12 }] },
    { id: 't20', tournamentId: 'tr4', name: 'Swansea Surge', logo: '🌊', leader: 'Dan Hughes', leaderId: 'u5', pool: null, members: [{ id: 'm39', name: 'Dan Hughes', position: 'Cutter', number: 9, isLeader: true }] },
    { id: 't21', tournamentId: 'tr4', name: 'Newport Ninjas B', logo: '🥷', leader: 'Fiona Lam', leaderId: 'u13', pool: null, members: [{ id: 'm40', name: 'Fiona Lam', position: 'Cutter', number: 14, isLeader: true }] },
    { id: 't22', tournamentId: 'tr4', name: 'Bristol Bears', logo: '🐻', leader: 'Amy Chang', leaderId: 'u6', pool: null, members: [{ id: 'm41', name: 'Amy Chang', position: 'Cutter', number: 11, isLeader: true }] },
  ],
  applications: [
    { id: 'a1', tournamentId: 'tr1', teamName: 'Newport Ninjas', leader: 'Emma West', leaderId: 'u9', status: 'pending', appliedAt: '2025-05-01' },
    { id: 'a2', tournamentId: 'tr1', teamName: 'Plymouth Pirates', leader: 'Lucas Ray', leaderId: 'u10', status: 'approved', appliedAt: '2025-04-28' },
    { id: 'a3', tournamentId: 'tr2', teamName: 'Swindon Surge', leader: 'Tommy Nash', leaderId: 'u12', status: 'pending', appliedAt: '2025-06-01' },
  ],
  games: [
    // TR1 Pool A (t1 Cardiff, t2 Swansea, t3 Newport)
    { id: 'g1', tournamentId: 'tr1', pool: 'A', round: null, homeId: 't1', awayId: 't2', homeTeam: 'Cardiff Crows', awayTeam: 'Swansea Sharks', time: '09:00', date: '2025-06-14', field: 'Field 1', score: '13-10', status: 'completed' },
    { id: 'g2', tournamentId: 'tr1', pool: 'A', round: null, homeId: 't1', awayId: 't3', homeTeam: 'Cardiff Crows', awayTeam: 'Newport Ninjas', time: '11:00', date: '2025-06-14', field: 'Field 2', score: '8-11', status: 'completed' },
    { id: 'g3', tournamentId: 'tr1', pool: 'A', round: null, homeId: 't2', awayId: 't3', homeTeam: 'Swansea Sharks', awayTeam: 'Newport Ninjas', time: '13:00', date: '2025-06-14', field: 'Field 1', score: '9-12', status: 'completed' },
    // TR1 Pool B (t4 Bristol, t5 Oxford, t6 Bath)
    { id: 'g4', tournamentId: 'tr1', pool: 'B', round: null, homeId: 't4', awayId: 't5', homeTeam: 'Bristol Blades', awayTeam: 'Oxford Hawks', time: '09:00', date: '2025-06-14', field: 'Field 2', score: '15-12', status: 'completed' },
    { id: 'g5', tournamentId: 'tr1', pool: 'B', round: null, homeId: 't4', awayId: 't6', homeTeam: 'Bristol Blades', awayTeam: 'Bath Storm', time: '11:00', date: '2025-06-14', field: 'Field 1', score: '10-11', status: 'completed' },
    { id: 'g6', tournamentId: 'tr1', pool: 'B', round: null, homeId: 't5', awayId: 't6', homeTeam: 'Oxford Hawks', awayTeam: 'Bath Storm', time: '13:00', date: '2025-06-14', field: 'Field 2', score: '8-14', status: 'completed' },
    // TR1 Crossovers
    { id: 'g7', tournamentId: 'tr1', pool: null, round: 'Final', homeId: 't3', awayId: 't6', homeTeam: 'Newport Ninjas', awayTeam: 'Bath Storm', time: '10:00', date: '2025-06-15', field: 'Main Field', score: null, status: 'scheduled' },
    { id: 'g8', tournamentId: 'tr1', pool: null, round: '3rd Place', homeId: 't1', awayId: 't4', homeTeam: 'Cardiff Crows', awayTeam: 'Bristol Blades', time: '10:00', date: '2025-06-15', field: 'Field 2', score: null, status: 'scheduled' },
    { id: 'g9', tournamentId: 'tr1', pool: null, round: '5th Place', homeId: 't2', awayId: 't5', homeTeam: 'Swansea Sharks', awayTeam: 'Oxford Hawks', time: '12:00', date: '2025-06-15', field: 'Field 1', score: null, status: 'scheduled' },
    // TR2 Round Robin (6 games)
    { id: 'g10', tournamentId: 'tr2', pool: null, round: 'Round 1', homeId: 't7', awayId: 't8', homeTeam: 'Bath Burn', awayTeam: 'Swindon Surge', time: '09:00', date: '2025-07-20', field: 'Field 1', score: null, status: 'scheduled' },
    { id: 'g11', tournamentId: 'tr2', pool: null, round: 'Round 1', homeId: 't9', awayId: 't10', homeTeam: 'Exeter Eagles', awayTeam: 'Plymouth Pirates', time: '09:00', date: '2025-07-20', field: 'Field 2', score: null, status: 'scheduled' },
    { id: 'g12', tournamentId: 'tr2', pool: null, round: 'Round 2', homeId: 't7', awayId: 't9', homeTeam: 'Bath Burn', awayTeam: 'Exeter Eagles', time: '11:00', date: '2025-07-20', field: 'Field 1', score: null, status: 'scheduled' },
    { id: 'g13', tournamentId: 'tr2', pool: null, round: 'Round 2', homeId: 't8', awayId: 't10', homeTeam: 'Swindon Surge', awayTeam: 'Plymouth Pirates', time: '11:00', date: '2025-07-20', field: 'Field 2', score: null, status: 'scheduled' },
    { id: 'g14', tournamentId: 'tr2', pool: null, round: 'Round 3', homeId: 't7', awayId: 't10', homeTeam: 'Bath Burn', awayTeam: 'Plymouth Pirates', time: '14:00', date: '2025-07-20', field: 'Field 1', score: null, status: 'scheduled' },
    { id: 'g15', tournamentId: 'tr2', pool: null, round: 'Round 3', homeId: 't8', awayId: 't9', homeTeam: 'Swindon Surge', awayTeam: 'Exeter Eagles', time: '14:00', date: '2025-07-20', field: 'Field 2', score: null, status: 'scheduled' },
    // TR3 Bracket (7 games)
    { id: 'g16', tournamentId: 'tr3', pool: null, round: 'Quarter Final', homeId: 't11', awayId: 't18', homeTeam: 'London Lightning', awayTeam: 'Newcastle Ninjas', time: '09:00', date: '2025-08-09', field: 'Field 1', score: null, status: 'scheduled' },
    { id: 'g17', tournamentId: 'tr3', pool: null, round: 'Quarter Final', homeId: 't12', awayId: 't17', homeTeam: 'Cambridge Comets', awayTeam: 'Liverpool Legends', time: '09:00', date: '2025-08-09', field: 'Field 2', score: null, status: 'scheduled' },
    { id: 'g18', tournamentId: 'tr3', pool: null, round: 'Quarter Final', homeId: 't13', awayId: 't16', homeTeam: 'Manchester Mavs', awayTeam: 'Birmingham Bulls', time: '11:00', date: '2025-08-09', field: 'Field 1', score: null, status: 'scheduled' },
    { id: 'g19', tournamentId: 'tr3', pool: null, round: 'Quarter Final', homeId: 't14', awayId: 't15', homeTeam: 'Leeds Lynx', awayTeam: 'Sheffield Sparks', time: '11:00', date: '2025-08-09', field: 'Field 2', score: null, status: 'scheduled' },
    { id: 'g20', tournamentId: 'tr3', pool: null, round: 'Semi Final', homeId: 'tbd', awayId: 'tbd', homeTeam: 'TBD (QF1 winner)', awayTeam: 'TBD (QF2 winner)', time: '14:00', date: '2025-08-09', field: 'Main Field', score: null, status: 'scheduled' },
    { id: 'g21', tournamentId: 'tr3', pool: null, round: 'Semi Final', homeId: 'tbd', awayId: 'tbd', homeTeam: 'TBD (QF3 winner)', awayTeam: 'TBD (QF4 winner)', time: '14:00', date: '2025-08-09', field: 'Field 3', score: null, status: 'scheduled' },
    { id: 'g22', tournamentId: 'tr3', pool: null, round: 'Final', homeId: 'tbd', awayId: 'tbd', homeTeam: 'TBD (SF1 winner)', awayTeam: 'TBD (SF2 winner)', time: '14:00', date: '2025-08-10', field: 'Main Field', score: null, status: 'scheduled' },
    // TR4 Completed Round Robin (6 games)
    { id: 'g23', tournamentId: 'tr4', pool: null, round: 'Round 1', homeId: 't19', awayId: 't20', homeTeam: 'Cardiff Crows B', awayTeam: 'Swansea Surge', time: '09:00', date: '2024-12-07', field: 'Field 1', score: '11-9', status: 'completed' },
    { id: 'g24', tournamentId: 'tr4', pool: null, round: 'Round 1', homeId: 't21', awayId: 't22', homeTeam: 'Newport Ninjas B', awayTeam: 'Bristol Bears', time: '09:00', date: '2024-12-07', field: 'Field 2', score: '13-11', status: 'completed' },
    { id: 'g25', tournamentId: 'tr4', pool: null, round: 'Round 2', homeId: 't19', awayId: 't21', homeTeam: 'Cardiff Crows B', awayTeam: 'Newport Ninjas B', time: '11:00', date: '2024-12-07', field: 'Field 1', score: '8-12', status: 'completed' },
    { id: 'g26', tournamentId: 'tr4', pool: null, round: 'Round 2', homeId: 't20', awayId: 't22', homeTeam: 'Swansea Surge', awayTeam: 'Bristol Bears', time: '11:00', date: '2024-12-07', field: 'Field 2', score: '10-9', status: 'completed' },
    { id: 'g27', tournamentId: 'tr4', pool: null, round: 'Round 3', homeId: 't19', awayId: 't22', homeTeam: 'Cardiff Crows B', awayTeam: 'Bristol Bears', time: '14:00', date: '2024-12-07', field: 'Field 1', score: '15-10', status: 'completed' },
    { id: 'g28', tournamentId: 'tr4', pool: null, round: 'Round 3', homeId: 't20', awayId: 't21', homeTeam: 'Swansea Surge', awayTeam: 'Newport Ninjas B', time: '14:00', date: '2024-12-07', field: 'Field 2', score: '7-11', status: 'completed' },
  ],
  spiritScores: [
    { id: 'ss1', tournamentId: 'tr4', fromTeamId: 't19', toTeamId: 't20', scores: [3, 3, 4, 3, 3], comment: 'Great game, very friendly team!' },
    { id: 'ss2', tournamentId: 'tr4', fromTeamId: 't19', toTeamId: 't21', scores: [2, 2, 3, 3, 3], comment: 'A few calls we disagreed on but overall fine.' },
    { id: 'ss3', tournamentId: 'tr4', fromTeamId: 't20', toTeamId: 't19', scores: [4, 3, 4, 4, 4], comment: 'Cardiff always play with great spirit.' },
    { id: 'ss4', tournamentId: 'tr4', fromTeamId: 't21', toTeamId: 't19', scores: [3, 4, 3, 3, 3], comment: 'Solid team.' },
    { id: 'ss5', tournamentId: 'tr4', fromTeamId: 't22', toTeamId: 't21', scores: [4, 4, 4, 4, 4], comment: 'Best spirit of the tournament!' },
  ],
};

// ─── MODAL WRAPPER ────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ─── SPIRIT SCORE MODAL ───────────────────────────────────────────────────────
function SpiritScoreModal({ opponent, existing, onClose, onSave }) {
  const [scores, setScores] = useState(existing?.scores || [2, 2, 2, 2, 2]);
  const [comment, setComment] = useState(existing?.comment || '');
  const total = scores.reduce((a, b) => a + b, 0);
  return (
    <Modal title={`SPIRIT SCORE — ${opponent.name}`} onClose={onClose} footer={
      <>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={() => onSave({ scores, comment })}>Save Score</button>
      </>
    }>
      <div className="notice notice-info" style={{ marginBottom: 20 }}>Rate each category 0–4. Total: {total}/20</div>
      {SPIRIT_CATS.map((cat, ci) => (
        <div key={ci} className="spirit-row">
          <span className="spirit-cat-label">{cat}</span>
          <div className="spirit-rating">
            {[0, 1, 2, 3, 4].map(v => (
              <button key={v} className={`spirit-dot ${scores[ci] === v ? 'active' : ''}`} onClick={() => { const s = [...scores]; s[ci] = v; setScores(s); }}>{v}</button>
            ))}
          </div>
        </div>
      ))}
      <div className="form-group" style={{ marginTop: 16, marginBottom: 0 }}>
        <label className="form-label">Comment (optional)</label>
        <textarea className="form-input" rows={2} value={comment} onChange={e => setComment(e.target.value)} style={{ resize: 'vertical' }} placeholder="Any notes about the game..." />
      </div>
    </Modal>
  );
}

// ─── EDIT GAME MODAL ──────────────────────────────────────────────────────────
function EditGameModal({ game, teams, onClose, onSave }) {
  const parsedScore = game.score ? game.score.split('-') : ['', ''];
  const [homeScore, setHomeScore] = useState(parsedScore[0]);
  const [awayScore, setAwayScore] = useState(parsedScore[1]);
  const [field, setField] = useState(game.field || 'Field 1');
  const [date, setDate] = useState(game.date || '');
  const [time, setTime] = useState(game.time || '09:00');
  const [status, setStatus] = useState(game.status);
  const save = () => {
    const score = homeScore !== '' && awayScore !== '' ? `${homeScore}-${awayScore}` : null;
    onSave({ ...game, score, field, date, time, status: score ? 'completed' : status });
  };
  return (
    <Modal title="EDIT GAME" onClose={onClose} footer={
      <>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={save}>Save</button>
      </>
    }>
      <div style={{ background: '#0D0D0D', border: '1px solid #1E1E1E', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 800 }}>{game.homeTeam} <span style={{ color: '#555' }}>vs</span> {game.awayTeam}</div>
        {game.round && <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>{game.round}</div>}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">{game.homeTeam} Score</label>
          <input type="number" min="0" className="form-input" value={homeScore} onChange={e => setHomeScore(e.target.value)} placeholder="0" />
        </div>
        <div className="form-group">
          <label className="form-label">{game.awayTeam} Score</label>
          <input type="number" min="0" className="form-input" value={awayScore} onChange={e => setAwayScore(e.target.value)} placeholder="0" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Field</label>
        <select className="form-input form-select" value={field} onChange={e => setField(e.target.value)}>
          {FIELDS.map(f => <option key={f}>{f}</option>)}
        </select>
      </div>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Time</label><input type="time" className="form-input" value={time} onChange={e => setTime(e.target.value)} /></div>
      </div>
      <div className="form-group">
        <label className="form-label">Status</label>
        <select className="form-input form-select" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </Modal>
  );
}

// ─── ADD GAME MODAL ───────────────────────────────────────────────────────────
function AddGameModal({ tournament, teams, onClose, onSave }) {
  const tTeams = teams.filter(t => t.tournamentId === tournament.id);
  const pools = [...new Set(tTeams.map(t => t.pool).filter(Boolean))];
  const [form, setForm] = useState({ homeId: tTeams[0]?.id || '', awayId: tTeams[1]?.id || '', pool: pools[0] || null, round: '', field: 'Field 1', date: tournament.date, time: '09:00' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const homeTeam = tTeams.find(t => t.id === form.homeId);
  const awayTeam = tTeams.find(t => t.id === form.awayId);
  const save = () => {
    if (!homeTeam || !awayTeam || homeTeam.id === awayTeam.id) return;
    onSave({ id: `g${crypto.randomUUID()}`, tournamentId: tournament.id, pool: form.pool || null, round: form.round || null, homeId: homeTeam.id, awayId: awayTeam.id, homeTeam: homeTeam.name, awayTeam: awayTeam.name, time: form.time, date: form.date, field: form.field, score: null, status: 'scheduled' });
  };
  return (
    <Modal title="ADD GAME" onClose={onClose} footer={
      <>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={save}>Add Game</button>
      </>
    }>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Home Team</label>
          <select className="form-input form-select" value={form.homeId} onChange={e => set('homeId', e.target.value)}>
            {tTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Away Team</label>
          <select className="form-input form-select" value={form.awayId} onChange={e => set('awayId', e.target.value)}>
            {tTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>
      {tournament.format === 'pool' && (
        <div className="form-group">
          <label className="form-label">Pool</label>
          <select className="form-input form-select" value={form.pool || ''} onChange={e => set('pool', e.target.value || null)}>
            <option value="">— No Pool (Crossover)</option>
            {pools.map(p => <option key={p} value={p}>Pool {p}</option>)}
          </select>
        </div>
      )}
      <div className="form-group">
        <label className="form-label">Round / Stage</label>
        <input className="form-input" value={form.round} onChange={e => set('round', e.target.value)} placeholder="e.g. Round 1, Quarter Final, Final" />
      </div>
      <div className="form-group">
        <label className="form-label">Field</label>
        <select className="form-input form-select" value={form.field} onChange={e => set('field', e.target.value)}>
          {FIELDS.map(f => <option key={f}>{f}</option>)}
        </select>
      </div>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" value={form.date} onChange={e => set('date', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Time</label><input type="time" className="form-input" value={form.time} onChange={e => set('time', e.target.value)} /></div>
      </div>
    </Modal>
  );
}

// ─── EDIT TEAM MODAL ──────────────────────────────────────────────────────────
function EditTeamModal({ team, onClose, onSave }) {
  const [name, setName] = useState(team.name);
  const [leader, setLeader] = useState(team.leader);
  const [logo, setLogo] = useState(team.logo || '🐦');
  return (
    <Modal title="EDIT TEAM" onClose={onClose} footer={
      <>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={() => onSave({ ...team, name, leader, logo })}>Save</button>
      </>
    }>
      <div className="form-group"><label className="form-label">Team Name</label><input className="form-input" value={name} onChange={e => setName(e.target.value)} /></div>
      <div className="form-group"><label className="form-label">Team Leader</label><input className="form-input" value={leader} onChange={e => setLeader(e.target.value)} /></div>
      <div className="form-group">
        <label className="form-label">Team Logo</label>
        <div style={{ background: '#0D0D0D', border: '1px solid #2A2A2A', borderRadius: 10, padding: 12 }}>
          <div style={{ fontSize: 32, textAlign: 'center', marginBottom: 12 }}>{logo}</div>
          <div className="emoji-grid">{EMOJI_LOGOS.map(e => (
            <button key={e} className={`emoji-option ${logo === e ? 'selected' : ''}`} onClick={() => setLogo(e)}>{e}</button>
          ))}</div>
        </div>
      </div>
    </Modal>
  );
}

// ─── CREATE TOURNAMENT MODAL ──────────────────────────────────────────────────
function CreateTournamentModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ name: '', location: '', date: '', endDate: '', format: 'pool', teamLimit: 8, memberMin: 10, memberMax: 16, description: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const poolCount = calcPoolCount(+form.teamLimit, form.format);
  const minTeams = getMinTeams(form.format);
  const poolSizes = poolCount > 0 ? Array.from({ length: poolCount }, (_, i) => {
    const base = Math.floor(+form.teamLimit / poolCount);
    const extra = i < (+form.teamLimit % poolCount) ? 1 : 0;
    return base + extra;
  }) : [];
  const poolColors = ['#A3E635','#60A5FA','#FB923C','#C084FC','#F87171','#34D399','#FBBF24','#818CF8'];
  return (
    <Modal title="NEW TOURNAMENT" onClose={onClose} footer={
      <>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={+form.teamLimit < minTeams} onClick={() => { if (+form.teamLimit >= minTeams) { onCreate(form); onClose(); } }}>Create Tournament</button>
      </>
    }>
      <div className="form-group"><label className="form-label">Tournament Name</label><input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Cardiff Open 2025" /></div>
      <div className="form-group"><label className="form-label">Location</label><input className="form-input" value={form.location} onChange={e => set('location', e.target.value)} placeholder="Venue, City" /></div>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Start Date</label><input type="date" className="form-input" value={form.date} onChange={e => set('date', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">End Date</label><input type="date" className="form-input" value={form.endDate} onChange={e => set('endDate', e.target.value)} /></div>
      </div>
      <div className="form-group">
        <label className="form-label">Format</label>
        <select className="form-input form-select" value={form.format} onChange={e => set('format', e.target.value)}>
          <option value="pool">Pool Play (min {getMinTeams('pool')} teams)</option>
          <option value="roundrobin">Round Robin (min {getMinTeams('roundrobin')} teams)</option>
          <option value="bracket">Bracket (min {getMinTeams('bracket')} teams)</option>
        </select>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Max Teams</label>
          <input type="number" className="form-input" value={form.teamLimit} onChange={e => set('teamLimit', e.target.value)} min={minTeams} />
          {+form.teamLimit < minTeams && <div style={{ fontSize: 11, color: '#F87171', marginTop: 4 }}>Min {minTeams} teams for {form.format}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Roster Range</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="number" className="form-input" value={form.memberMin} onChange={e => set('memberMin', e.target.value)} placeholder="Min" />
            <span style={{ color: '#555' }}>–</span>
            <input type="number" className="form-input" value={form.memberMax} onChange={e => set('memberMax', e.target.value)} placeholder="Max" />
          </div>
        </div>
      </div>
      {+form.teamLimit >= minTeams && (
        <div className="form-group">
          <label className="form-label">Pool Preview</label>
          <div style={{ background: '#0D0D0D', border: '1px solid #2A2A2A', borderRadius: 8, padding: '10px 14px' }}>
            {form.format === 'pool' && poolCount > 0 ? (
              <>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>{form.teamLimit} teams → {poolCount} pool{poolCount > 1 ? 's' : ''}</div>
                <div className="pool-preview">
                  {'ABCDEFGH'.slice(0, poolCount).split('').map((p, i) => (
                    <span key={p} className="pool-pill" style={{ background: poolColors[i] + '20', color: poolColors[i] }}>Pool {p}: {poolSizes[i]} teams</span>
                  ))}
                </div>
              </>
            ) : form.format === 'roundrobin' ? (
              <div style={{ fontSize: 12, color: '#666' }}>{form.teamLimit} teams → {(form.teamLimit * (form.teamLimit - 1) / 2)} games (round robin)</div>
            ) : (
              <div style={{ fontSize: 12, color: '#666' }}>{form.teamLimit} teams → {form.teamLimit - 1} games (single elimination)</div>
            )}
          </div>
        </div>
      )}
      <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows={2} value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical' }} /></div>
    </Modal>
  );
}

// ─── ADD MEMBER / MEMBER MODALS ───────────────────────────────────────────────
function AddMemberModal({ team, tournament, onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', position: 'Handler', number: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const atMax = team.members.length >= tournament.memberLimit[1];
  return (
    <Modal title="ADD MEMBER" onClose={onClose} footer={
      <>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={atMax || !form.name} onClick={() => !atMax && form.name && onAdd(form)}>Add</button>
      </>
    }>
      {atMax && <div className="notice notice-warn">Team is at max capacity ({tournament.memberLimit[1]}).</div>}
      <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} /></div>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Position</label>
          <select className="form-input form-select" value={form.position} onChange={e => set('position', e.target.value)}>
            <option>Handler</option><option>Cutter</option><option>Hybrid</option>
          </select>
        </div>
        <div className="form-group"><label className="form-label">Jersey #</label><input type="number" className="form-input" value={form.number} onChange={e => set('number', e.target.value)} /></div>
      </div>
      <div style={{ color: '#555', fontSize: 12 }}>Members: {team.members.length} / {tournament.memberLimit[1]} (min: {tournament.memberLimit[0]})</div>
    </Modal>
  );
}

function MemberModal({ member, onClose }) {
  return (
    <Modal title="PLAYER PROFILE" onClose={onClose}>
      <div style={{ background: '#0D0D0D', border: '1px solid #1E1E1E', borderRadius: 10, padding: 20 }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#A3E635,#4ADE80)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 900, color: '#0D0D0D', marginBottom: 14 }}>{initials(member.name)}</div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 900, marginBottom: 4 }}>{member.name}</div>
        {member.isLeader && <span className="app-status-badge app-approved" style={{ display: 'inline-block', marginBottom: 14 }}>Team Captain</span>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          <div><div style={{ fontSize: 10, color: '#555', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Position</div><div style={{ fontWeight: 600 }}>{member.position}</div></div>
          <div><div style={{ fontSize: 10, color: '#555', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Jersey</div><div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 900, color: '#A3E635' }}>#{member.number}</div></div>
        </div>
      </div>
    </Modal>
  );
}

// ─── GAME CARD ────────────────────────────────────────────────────────────────
function GameCard({ game, filterTeamId, isAdmin, onEdit }) {
  const highlight = filterTeamId && (game.homeId === filterTeamId || game.awayId === filterTeamId);
  return (
    <div className={`game-card ${highlight ? 'highlight' : ''}`}>
      {isAdmin && <button className="game-edit-btn" onClick={e => { e.stopPropagation(); onEdit(game); }}>✎</button>}
      <div><div className="game-team home">{game.homeTeam}</div></div>
      <div className="game-center">
        {game.status === 'completed' && game.score ? <div className="game-score">{game.score}</div> : <div className="game-vs">VS</div>}
        <div className="game-time">{game.date} · {game.time}</div>
        {game.field && <div className="game-field-badge">{game.field}</div>}
        {game.status === 'scheduled' && <div style={{ fontSize: 10, color: '#FCD34D', marginTop: 3 }}>Scheduled</div>}
      </div>
      <div><div className="game-team">{game.awayTeam}</div></div>
    </div>
  );
}

// ─── SCHEDULE VIEWS ───────────────────────────────────────────────────────────
function PoolSchedule({ tournament, teams, games, filterTeamId, isAdmin, onEditGame }) {
  const tTeams = teams.filter(t => t.tournamentId === tournament.id && t.pool);
  const pools = [...new Set(tTeams.map(t => t.pool))].sort();
  const crossovers = games.filter(g => g.tournamentId === tournament.id && !g.pool);
  const crossRounds = [...new Set(crossovers.map(g => g.round).filter(Boolean))];
  if (!pools.length) return <div className="empty-state"><div className="empty-icon">📋</div><div className="empty-title">No Pools Set Up</div><div className="empty-sub">Admin must generate the schedule first.</div></div>;
  return (
    <div>
      {pools.map(pool => {
        const poolTeams = tTeams.filter(t => t.pool === pool);
        const poolGames = games.filter(g => g.tournamentId === tournament.id && g.pool === pool);
        const filtered = filterTeamId ? poolGames.filter(g => g.homeId === filterTeamId || g.awayId === filterTeamId) : poolGames;
        const standings = poolTeams.map(t => ({ ...t, ...getRecord(t.id, tournament.id, games) })).sort((a, b) => (b.w - a.w) || ((b.pf - b.pa) - (a.pf - a.pa)));
        return (
          <div key={pool} className="pool-section">
            <div className="pool-header"><span className="pool-name">POOL {pool}</span><span className="pool-badge">{poolTeams.length} Teams</span></div>
            <div style={{ padding: '14px 20px' }}>
              <table className="standings-table"><thead><tr><th>#</th><th>Team</th><th>W-L</th><th>PF-PA</th></tr></thead>
                <tbody>{standings.map((t, i) => (
                  <tr key={t.id}>
                    <td><span className={`team-rank ${i < 2 ? 'top' : ''}`}>{i + 1}</span></td>
                    <td><span>{t.logo}</span> <span className="team-name-link">{t.name}</span></td>
                    <td><span className="record">{t.w}-{t.l}</span></td>
                    <td style={{ color: '#555', fontSize: 12 }}>{t.pf}-{t.pa}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            {filtered.length > 0 && <div className="game-list">{filtered.map(g => <GameCard key={g.id} game={g} filterTeamId={filterTeamId} isAdmin={isAdmin} onEdit={onEditGame} />)}</div>}
          </div>
        );
      })}
      {crossRounds.map(round => {
        const roundGames = crossovers.filter(g => g.round === round);
        const filtered = filterTeamId ? roundGames.filter(g => g.homeId === filterTeamId || g.awayId === filterTeamId) : roundGames;
        if (filterTeamId && filtered.length === 0) return null;
        return (
          <div key={round} className="pool-section">
            <div className="pool-header"><span className="pool-name" style={{ color: '#FB923C' }}>{round}</span><span className="pool-badge" style={{ color: '#FB923C', background: 'rgba(251,146,60,.1)' }}>Crossover</span></div>
            <div className="game-list">{filtered.map(g => <GameCard key={g.id} game={g} filterTeamId={filterTeamId} isAdmin={isAdmin} onEdit={onEditGame} />)}</div>
          </div>
        );
      })}
    </div>
  );
}

function RoundRobinSchedule({ tournament, games, filterTeamId, isAdmin, onEditGame }) {
  const tGames = games.filter(g => g.tournamentId === tournament.id);
  const rounds = [...new Set(tGames.map(g => g.round).filter(Boolean))].sort();
  if (!rounds.length) return <div className="empty-state"><div className="empty-icon">📋</div><div className="empty-title">No Schedule Yet</div></div>;
  return (
    <div>
      {rounds.map(round => {
        const rg = tGames.filter(g => g.round === round);
        const filtered = filterTeamId ? rg.filter(g => g.homeId === filterTeamId || g.awayId === filterTeamId) : rg;
        if (filterTeamId && filtered.length === 0) return null;
        return (
          <div key={round} className="pool-section" style={{ marginBottom: 16 }}>
            <div className="round-header"><span className="round-title">{round}</span><span style={{ fontSize: 12, color: '#555' }}>{rg.length} games</span></div>
            <div className="game-list">{filtered.map(g => <GameCard key={g.id} game={g} filterTeamId={filterTeamId} isAdmin={isAdmin} onEdit={onEditGame} />)}</div>
          </div>
        );
      })}
    </div>
  );
}

function BracketSchedule({ tournament, games, filterTeamId, isAdmin, onEditGame }) {
  const tGames = games.filter(g => g.tournamentId === tournament.id);
  const roundOrder = ['Quarter Final', 'Semi Final', 'Final'];
  const rounds = roundOrder.filter(r => tGames.some(g => g.round === r));
  if (!rounds.length) return <div className="empty-state"><div className="empty-icon">🏆</div><div className="empty-title">Bracket Not Set</div><div className="empty-sub">Add teams and generate the bracket to see games here.</div></div>;
  return (
    <div>
      {rounds.map(round => {
        const rg = tGames.filter(g => g.round === round);
        const filtered = filterTeamId ? rg.filter(g => g.homeId === filterTeamId || g.awayId === filterTeamId) : rg;
        if (filterTeamId && filtered.length === 0) return null;
        return (
          <div key={round} className="pool-section" style={{ marginBottom: 16 }}>
            <div className="round-header"><span className="round-title" style={{ color: '#FB923C' }}>{round}</span><span style={{ fontSize: 12, color: '#555' }}>{rg.length} games</span></div>
            <div className="game-list">{filtered.map(g => <GameCard key={g.id} game={g} filterTeamId={filterTeamId} isAdmin={isAdmin} onEdit={onEditGame} />)}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── SPIRIT TAB ───────────────────────────────────────────────────────────────
function SpiritTab({ tournament, teams, games, spiritScores, user, role, onSpiritSave }) {
  const [scoring, setScoring] = useState(null);
  const tTeams = teams.filter(t => t.tournamentId === tournament.id);
  const myTeam = tTeams.find(t => t.leaderId === user.id);
  const tGames = games.filter(g => g.tournamentId === tournament.id && g.status === 'completed');
  const myOpponents = myTeam ? [...new Set(tGames.filter(g => g.homeId === myTeam.id || g.awayId === myTeam.id).map(g => g.homeId === myTeam.id ? g.awayId : g.homeId))] : [];

  const getTeamAvg = (teamId) => {
    const received = spiritScores.filter(s => s.tournamentId === tournament.id && s.toTeamId === teamId);
    if (!received.length) return null;
    const total = received.reduce((sum, s) => sum + s.scores.reduce((a, b) => a + b, 0), 0);
    return (total / received.length).toFixed(1);
  };
  const getMyScore = (teamId) => spiritScores.find(s => s.tournamentId === tournament.id && s.fromTeamId === myTeam?.id && s.toTeamId === teamId);

  return (
    <div>
      {role === 'leader' && myTeam && myOpponents.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div className="section-header"><span className="section-title" style={{ fontSize: 20 }}>SUBMIT SCORES</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {myOpponents.map(oid => {
              const opp = tTeams.find(t => t.id === oid); if (!opp) return null;
              const existing = getMyScore(oid);
              return (
                <div key={oid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: '#141414', border: '1px solid #1E1E1E', borderRadius: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 24 }}>{opp.logo}</span>
                    <div><div style={{ fontWeight: 600, fontSize: 14 }}>{opp.name}</div>{existing && <div style={{ fontSize: 11, color: '#A3E635', marginTop: 2 }}>Submitted · {existing.scores.reduce((a,b)=>a+b,0)}/20</div>}</div>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => setScoring(opp)}>{existing ? 'Edit Score' : 'Rate Team'}</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {role === 'leader' && myTeam && myOpponents.length === 0 && (
        <div className="notice notice-info">No completed games yet. Spirit scores can be submitted after playing.</div>
      )}
      <div className="section-header"><span className="section-title" style={{ fontSize: 20 }}>SPIRIT STANDINGS</span></div>
      {tTeams.some(t => getTeamAvg(t.id)) ? (
        <table className="spirit-table" style={{ background: '#141414', borderRadius: 10, overflow: 'hidden', width: '100%' }}>
          <thead><tr><th>Team</th>{SPIRIT_CATS.map(c => <th key={c}>{c.split(' ')[0]}</th>)}<th>Avg</th><th>Ratings</th></tr></thead>
          <tbody>{tTeams.map(t => {
            const received = spiritScores.filter(s => s.tournamentId === tournament.id && s.toTeamId === t.id);
            if (!received.length) return null;
            const catAvgs = SPIRIT_CATS.map((_, ci) => (received.reduce((sum, s) => sum + s.scores[ci], 0) / received.length).toFixed(1));
            const overall = (received.reduce((sum, s) => sum + s.scores.reduce((a,b)=>a+b,0), 0) / received.length).toFixed(1);
            const colorClass = getSpiritColor(+overall * (20/4));
            return (
              <tr key={t.id}>
                <td><span style={{ marginRight: 6 }}>{t.logo}</span><span style={{ fontWeight: 600 }}>{t.name}</span></td>
                {catAvgs.map((a, i) => <td key={i} style={{ color: '#888', fontSize: 12 }}>{a}</td>)}
                <td><span className={`spirit-score-pill ${colorClass}`}>{overall}</span></td>
                <td style={{ color: '#555', fontSize: 12 }}>{received.length}</td>
              </tr>
            );
          })}</tbody>
        </table>
      ) : (
        <div className="empty-state"><div className="empty-icon">🤝</div><div className="empty-title">No Spirit Scores Yet</div><div className="empty-sub">Team leaders submit scores after playing each opponent.</div></div>
      )}
      {scoring && (
        <SpiritScoreModal opponent={scoring} existing={getMyScore(scoring.id)} onClose={() => setScoring(null)} onSave={(data) => { onSpiritSave(myTeam.id, scoring.id, data); setScoring(null); }} />
      )}
    </div>
  );
}

// ─── ADMIN GAME MANAGEMENT TAB ────────────────────────────────────────────────
function ManageGamesTab({ tournament, teams, games, onDataChange, data }) {
  const [editGame, setEditGame] = useState(null);
  const [addGame, setAddGame] = useState(false);
  const tGames = games.filter(g => g.tournamentId === tournament.id).sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.time || '').localeCompare(b.time || ''));
  const tTeams = teams.filter(t => t.tournamentId === tournament.id);
  const hasGames = tGames.length > 0;
  const canGenerate = tTeams.length >= getMinTeams(tournament.format) && !hasGames;
  const showCrossovers = canGenerateCrossovers(tournament, teams, games);
  const nextBracket = tournament.format === 'bracket' ? generateNextBracketRound(tournament, games) : null;

  const handleGenerateSchedule = () => {
    let newGames = [];
    if (tournament.format === 'pool') {
      const pooled = assignToPools(tTeams, calcPoolCount(tTeams.length, 'pool'));
      onDataChange({ ...data, teams: data.teams.map(t => { const p = pooled.find(pt => pt.id === t.id); return p || t; }) });
      newGames = genPoolGames(pooled, tournament.id, tournament.date);
    } else if (tournament.format === 'roundrobin') {
      newGames = genRRGames(tTeams, tournament.id, tournament.date);
    } else {
      newGames = genBracketGames(tTeams, tournament.id, tournament.date);
    }
    onDataChange({ ...data, games: [...data.games, ...newGames] });
  };

  const handleRegenerate = () => {
    if (!window.confirm('This will reset all game results and regenerate the schedule. Continue?')) return;
    const cleaned = data.games.filter(g => g.tournamentId !== tournament.id);
    let newGames = [];
    if (tournament.format === 'pool') {
      const pooled = assignToPools(tTeams, calcPoolCount(tTeams.length, 'pool'));
      onDataChange({ ...data, teams: data.teams.map(t => { const p = pooled.find(pt => pt.id === t.id); return p || t; }), games: [...cleaned, ...genPoolGames(pooled, tournament.id, tournament.date)] });
      return;
    } else if (tournament.format === 'roundrobin') {
      newGames = genRRGames(tTeams, tournament.id, tournament.date);
    } else {
      newGames = genBracketGames(tTeams, tournament.id, tournament.date);
    }
    onDataChange({ ...data, games: [...cleaned, ...newGames] });
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {canGenerate && <button className="btn btn-primary" onClick={handleGenerateSchedule}>⚡ Generate Schedule</button>}
        {hasGames && <button className="btn btn-secondary" onClick={handleRegenerate}>↺ Regenerate</button>}
        {hasGames && <button className="btn btn-secondary" onClick={() => setAddGame(true)}>+ Add Game</button>}
      </div>

      {showCrossovers && (
        <div className="next-round-banner">
          <div><div style={{ fontWeight: 600, fontSize: 14, color: '#A3E635' }}>Pool games complete!</div><div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Auto-generate crossover/final matchups based on pool standings.</div></div>
          <button className="btn btn-primary btn-sm" onClick={() => { const newGames = generateCrossovers(tournament, teams, games); onDataChange({ ...data, games: [...data.games, ...newGames] }); }}>Generate Crossovers</button>
        </div>
      )}

      {nextBracket && (
        <div className="next-round-banner">
          <div><div style={{ fontWeight: 600, fontSize: 14, color: '#A3E635' }}>Ready for next round!</div><div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Auto-pair winners for {nextBracket[0]?.round}.</div></div>
          <button className="btn btn-primary btn-sm" onClick={() => onDataChange({ ...data, games: [...data.games, ...nextBracket] })}>Generate {nextBracket[0]?.round}</button>
        </div>
      )}

      {!hasGames ? (
        <div className="empty-state"><div className="empty-icon">📋</div><div className="empty-title">{tTeams.length < getMinTeams(tournament.format) ? `Need ${getMinTeams(tournament.format) - tTeams.length} more team(s)` : 'No Schedule Yet'}</div><div className="empty-sub">{tTeams.length >= getMinTeams(tournament.format) ? 'Click "Generate Schedule" to auto-create fixtures.' : `Minimum ${getMinTeams(tournament.format)} teams required for ${tournament.format} format.`}</div></div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="games-admin-table" style={{ width: '100%', background: '#141414', borderRadius: 10, overflow: 'hidden' }}>
            <thead><tr><th>Home</th><th>Away</th><th>Score</th><th>Field</th><th>Date</th><th>Time</th><th>Stage</th><th>Status</th><th></th></tr></thead>
            <tbody>{tGames.map(g => (
              <tr key={g.id}>
                <td style={{ fontWeight: 600 }}>{g.homeTeam}</td>
                <td style={{ fontWeight: 600 }}>{g.awayTeam}</td>
                <td style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 16, fontWeight: 800, color: g.score ? '#A3E635' : '#555' }}>{g.score || '—'}</td>
                <td><span className="game-field-badge">{g.field}</span></td>
                <td style={{ color: '#666' }}>{g.date}</td>
                <td style={{ color: '#666' }}>{g.time}</td>
                <td style={{ color: '#555' }}>{g.round || (g.pool ? `Pool ${g.pool}` : '—')}</td>
                <td><span className={`app-status-badge ${g.status === 'completed' ? 'app-approved' : 'app-pending'}`}>{g.status}</span></td>
                <td><button className="btn btn-ghost btn-sm" onClick={() => setEditGame(g)}>Edit</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {editGame && <EditGameModal game={editGame} teams={tTeams} onClose={() => setEditGame(null)} onSave={(updated) => { onDataChange({ ...data, games: data.games.map(g => g.id === updated.id ? updated : g) }); setEditGame(null); }} />}
      {addGame && <AddGameModal tournament={tournament} teams={teams} onClose={() => setAddGame(false)} onSave={(ng) => { onDataChange({ ...data, games: [...data.games, ng] }); setAddGame(false); }} />}
    </div>
  );
}

// ─── ADD TEAM MODAL ───────────────────────────────────────────────────────────
function AddTeamModal({ onClose, onAdd }) {
  const [f, setF] = useState({ name: '', leader: '', logo: '🐦' });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <Modal title="ADD TEAM" onClose={onClose} footer={
      <>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!f.name} onClick={() => f.name && onAdd(f)}>Add Team</button>
      </>
    }>
      <div className="form-group"><label className="form-label">Team Name</label><input className="form-input" value={f.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Cardiff Crows" /></div>
      <div className="form-group"><label className="form-label">Leader Name</label><input className="form-input" value={f.leader} onChange={e => set('leader', e.target.value)} placeholder="Leader's full name" /></div>
      <div className="form-group">
        <label className="form-label">Team Logo</label>
        <div style={{ background: '#0D0D0D', border: '1px solid #2A2A2A', borderRadius: 10, padding: 12 }}>
          <div style={{ fontSize: 32, textAlign: 'center', marginBottom: 10 }}>{f.logo}</div>
          <div className="emoji-grid">{EMOJI_LOGOS.slice(0, 20).map(e => <button key={e} className={`emoji-option ${f.logo === e ? 'selected' : ''}`} onClick={() => set('logo', e)}>{e}</button>)}</div>
        </div>
      </div>
    </Modal>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
function MainPage({ data, role, user, onTournamentClick, onDataChange }) {
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState('all');
  const filtered = data.tournaments.filter(t => filter === 'all' || t.status === filter);
  const fmtMap = { pool: 'fmt-pool', roundrobin: 'fmt-roundrobin', bracket: 'fmt-bracket' };
  const statusMap = { upcoming: 'status-upcoming', ongoing: 'status-ongoing', completed: 'status-completed' };
  const fmtLabel = { pool: 'Pool Play', roundrobin: 'Round Robin', bracket: 'Bracket' };

  const handleCreate = (form) => {
    const t = { id: `tr${crypto.randomUUID()}`, name: form.name || 'New Tournament', location: form.location || 'TBD', date: form.date, endDate: form.endDate || form.date, status: 'upcoming', format: form.format, description: form.description, teamLimit: +form.teamLimit, memberLimit: [+form.memberMin, +form.memberMax], teamsJoined: 0 };
    onDataChange({ ...data, tournaments: [...data.tournaments, t] });
  };

  return (
    <div className="page">
      <div style={{ paddingTop: 40, paddingBottom: 36 }}>
        <div className="page-label">🥏 Frisbee Timetable</div>
        <h1 className="page-title">ALL<br /><em>TOURNAMENTS</em></h1>
        <p style={{ fontSize: 14, color: '#666', marginTop: 14, lineHeight: 1.6 }}>Track pool play, round robins, and brackets — all in one place.</p>
      </div>
      <div className="filter-bar" style={{ marginBottom: 28 }}>
        <span className="filter-label">Status</span>
        {['all','upcoming','ongoing','completed'].map(s => <button key={s} className={`filter-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>)}
      </div>
      <div className="section-header"><span className="section-title">EVENTS</span><span className="section-count">{filtered.length} tournaments</span></div>
      <div className="tournament-grid">
        {filtered.map(t => (
          <div key={t.id} className="tournament-card" onClick={() => onTournamentClick(t)}>
            <span className={`tc-status ${statusMap[t.status]}`}>{t.status}</span>
            <div className={`tc-format ${fmtMap[t.format]}`}>{fmtLabel[t.format]}</div>
            <div className="tc-name">{t.name}</div>
            <div className="tc-location">📍 {t.location}</div>
            <div className="tc-meta">
              <div className="tc-meta-item"><strong>{fmtDate(t.date)}</strong>Start</div>
              <div className="tc-meta-item"><strong>{t.teamsJoined}/{t.teamLimit}</strong>Teams</div>
              <div className="tc-meta-item"><strong>{t.memberLimit[0]}–{t.memberLimit[1]}</strong>Roster</div>
            </div>
          </div>
        ))}
      </div>
      {role === 'admin' && <button className="create-tournament-btn" onClick={() => setShowCreate(true)}>+ New Tournament</button>}
      {showCreate && <CreateTournamentModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
    </div>
  );
}

// ─── TOURNAMENT PAGE ──────────────────────────────────────────────────────────
function TournamentPage({ tournament, data, role, user, onBack, onTeamClick, onDataChange }) {
  const [tab, setTab] = useState('schedule');
  const [filterTeamId, setFilterTeamId] = useState(null);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [editTeam, setEditTeam] = useState(null);
  const [applied, setApplied] = useState(false);

  const teams = data.teams.filter(t => t.tournamentId === tournament.id);
  const applications = data.applications.filter(a => a.tournamentId === tournament.id);
  const alreadyApplied = applied || applications.some(a => a.leaderId === user.id && a.tournamentId === tournament.id);

  const fmtMap = { pool: 'fmt-pool', roundrobin: 'fmt-roundrobin', bracket: 'fmt-bracket' };
  const statusMap = { upcoming: 'status-upcoming', ongoing: 'status-ongoing', completed: 'status-completed' };
  const fmtLabel = { pool: 'Pool Play', roundrobin: 'Round Robin', bracket: 'Bracket' };

  const tabs = [
    { id: 'schedule', label: 'Schedule' },
    { id: 'teams', label: `Teams (${teams.length})` },
    { id: 'spirit', label: '🤝 Spirit' },
    ...(role === 'admin' ? [{ id: 'applications', label: `Applications (${applications.filter(a => a.status === 'pending').length})` }, { id: 'manage', label: '⚙ Manage Games' }] : []),
    { id: 'info', label: 'Info' },
  ];

  const handleApply = () => {
    const a = { id: `a${crypto.randomUUID()}`, tournamentId: tournament.id, teamName: 'My Team', leader: user.name, leaderId: user.id, status: 'pending', appliedAt: new Date().toISOString().slice(0, 10) };
    onDataChange({ ...data, applications: [...data.applications, a] });
    setApplied(true);
  };

  const handleAddTeam = (form) => {
    const t = { id: `t${crypto.randomUUID()}`, tournamentId: tournament.id, name: form.name, logo: form.logo || '🐦', leader: form.leader, leaderId: `u${crypto.randomUUID()}`, pool: null, members: [] };
    onDataChange({ ...data, teams: [...data.teams, t] });
    setShowAddTeam(false);
  };

  const handleAppDecision = (id, status) => onDataChange({ ...data, applications: data.applications.map(a => a.id === id ? { ...a, status } : a) });

  const handleEditTeamSave = (updated) => { onDataChange({ ...data, teams: data.teams.map(t => t.id === updated.id ? updated : t) }); setEditTeam(null); };

  const handleSpiritSave = (fromId, toId, scoreData) => {
    const existing = data.spiritScores.find(s => s.tournamentId === tournament.id && s.fromTeamId === fromId && s.toTeamId === toId);
    if (existing) {
      onDataChange({ ...data, spiritScores: data.spiritScores.map(s => s.id === existing.id ? { ...s, ...scoreData } : s) });
    } else {
      onDataChange({ ...data, spiritScores: [...data.spiritScores, { id: `ss${crypto.randomUUID()}`, tournamentId: tournament.id, fromTeamId: fromId, toTeamId: toId, ...scoreData }] });
    }
  };

  const handleEditGame = (updated) => onDataChange({ ...data, games: data.games.map(g => g.id === updated.id ? updated : g) });

  const scheduleProps = { tournament, teams: data.teams, games: data.games, filterTeamId, isAdmin: role === 'admin', onEditGame: (g) => { const [updated] = [g]; handleEditGame(updated); } };
  // For inline edit from game card
  const [inlineEdit, setInlineEdit] = useState(null);

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← All Tournaments</button>
      <div className="tournament-hero">
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <span className={`tc-format ${fmtMap[tournament.format]}`}>{fmtLabel[tournament.format]}</span>
            <span className={`tc-status ${statusMap[tournament.status]}`}>{tournament.status}</span>
          </div>
          <h1 className="t-name">{tournament.name}</h1>
          <div className="t-location">📍 {tournament.location}</div>
          <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>📅 {fmtDate(tournament.date)}{tournament.date !== tournament.endDate ? ` – ${fmtDate(tournament.endDate)}` : ''}</div>
          <div style={{ marginTop: 18, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {role === 'leader' && !alreadyApplied && tournament.status !== 'completed' && <button className="btn btn-primary" onClick={handleApply}>✋ Sign Up Team</button>}
            {role === 'leader' && alreadyApplied && <div className="notice notice-info" style={{ margin: 0, padding: '7px 14px', fontSize: 12 }}>✓ Application submitted</div>}
            {role === 'admin' && tournament.status !== 'completed' && <button className="btn btn-secondary" onClick={() => setShowAddTeam(true)}>+ Add Team</button>}
          </div>
        </div>
        <div className="t-stats">
          <div className="t-stat"><div className="t-stat-val">{teams.length}</div><div className="t-stat-label">Teams</div></div>
          <div className="t-stat"><div className="t-stat-val">{tournament.teamLimit}</div><div className="t-stat-label">Cap</div></div>
          <div className="t-stat"><div className="t-stat-val">{data.games.filter(g => g.tournamentId === tournament.id).length}</div><div className="t-stat-label">Games</div></div>
        </div>
      </div>

      <div className="tabs">{tabs.map(t => <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>)}</div>

      {tab === 'schedule' && (
        <>
          <div className="filter-bar">
            <span className="filter-label">Team</span>
            <button className={`filter-btn ${!filterTeamId ? 'active' : ''}`} onClick={() => setFilterTeamId(null)}>All</button>
            {teams.map(t => <button key={t.id} className={`filter-btn ${filterTeamId === t.id ? 'active' : ''}`} onClick={() => setFilterTeamId(filterTeamId === t.id ? null : t.id)}>{t.logo} {t.name}</button>)}
          </div>
          {tournament.format === 'pool' && <PoolSchedule {...scheduleProps} onEditGame={g => setInlineEdit(g)} />}
          {tournament.format === 'roundrobin' && <RoundRobinSchedule {...scheduleProps} onEditGame={g => setInlineEdit(g)} />}
          {tournament.format === 'bracket' && <BracketSchedule {...scheduleProps} onEditGame={g => setInlineEdit(g)} />}
        </>
      )}

      {tab === 'teams' && (
        <div>
          {!teams.length ? (
            <div className="empty-state"><div className="empty-icon">🏅</div><div className="empty-title">No Teams Yet</div></div>
          ) : (
            <div className="teams-grid">
              {teams.map(t => (
                <div key={t.id} className="team-card">
                  <span className="team-card-logo">{t.logo}</span>
                  <div className="team-card-name">{t.name}</div>
                  <div className="team-card-leader">👑 {t.leader}</div>
                  <div className="team-card-meta">
                    <span style={{ cursor: 'pointer', color: '#60A5FA' }} onClick={() => onTeamClick(t, tournament)}>View Roster →</span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {t.pool && <span className="tag">Pool {t.pool}</span>}
                      {role === 'admin' && <button className="btn btn-ghost btn-sm" onClick={() => setEditTeam(t)}>Edit</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'spirit' && (
        <SpiritTab tournament={tournament} teams={data.teams} games={data.games} spiritScores={data.spiritScores} user={user} role={role} onSpiritSave={handleSpiritSave} />
      )}

      {tab === 'applications' && role === 'admin' && (
        <div>
          {!applications.length ? (
            <div className="empty-state"><div className="empty-icon">📋</div><div className="empty-title">No Applications</div></div>
          ) : applications.map(app => (
            <div key={app.id} className="application-card">
              <div><div className="app-team-name">{app.teamName}</div><div className="app-team-leader">Leader: {app.leader} · {fmtDate(app.appliedAt)}</div></div>
              <div style={{ display: 'flex', gap: 8 }}>
                {app.status === 'pending' ? (
                  <><button className="btn btn-primary btn-sm" onClick={() => handleAppDecision(app.id, 'approved')}>Approve</button><button className="btn btn-danger btn-sm" onClick={() => handleAppDecision(app.id, 'rejected')}>Reject</button></>
                ) : <span className={`app-status-badge ${app.status === 'approved' ? 'app-approved' : 'app-rejected'}`}>{app.status}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'manage' && role === 'admin' && (
        <ManageGamesTab tournament={tournament} teams={data.teams} games={data.games} onDataChange={onDataChange} data={data} />
      )}

      {tab === 'info' && (
        <div>
          <div className="info-grid">
            <div className="info-card"><div className="info-card-label">Format</div><div className="info-card-val">{fmtLabel[tournament.format]}</div></div>
            <div className="info-card"><div className="info-card-label">Teams</div><div className="info-card-val">{teams.length}/{tournament.teamLimit}</div></div>
            <div className="info-card"><div className="info-card-label">Min Roster</div><div className="info-card-val">{tournament.memberLimit[0]}</div></div>
            <div className="info-card"><div className="info-card-label">Max Roster</div><div className="info-card-val">{tournament.memberLimit[1]}</div></div>
            <div className="info-card"><div className="info-card-label">Start</div><div className="info-card-val" style={{ fontSize: 14 }}>{fmtDate(tournament.date)}</div></div>
            <div className="info-card"><div className="info-card-label">End</div><div className="info-card-val" style={{ fontSize: 14 }}>{fmtDate(tournament.endDate)}</div></div>
          </div>
          {tournament.description && <div style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: 10, padding: '18px 22px' }}><div style={{ fontSize: 10, fontWeight: 700, color: '#555', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>About</div><p style={{ fontSize: 14, color: '#888', lineHeight: 1.7 }}>{tournament.description}</p></div>}
        </div>
      )}

      {showAddTeam && <AddTeamModal onClose={() => setShowAddTeam(false)} onAdd={handleAddTeam} />}

      {editTeam && <EditTeamModal team={editTeam} onClose={() => setEditTeam(null)} onSave={handleEditTeamSave} />}
      {inlineEdit && <EditGameModal game={inlineEdit} teams={teams} onClose={() => setInlineEdit(null)} onSave={(updated) => { handleEditGame(updated); setInlineEdit(null); }} />}
    </div>
  );
}

// ─── TEAM PAGE ────────────────────────────────────────────────────────────────
function TeamPage({ team, tournament, data, role, user, onBack, onDataChange }) {
  const [showAdd, setShowAdd] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const currentTeam = data.teams.find(t => t.id === team.id);
  const isLeader = role === 'leader' && currentTeam.leaderId === user.id;

  const handleAdd = (form) => {
    const m = { id: `m${crypto.randomUUID()}`, name: form.name, position: form.position, number: +form.number };
    onDataChange({ ...data, teams: data.teams.map(t => t.id === team.id ? { ...t, members: [...t.members, m] } : t) });
    setShowAdd(false);
  };

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← {tournament.name}</button>
      <div className="team-hero">
        <div>
          <div style={{ fontSize: 52, marginBottom: 10 }}>{currentTeam.logo}</div>
          <div className="page-label">Team</div>
          <h1 className="page-title" style={{ fontSize: 'clamp(36px,5vw,60px)' }}>{currentTeam.name}</h1>
          <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ fontSize: 13, color: '#666' }}>👑 {currentTeam.leader}</div>
            {currentTeam.pool && <span className="tag">Pool {currentTeam.pool}</span>}
            <span className="tag">{tournament.name}</span>
          </div>
        </div>
        <div className="t-stats">
          <div className="t-stat"><div className="t-stat-val">{currentTeam.members.length}</div><div className="t-stat-label">Members</div></div>
          <div className="t-stat"><div className="t-stat-val">{tournament.memberLimit[0]}–{tournament.memberLimit[1]}</div><div className="t-stat-label">Limit</div></div>
        </div>
      </div>

      {currentTeam.members.length < tournament.memberLimit[0] && (
        <div className="notice notice-warn">⚠ Needs at least {tournament.memberLimit[0]} members. Currently {currentTeam.members.length}.</div>
      )}

      <div className="section-header">
        <span className="section-title">ROSTER</span>
        {isLeader && <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Add Member</button>}
      </div>

      {!currentTeam.members.length ? (
        <div className="empty-state"><div className="empty-icon">👤</div><div className="empty-title">No Members Yet</div><div className="empty-sub">{isLeader ? 'Add members to your team.' : 'No members added yet.'}</div></div>
      ) : (
        <div className="roster-list">
          {currentTeam.members.map(m => (
            <div key={m.id} className="member-card" onClick={() => setSelectedMember(m)}>
              <div className="member-avatar">{initials(m.name)}</div>
              <div><div className="member-name">{m.name}</div><div className="member-pos">{m.position}</div></div>
              <div style={{ marginLeft: 14, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 900, color: '#444' }}>#{m.number}</div>
              {m.isLeader && <span className="member-tag">Captain</span>}
            </div>
          ))}
        </div>
      )}

      {showAdd && <AddMemberModal team={currentTeam} tournament={tournament} onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
      {selectedMember && <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />}
    </div>
  );
}

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState('user');
  const [view, setView] = useState({ page: 'main' });
  const [data, setData] = useState(INIT_DATA);
  const user = USERS[role];

  return (
    <>
      <style>{FONTS}{CSS}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo" onClick={() => setView({ page: 'main' })}>FRISBEE<span>TIMETABLE</span></div>
          <div className="nav-right">
            <div style={{ display: 'flex', gap: 5 }}>
              {['user', 'leader', 'admin'].map(r => (
                <button key={r} className={`role-btn ${role === r ? 'active' : ''}`} onClick={() => { setRole(r); setView({ page: 'main' }); }}>
                  {r === 'user' ? 'Fan' : r === 'leader' ? 'Leader' : 'Admin'}
                </button>
              ))}
            </div>
            <span className={`role-badge role-${role === 'leader' ? 'leader' : role}`}>{user.name}</span>
          </div>
        </nav>

        {view.page === 'main' && <MainPage data={data} role={role} user={user} onTournamentClick={t => setView({ page: 'tournament', tournament: t })} onDataChange={setData} />}
        {view.page === 'tournament' && <TournamentPage tournament={view.tournament} data={data} role={role} user={user} onBack={() => setView({ page: 'main' })} onTeamClick={(t, tr) => setView({ page: 'team', team: t, tournament: tr })} onDataChange={setData} />}
        {view.page === 'team' && <TeamPage team={view.team} tournament={view.tournament} data={data} role={role} user={user} onBack={() => setView({ page: 'tournament', tournament: view.tournament })} onDataChange={setData} />}
      </div>
    </>
  );
}
