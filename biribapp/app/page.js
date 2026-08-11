"use client";

import { useState, useEffect, useRef } from "react";
import { APP_VERSION, APP_BUILD } from "@/lib/version";
import { Share2, Plus, Minus, User, Users, Trophy, Trash2, ChevronRight, X, Check, ArrowLeft, Crown, Calendar, Sparkles, Camera, Edit3, LogOut, TrendingUp, Zap, MapPin, DoorOpen, Layers } from "lucide-react";

/* ============ API HELPERS ============ */
const api = {
  async get(path) {
    const r = await fetch(path, { credentials: "same-origin" });
    if (r.status === 401) throw new Error("UNAUTHORIZED");
    if (!r.ok) throw new Error((await safeError(r)) || `GET ${path} failed`);
    return r.json();
  },
  async send(method, path, body) {
    const r = await fetch(path, {
      method,
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (r.status === 401) throw new Error("UNAUTHORIZED");
    if (!r.ok) throw new Error((await safeError(r)) || `${method} ${path} failed`);
    return r.json();
  },
};
async function safeError(r) {
  try { const j = await r.json(); return j?.error; } catch { return null; }
}

/* ============ LOGO ============ */
function BiribAppLogo({ size = 44, showWordmark = true }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size * 1.1} viewBox="0 0 64 70" fill="none">
        <path d="M8 4 L56 4 L56 38 Q56 50 48 58 L32 66 L16 58 Q8 50 8 38 Z" fill="#D4AF37" />
        <text x="32" y="46" textAnchor="middle" fontFamily="'Geist', system-ui, sans-serif" fontWeight="700" fontSize="42" fill="#0A2818" style={{ letterSpacing: "-0.04em" }}>B</text>
      </svg>
      {showWordmark && (
        <div className="leading-none">
          <div className="flex items-baseline" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
            <span style={{ color: "#F5E9CF", fontWeight: 600, fontSize: "24px", letterSpacing: "-0.04em" }}>Birib</span>
            <span style={{ color: "#D4AF37", fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontWeight: 400, fontSize: "30px", marginLeft: "2px", letterSpacing: "-0.01em", transform: "translateY(2px)", display: "inline-block" }}>APP</span>
          </div>
          <div className="text-[9px] uppercase tracking-[0.32em] mt-1.5 mono-font font-medium" style={{ color: "#D4AF37" }}>
            score keeper
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ AVATAR ============ */
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #1A7A3F, #22C55E)",
  "linear-gradient(135deg, #D4AF37, #F4CD5C)",
  "linear-gradient(135deg, #7A1F2B, #B8313F)",
  "linear-gradient(135deg, #14502E, #1A7A3F)",
  "linear-gradient(135deg, #A8862A, #D4AF37)",
  "linear-gradient(135deg, #2D6A4F, #52B788)",
  "linear-gradient(135deg, #6B1F2B, #D4AF37)",
  "linear-gradient(135deg, #1A7A3F, #D4AF37)",
];
function gradientForName(name) {
  let h = 0;
  for (let i = 0; i < (name || "").length; i++) h = (h * 31 + name.charCodeAt(i)) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[h];
}

function Avatar({ player, size = 36 }) {
  const initial = (player?.name || "?").charAt(0).toUpperCase();
  const grad = gradientForName(player?.name || "?");
  if (player?.photo) {
    return (
      <div className="rounded-full overflow-hidden flex-shrink-0" style={{ width: size, height: size, border: `1px solid #D4AF37` }}>
        <img src={player.photo} alt={player.name} style={{ width: size, height: size, objectFit: "cover" }} />
      </div>
    );
  }
  return (
    <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, background: grad, border: `1px solid rgba(212,175,55,0.5)`, fontSize: size * 0.42, color: "#F5E9CF", fontWeight: 500, fontFamily: "'Geist', system-ui, sans-serif", letterSpacing: "-0.02em" }}>
      {initial}
    </div>
  );
}

async function compressImage(file, maxDim = 192, quality = 0.72) {
  const dataUrl = await new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });
  const img = await new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = dataUrl;
  });
  const canvas = document.createElement("canvas");
  const sz = Math.min(img.width, img.height);
  const sx = (img.width - sz) / 2;
  const sy = (img.height - sz) / 2;
  const scale = Math.min(1, maxDim / sz);
  canvas.width = Math.round(sz * scale);
  canvas.height = Math.round(sz * scale);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, sx, sy, sz, sz, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

/* ============ CARD WATERMARKS ============ */
function CardWatermarks() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice" style={{ zIndex: 0 }}>
      <defs>
        <pattern id="cardpattern" x="0" y="0" width="280" height="320" patternUnits="userSpaceOnUse">
          <g transform="translate(20 30) rotate(-12)">
            <rect width="60" height="84" rx="6" fill="none" stroke="#D4AF37" strokeWidth="0.6" opacity="0.12" />
            <text x="6" y="14" fontFamily="'Instrument Serif', serif" fontSize="11" fill="#D4AF37" opacity="0.18">A</text>
            <text x="6" y="22" fontFamily="serif" fontSize="8" fill="#22C55E" opacity="0.18">♠</text>
            <text x="30" y="50" textAnchor="middle" fontFamily="serif" fontSize="22" fill="#22C55E" opacity="0.1">♠</text>
            <text x="54" y="78" textAnchor="end" fontFamily="'Instrument Serif', serif" fontSize="11" fill="#D4AF37" opacity="0.18" transform="rotate(180 54 78)">A</text>
          </g>
          <g transform="translate(190 80) rotate(18)">
            <rect width="60" height="84" rx="6" fill="none" stroke="#D4AF37" strokeWidth="0.6" opacity="0.1" />
            <text x="6" y="14" fontFamily="'Instrument Serif', serif" fontSize="11" fill="#D4AF37" opacity="0.16">K</text>
            <text x="6" y="22" fontFamily="serif" fontSize="8" fill="#7A1F2B" opacity="0.18">♥</text>
            <text x="30" y="50" textAnchor="middle" fontFamily="serif" fontSize="22" fill="#7A1F2B" opacity="0.1">♥</text>
            <text x="54" y="78" textAnchor="end" fontFamily="'Instrument Serif', serif" fontSize="11" fill="#D4AF37" opacity="0.16" transform="rotate(180 54 78)">K</text>
          </g>
          <g transform="translate(80 180) rotate(7)">
            <rect width="60" height="84" rx="6" fill="none" stroke="#D4AF37" strokeWidth="0.6" opacity="0.1" />
            <text x="6" y="14" fontFamily="'Instrument Serif', serif" fontSize="11" fill="#D4AF37" opacity="0.16">Q</text>
            <text x="6" y="22" fontFamily="serif" fontSize="8" fill="#7A1F2B" opacity="0.18">♦</text>
            <text x="30" y="50" textAnchor="middle" fontFamily="serif" fontSize="22" fill="#7A1F2B" opacity="0.1">♦</text>
            <text x="54" y="78" textAnchor="end" fontFamily="'Instrument Serif', serif" fontSize="11" fill="#D4AF37" opacity="0.16" transform="rotate(180 54 78)">Q</text>
          </g>
          <g transform="translate(210 230) rotate(-8)">
            <rect width="60" height="84" rx="6" fill="none" stroke="#D4AF37" strokeWidth="0.6" opacity="0.1" />
            <text x="6" y="14" fontFamily="'Instrument Serif', serif" fontSize="11" fill="#D4AF37" opacity="0.16">J</text>
            <text x="6" y="22" fontFamily="serif" fontSize="8" fill="#22C55E" opacity="0.18">♣</text>
            <text x="30" y="50" textAnchor="middle" fontFamily="serif" fontSize="22" fill="#22C55E" opacity="0.1">♣</text>
          </g>
          <text x="155" y="40" fontFamily="serif" fontSize="14" fill="#D4AF37" opacity="0.08">♠</text>
          <text x="20" y="280" fontFamily="serif" fontSize="14" fill="#D4AF37" opacity="0.08">♥</text>
          <text x="265" y="180" fontFamily="serif" fontSize="14" fill="#D4AF37" opacity="0.08">♦</text>
          <text x="140" y="305" fontFamily="serif" fontSize="14" fill="#D4AF37" opacity="0.08">♣</text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cardpattern)" />
    </svg>
  );
}

/* ============ SCORING / DATE HELPERS ============ */
/* ---- Cards ---- */
export const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
export const SUITS = [
  { id: "spades",   sym: "♠", name: "spades",   red: false },
  { id: "hearts",   sym: "♥", name: "hearts",   red: true  },
  { id: "diamonds", sym: "♦", name: "diamonds", red: true  },
  { id: "clubs",    sym: "♣", name: "clubs",    red: false },
];
function suitOf(id) { return SUITS.find(x => x.id === id) || null; }

/* ---- Deal rotation ----
   `seating` holds player ids in table order, matching the on-screen seats, which
   run clockwise from the top. Seen from above, the next seat clockwise is the one
   on a player's left.

   The deal passes ANTI-clockwise, so each round it moves back one seat, and the
   biribákia are split by the player on the dealer's left, i.e. the next seat. */
function rotationForRound(game, roundNumber) {
  const seating = game?.seating || [];
  const n = seating.length;
  if (n < 2 || !roundNumber || roundNumber < 1) return null;
  const start = Number.isFinite(game.shuffle_start) ? game.shuffle_start : 0;
  const shufflerIdx = (((start - (roundNumber - 1)) % n) + n) % n;
  const splitterIdx = (shufflerIdx + 1) % n;
  return { shufflerId: seating[shufflerIdx], splitterId: seating[splitterIdx] };
}

/* ---- Biriba scoring rules ---- */
export const SCORING = {
  DIRTY_BIRIBA: 100,
  CLEAN_BIRIBA: 200,
  ATOU_DIRTY: 300,
  ATOU_CLEAN: 600,
  FULL_DECK_BIRIBA: 1000,
  OUT_FIRST: 100,
  NO_BIRIBAKI: -100,
};

/** True when a game has no scoring at all — no rounds, or every round is empty.
    Only these are safe to delete straight from the room list. */
function gameHasNoPoints(game) {
  const rounds = game?.rounds || [];
  if (rounds.length === 0) return true;
  return rounds.every(r =>
    Object.keys(r.scores || {}).every(tid => roundTeamTotal(r.scores[tid]) === 0)
  );
}

/** Meld restriction tier a team is on, based on their running total. */
function restrictionFor(total) {
  if (total >= 2000) {
    return { label: "Periorismos 90", color: "#FB7185", bg: "rgba(122,31,43,0.28)", border: "rgba(184,49,63,0.65)", pulse: "badge-pulse-urgent" };
  }
  if (total >= 1000) {
    return { label: "Periorismos 75", color: "#F7A356", bg: "rgba(146,74,16,0.25)", border: "rgba(224,132,45,0.6)", pulse: "badge-pulse" };
  }
  return null;
}

/** True if this score entry uses the old three-number shape. */
function isLegacyScore(s) {
  return s && (s.biriba !== undefined || s.outcome !== undefined || s.deck !== undefined);
}

/** Points earned from biriba counts alone. */
function biribaPoints(s) {
  if (!s) return 0;
  if (isLegacyScore(s)) return s.biriba || 0;
  return (s.dirtyBiriba || 0) * SCORING.DIRTY_BIRIBA
       + (s.cleanBiriba || 0) * SCORING.CLEAN_BIRIBA
       + (s.atouDirty || 0) * SCORING.ATOU_DIRTY
       + (s.atouClean || 0) * SCORING.ATOU_CLEAN
       + (s.fullDeckBiriba || 0) * SCORING.FULL_DECK_BIRIBA;
}

/** Net of the out-first bonus and the no-biribáki penalty. */
function bonusPoints(s) {
  if (!s) return 0;
  if (isLegacyScore(s)) return s.outcome || 0;
  let v = 0;
  if (s.outFirst) v += SCORING.OUT_FIRST;
  if (s.noBiribaki) v += SCORING.NO_BIRIBAKI;
  return v;
}

/** Cards left in hand — stored already negative. */
function handPoints(s) {
  if (!s || isLegacyScore(s)) return 0;
  return s.handPoints || 0;
}

/** Cards counted in the deck the team took. */
function deckPoints(s) {
  if (!s) return 0;
  if (isLegacyScore(s)) return s.deck || 0;
  return s.deckPoints || 0;
}

/** One team's total for one round. Handles both old and new score shapes. */
function roundTeamTotal(s) {
  if (!s) return 0;
  return biribaPoints(s) + bonusPoints(s) + handPoints(s) + deckPoints(s);
}

function computeTotals(game) {
  const t = {};
  (game.teams || []).forEach(team => { t[team.id] = 0; });
  (game.rounds || []).forEach(r => {
    Object.keys(r.scores || {}).forEach(tid => {
      t[tid] = (t[tid] || 0) + roundTeamTotal(r.scores[tid]);
    });
  });
  return t;
}
function getWinner(game) {
  const totals = computeTotals(game);
  let best = null;
  (game.teams || []).forEach(t => {
    if (!best || (totals[t.id] || 0) > (totals[best.id] || 0)) best = { ...t, total: totals[t.id] || 0 };
  });
  return best;
}
function formatDate(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
function formatShortDate(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/* ============ ROOM HELPERS ============ */
function gamesInRoom(games, roomId) {
  return games.filter(g => g.room_id === roomId);
}
function orphanGames(games) {
  return games.filter(g => !g.room_id);
}
/** Standings across the games of a single room. */
function computeRoomStandings(roomGames) {
  const stats = {};
  for (const g of roomGames) {
    const totals = computeTotals(g);
    const winner = g.finished_at ? getWinner(g) : null;
    for (const gt of g.teams || []) {
      if (!stats[gt.id]) stats[gt.id] = { teamId: gt.id, name: gt.name, member_ids: gt.member_ids || [], wins: 0, plays: 0, totalPoints: 0 };
      if (g.finished_at) {
        stats[gt.id].plays += 1;
        if (winner?.id === gt.id) stats[gt.id].wins += 1;
      }
      stats[gt.id].totalPoints += totals[gt.id] || 0;
    }
  }
  return Object.values(stats).sort((a, b) => b.wins - a.wins || b.totalPoints - a.totalPoints);
}

/* ============ STATS HELPERS ============ */
function findPlayerTeam(game, playerId, allTeams) {
  const direct = (game.teams || []).find(t => (t.member_ids || []).includes(playerId));
  if (direct) return direct;
  for (const gt of game.teams || []) {
    const fresh = allTeams.find(rt => rt.id === gt.id);
    if (fresh && (fresh.member_ids || []).includes(playerId)) {
      return { ...gt, member_ids: fresh.member_ids };
    }
  }
  return null;
}
function buildPlayerGameLog(player, games, teams) {
  if (!player) return [];
  const log = [];
  const sorted = [...games].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  for (const g of sorted) {
    const myTeam = findPlayerTeam(g, player.id, teams);
    if (!myTeam) continue;
    const totals = computeTotals(g);
    const winner = getWinner(g);
    const opponent = (g.teams || []).find(t => t.id !== myTeam.id);
    log.push({
      gameId: g.id, gameName: g.name, roomId: g.room_id, created_at: g.created_at,
      score: totals[myTeam.id] || 0, teamId: myTeam.id, teamName: myTeam.name,
      opponent: opponent?.name || "", opponentScore: opponent ? (totals[opponent.id] || 0) : 0,
      won: g.finished_at ? winner?.id === myTeam.id : null, isFinished: !!g.finished_at,
    });
  }
  return log;
}
function buildTeamGameLog(teamId, games) {
  const log = [];
  const sorted = [...games].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  for (const g of sorted) {
    const myTeam = (g.teams || []).find(t => t.id === teamId);
    if (!myTeam) continue;
    const totals = computeTotals(g);
    const winner = getWinner(g);
    const opponent = (g.teams || []).find(t => t.id !== teamId);
    log.push({
      gameId: g.id, gameName: g.name, roomId: g.room_id, created_at: g.created_at,
      score: totals[teamId] || 0, opponent: opponent?.name || "", opponentId: opponent?.id || null,
      opponentScore: opponent ? (totals[opponent.id] || 0) : 0,
      won: g.finished_at ? winner?.id === teamId : null, isFinished: !!g.finished_at,
    });
  }
  return log;
}
function summarizeLog(log) {
  const finished = log.filter(l => l.isFinished);
  const wins = finished.filter(l => l.won).length;
  const losses = finished.filter(l => !l.won).length;
  const totalPoints = finished.reduce((s, l) => s + l.score, 0);
  const winRate = finished.length > 0 ? Math.round((wins / finished.length) * 100) : 0;
  const avgPerGame = finished.length > 0 ? Math.round(totalPoints / finished.length) : 0;
  const bestGame = finished.length > 0 ? Math.max(...finished.map(l => l.score)) : 0;
  const worstGame = finished.length > 0 ? Math.min(...finished.map(l => l.score)) : 0;
  let currentStreak = { type: null, count: 0 };
  for (let i = finished.length - 1; i >= 0; i--) {
    const f = finished[i];
    if (currentStreak.type === null) currentStreak = { type: f.won ? "win" : "loss", count: 1 };
    else if ((currentStreak.type === "win") === f.won) currentStreak.count += 1;
    else break;
  }
  let longestWinStreak = 0, runningWin = 0;
  for (const f of finished) {
    if (f.won) { runningWin += 1; longestWinStreak = Math.max(longestWinStreak, runningWin); }
    else runningWin = 0;
  }
  return { wins, losses, totalPoints, winRate, avgPerGame, bestGame, worstGame, currentStreak, longestWinStreak, gamesPlayed: log.length, finishedCount: finished.length };
}
function computePlayerStandings(games, teams) {
  const stats = {};
  for (const g of games) {
    if (!g.finished_at) continue;
    const totals = computeTotals(g);
    const winner = getWinner(g);
    for (const gt of g.teams || []) {
      const memberIds = gt.member_ids || (teams.find(rt => rt.id === gt.id)?.member_ids || []);
      for (const pid of memberIds) {
        if (!stats[pid]) stats[pid] = { playerId: pid, wins: 0, plays: 0, totalPoints: 0 };
        stats[pid].plays += 1;
        stats[pid].totalPoints += totals[gt.id] || 0;
        if (winner?.id === gt.id) stats[pid].wins += 1;
      }
    }
  }
  return Object.values(stats).sort((a, b) => b.wins - a.wins || b.totalPoints - a.totalPoints);
}
function computeTeamStandings(games) {
  const stats = {};
  for (const g of games) {
    if (!g.finished_at) continue;
    const totals = computeTotals(g);
    const winner = getWinner(g);
    for (const gt of g.teams || []) {
      if (!stats[gt.id]) stats[gt.id] = { teamId: gt.id, name: gt.name, member_ids: gt.member_ids, wins: 0, plays: 0, totalPoints: 0 };
      stats[gt.id].plays += 1;
      stats[gt.id].totalPoints += totals[gt.id] || 0;
      if (winner?.id === gt.id) stats[gt.id].wins += 1;
    }
  }
  return Object.values(stats).sort((a, b) => b.wins - a.wins || b.totalPoints - a.totalPoints);
}

/* ============ TREND CHART ============ */
function TrendChart({ data, accentColor = "#D4AF37" }) {
  if (data.length < 2) {
    return (
      <div className="text-center py-6 mono-font text-[11px]" style={{ color: "rgba(201,185,143,0.5)" }}>
        Need at least 2 finished games to show a trend.
      </div>
    );
  }
  const padding = { top: 16, right: 8, bottom: 24, left: 8 };
  const width = 320, height = 140;
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const max = Math.max(...data.map(d => d.score)) * 1.08;
  const min = Math.min(...data.map(d => d.score)) * 0.92;
  const range = max - min || 1;
  const points = data.map((d, i) => ({
    x: padding.left + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW),
    y: padding.top + innerH - ((d.score - min) / range) * innerH,
    ...d,
  }));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${(padding.top + innerH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padding.top + innerH).toFixed(1)} Z`;
  const gridValues = Array.from({ length: 4 }, (_, i) => min + (range * (i + 0.5)) / 4);
  const avg = data.reduce((s, d) => s + d.score, 0) / data.length;
  const avgY = padding.top + innerH - ((avg - min) / range) * innerH;
  const maxScore = Math.max(...data.map(d => d.score));
  const minScore = Math.min(...data.map(d => d.score));
  const gid = `ca-${accentColor.replace("#", "")}`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridValues.map((v, i) => {
        const y = padding.top + innerH - ((v - min) / range) * innerH;
        return <line key={i} x1={padding.left} y1={y} x2={padding.left + innerW} y2={y} stroke="rgba(212,175,55,0.08)" strokeDasharray="2 4" />;
      })}
      <line x1={padding.left} y1={avgY} x2={padding.left + innerW} y2={avgY} stroke="rgba(212,175,55,0.35)" strokeDasharray="3 3" strokeWidth="1" />
      <text x={padding.left + innerW - 4} y={avgY - 4} textAnchor="end" fontSize="9" fontFamily="'Geist Mono', monospace" fill="#D4AF37" opacity="0.7">avg {Math.round(avg).toLocaleString()}</text>
      <path d={areaD} fill={`url(#${gid})`} />
      <path d={pathD} fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill={p.won ? "#F4CD5C" : "rgba(245,233,207,0.5)"} stroke="#0A2818" strokeWidth="1.5" />
          {(i === 0 || i === points.length - 1 || p.score === maxScore || p.score === minScore) && (
            <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="9" fontFamily="'Geist Mono', monospace" fill="rgba(245,233,207,0.7)" fontWeight="500">
              {p.score >= 1000 ? `${(p.score / 1000).toFixed(1)}k` : p.score}
            </text>
          )}
        </g>
      ))}
      <text x={points[0].x} y={height - 6} textAnchor="start" fontSize="9" fontFamily="'Geist Mono', monospace" fill="rgba(201,185,143,0.5)">{formatShortDate(points[0].created_at)}</text>
      <text x={points[points.length - 1].x} y={height - 6} textAnchor="end" fontSize="9" fontFamily="'Geist Mono', monospace" fill="rgba(201,185,143,0.5)">{formatShortDate(points[points.length - 1].created_at)}</text>
    </svg>
  );
}

function WinLossRhythm({ data, recent = 12 }) {
  const slice = data.slice(-recent);
  if (slice.length === 0) return <div className="mono-font text-[10px]" style={{ color: "rgba(201,185,143,0.4)" }}>—</div>;
  return (
    <div className="flex gap-1 items-end h-7">
      {slice.map((d, i) => (
        <div key={i} className="flex-1 rounded-sm" style={{
          background: d.won ? "linear-gradient(180deg, #F4CD5C, #D4AF37)" : "rgba(245,233,207,0.18)",
          height: d.won ? "100%" : "57%", minWidth: "6px",
        }} title={`${d.gameName}: ${d.score}`} />
      ))}
    </div>
  );
}

function ChartLegend() {
  return (
    <div className="flex items-center justify-center gap-4 mono-font text-[10px] uppercase tracking-wider" style={{ color: "rgba(201,185,143,0.55)" }}>
      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "#F4CD5C" }}></span>won</span>
      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "rgba(245,233,207,0.5)" }}></span>lost</span>
      <span className="flex items-center gap-1.5"><span className="w-3 h-px border-t border-dashed" style={{ borderColor: "rgba(212,175,55,0.5)" }}></span>avg</span>
    </div>
  );
}

function StatTile({ label, value, sub, highlight }) {
  return (
    <div className="surface rounded p-4 text-center">
      <div className="stat-num text-4xl" style={{ color: highlight ? "#F4CD5C" : "#F5E9CF" }}>{value}</div>
      <div className="mono-font text-[10px] uppercase tracking-[0.2em] mt-1 font-medium" style={{ color: "rgba(201,185,143,0.6)" }}>{label}</div>
      {sub && <div className="mono-font text-[10px] mt-1" style={{ color: "rgba(201,185,143,0.4)" }}>{sub}</div>}
    </div>
  );
}
function Label({ children }) { return <div className="section-label"><span className="section-prefix">//</span> {children}</div>; }
function EmptyState({ text }) {
  return (
    <div className="surface rounded py-12 px-6 text-center">
      <div className="text-2xl mb-3" style={{ color: "rgba(212,175,55,0.4)" }}>♠ ♥ ♦ ♣</div>
      <div className="mono-font text-xs font-medium" style={{ color: "rgba(201,185,143,0.7)" }}>{text}</div>
    </div>
  );
}
function Stat({ label, value }) {
  return (
    <div>
      <div className="stat-num text-4xl gold-text-bright">{value}</div>
      <div className="mono-font text-[10px] uppercase tracking-[0.2em] mt-1.5 font-medium" style={{ color: "rgba(201,185,143,0.6)" }}>{label}</div>
    </div>
  );
}
function StatDivider() { return <div className="w-px h-10 mx-auto self-center" style={{ background: "rgba(212,175,55,0.2)" }} />; }

/* ============ TEAM PICKER (shared) ============ */
function TeamPicker({ players, teams, selected, setSelected, setTeams, handleErr, allowAdHoc = true }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newMembers, setNewMembers] = useState([]);
  const [saveToRoster, setSaveToRoster] = useState(true);

  function addRosterTeam(t) {
    if (selected.some(x => x.id === t.id)) return;
    setSelected([...selected, { id: t.id, name: t.name, member_ids: t.member_ids || [] }]);
  }
  async function addAdHoc() {
    if (!newName.trim()) return;
    if (saveToRoster) {
      try {
        const r = await api.send("POST", "/api/teams", { name: newName.trim(), member_ids: newMembers });
        setTeams(prev => [...prev, r.team]);
        setSelected(prev => [...prev, { id: r.team.id, name: r.team.name, member_ids: r.team.member_ids || [] }]);
      } catch (e) { handleErr(e); return; }
    } else {
      const tempId = `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      setSelected(prev => [...prev, { id: tempId, name: newName.trim(), member_ids: newMembers }]);
    }
    setNewName(""); setNewMembers([]); setShowAdd(false);
  }
  const available = teams.filter(rt => !selected.some(t => t.id === rt.id));

  return (
    <div className="space-y-3">
      {selected.length > 0 && (
        <div className="space-y-2">
          {selected.map(t => {
            const members = (t.member_ids || []).map(id => players.find(p => p.id === id)).filter(Boolean);
            return (
              <div key={t.id} className="surface p-3.5 rounded flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="display-font text-xl truncate" style={{ color: "#F5E9CF" }}>{t.name}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {members.length > 0 && <div className="flex -space-x-2">{members.map(m => <Avatar key={m.id} player={m} size={18} />)}</div>}
                    <span className="mono-font text-[11px] ml-1 truncate" style={{ color: "rgba(201,185,143,0.6)" }}>{members.map(m => m.name).join(" · ") || "—"}</span>
                  </div>
                </div>
                <button onClick={() => setSelected(selected.filter(x => x.id !== t.id))} className="p-2" style={{ color: "rgba(201,185,143,0.4)" }}><X size={16} /></button>
              </div>
            );
          })}
        </div>
      )}

      {available.length > 0 && (
        <div>
          <Label>add from roster</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {available.map(t => (
              <button key={t.id} onClick={() => addRosterTeam(t)} className="chip ui-font text-xs px-3 py-1.5 rounded-full font-medium">
                <Plus size={11} className="inline mr-1" />{t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {allowAdHoc && (!showAdd ? (
        <button onClick={() => setShowAdd(true)} className="btn-ghost mono-font w-full py-2.5 rounded text-xs font-medium uppercase tracking-[0.15em]">
          <Plus size={13} className="inline mr-2" />new team
        </button>
      ) : (
        <div className="surface-deeper rounded p-4 space-y-3 fade-up">
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="team name..." className="input-field w-full px-4 py-3 rounded text-sm" />
          {players.length > 0 && (
            <div className="space-y-2">
              <div className="section-label">members</div>
              <div className="flex flex-wrap gap-2">
                {players.map(p => {
                  const sel = newMembers.includes(p.id);
                  return (
                    <button key={p.id} onClick={() => setNewMembers(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])} className={`ui-font text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5 font-medium ${sel ? "chip-active" : "chip"}`}>
                      <Avatar player={p} size={20} />{p.name}{sel && <Check size={11} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <label className="flex items-center gap-2.5 mono-font text-xs cursor-pointer font-medium" style={{ color: "rgba(201,185,143,0.8)" }}>
            <input type="checkbox" checked={saveToRoster} onChange={e => setSaveToRoster(e.target.checked)} style={{ accentColor: "#D4AF37" }} /> save to roster
          </label>
          <div className="flex gap-2">
            <button onClick={() => { setShowAdd(false); setNewName(""); setNewMembers([]); }} className="btn-ghost mono-font flex-1 py-2.5 rounded text-xs font-medium uppercase tracking-wider">cancel</button>
            <button onClick={addAdHoc} disabled={!newName.trim()} className="btn-primary mono-font flex-1 py-2.5 rounded text-xs font-semibold uppercase tracking-[0.15em]">add</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============ MAIN PAGE ============ */
export default function Page() {
  const [authed, setAuthed] = useState(null);
  useEffect(() => {
    api.get("/api/auth/status").then(r => setAuthed(!!r.authed)).catch(() => setAuthed(false));
  }, []);
  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center felt-bg">
        <div className="mono-font text-sm" style={{ color: "rgba(201,185,143,0.6)" }}>loading...</div>
      </div>
    );
  }
  return authed ? <App onLogout={() => setAuthed(false)} /> : <Login onSuccess={() => setAuthed(true)} />;
}

/* ============ LOGIN ============ */
function Login({ onSuccess }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e?.preventDefault?.();
    if (!code.trim() || busy) return;
    setBusy(true); setErr(null);
    try {
      await api.send("POST", "/api/auth/login", { passcode: code });
      onSuccess();
    } catch (e) { setErr(e.message === "UNAUTHORIZED" ? "Invalid passcode" : e.message); }
    finally { setBusy(false); }
  }
  return (
    <div className="min-h-screen relative overflow-hidden felt-bg flex items-center justify-center px-5">
      <CardWatermarks />
      <div className="relative w-full max-w-sm" style={{ zIndex: 1 }}>
        <div className="flex justify-center mb-6"><BiribAppLogo size={56} /></div>
        <form onSubmit={submit} className="surface rounded p-5 space-y-4">
          <div>
            <div className="section-label mb-2"><span className="section-prefix">//</span> enter passcode</div>
            <input type="tel" inputMode="numeric" autoFocus value={code} onChange={e => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 8))} placeholder="••••" className="input-field w-full px-4 py-3 rounded text-center text-2xl tracking-[0.5em] font-medium" style={{ fontFamily: "'Geist Mono', monospace" }} />
          </div>
          {err && <div className="mono-font text-xs" style={{ color: "#FB7185" }}>{err}</div>}
          <button type="submit" disabled={!code.trim() || busy} className="btn-gold mono-font w-full py-3 rounded text-sm font-semibold uppercase tracking-[0.18em]">
            {busy ? "checking..." : "unlock"}
          </button>
        </form>
        <div className="mono-font text-[10px] text-center mt-4 tracking-[0.14em]" style={{ color: "rgba(201,185,143,0.4)" }}>
          v{APP_VERSION}{APP_BUILD ? ` · ${APP_BUILD}` : ""}
        </div>
      </div>
    </div>
  );
}

/* ============ APP SHELL ============ */
function App({ onLogout }) {
  const [view, setView] = useState("home");
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [games, setGames] = useState([]);
  const [currentGameId, setCurrentGameId] = useState(null);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [p, t, rm, g] = await Promise.all([
        api.get("/api/players"),
        api.get("/api/teams"),
        api.get("/api/rooms"),
        api.get("/api/games"),
      ]);
      setPlayers(p.players || []);
      setTeams(t.teams || []);
      setRooms(rm.rooms || []);
      setGames(g.games || []);
    } catch (e) {
      if (e.message === "UNAUTHORIZED") { onLogout(); return; }
      setErrorMsg(e.message);
    } finally { setLoading(false); }
  }
  function handleErr(e) {
    if (e.message === "UNAUTHORIZED") { onLogout(); return; }
    setErrorMsg(e.message);
  }
  async function logout() {
    try { await api.send("POST", "/api/auth/logout"); } catch {}
    onLogout();
  }

  const currentGame = games.find(g => g.id === currentGameId);
  const selectedRoom = rooms.find(r => r.id === selectedRoomId);
  const shared = { players, teams, rooms, games, setPlayers, setTeams, setRooms, setGames, setView, handleErr,
    setCurrentGameId, setSelectedGameId, setSelectedRoomId, setSelectedPlayerId, setSelectedTeamId };

  return (
    <div className="min-h-screen w-full relative overflow-hidden felt-bg">
      <CardWatermarks />
      <div className="relative max-w-2xl mx-auto px-5 py-7 min-h-screen" style={{ zIndex: 1 }}>
        <header className="flex items-center justify-between mb-5 fade-up">
          <button onClick={() => setView("home")} className="text-left"><BiribAppLogo size={44} /></button>
          <div className="flex items-center gap-2">
            {view !== "home" && (
              <button onClick={() => setView("home")} className="btn-ghost mono-font text-xs flex items-center gap-1.5 px-3 py-1.5 rounded font-medium">
                <ArrowLeft size={13} /> home
              </button>
            )}
            <button onClick={logout} title="Log out" className="btn-ghost mono-font text-xs flex items-center gap-1.5 px-2.5 py-1.5 rounded font-medium">
              <LogOut size={13} />
            </button>
          </div>
        </header>
        <div className="h-px mb-5" style={{ background: "rgba(212,175,55,0.2)" }}></div>

        {errorMsg && (
          <div className="mb-4 px-4 py-3 rounded flex items-start justify-between gap-3" style={{ background: "rgba(122,31,43,0.2)", border: "1px solid rgba(184,49,63,0.4)" }}>
            <div className="mono-font text-xs" style={{ color: "#F5E9CF" }}>{errorMsg}</div>
            <button onClick={() => setErrorMsg(null)} style={{ color: "#C9B98F" }} className="flex-shrink-0"><X size={14} /></button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 mono-font" style={{ color: "#C9B98F" }}>loading...</div>
        ) : (
          <>
            {view === "home" && <HomeView {...shared} />}
            {view === "newRoom" && <NewRoomView {...shared} />}
            {view === "room" && selectedRoom && <RoomView room={selectedRoom} {...shared} />}
            {view === "editRoom" && selectedRoom && <EditRoomView room={selectedRoom} {...shared} />}
            {view === "newGame" && <NewGameView room={selectedRoom} {...shared} />}
            {view === "game" && currentGame && <GameView game={currentGame} {...shared} />}
            {view === "gameDetail" && selectedGameId && <GameDetailView game={games.find(g => g.id === selectedGameId)} {...shared} />}
            {view === "players" && <RosterView initialTab="players" {...shared} />}
            {view === "teams" && <RosterView initialTab="teams" {...shared} />}
            {view === "playerStats" && selectedPlayerId && <PlayerStatsView player={players.find(p => p.id === selectedPlayerId)} {...shared} />}
            {view === "teamStats" && selectedTeamId && <TeamStatsView team={teams.find(t => t.id === selectedTeamId)} {...shared} />}
            {view === "history" && <HistoryView {...shared} />}
          </>
        )}

        <AppFooter />
      </div>
    </div>
  );
}

/* Footer shown inside the app: share link plus the running version, so you can
   confirm which build a device has without logging out. */
function AppFooter() {
  const [note, setNote] = useState(null);

  async function share() {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    const payload = { title: "BiribAPP", text: "BiribAPP — score keeper for Biriba", url };
    // Native share sheet where it exists (iOS/iPadOS, Android), clipboard elsewhere.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch (err) {
        // Dismissing the sheet isn't a failure, so don't fall through to copying.
        if (err && err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setNote("link copied");
    } catch {
      setNote(url);
    }
    setTimeout(() => setNote(null), 2400);
  }

  return (
    <div className="mt-10 pt-5" style={{ borderTop: "1px solid rgba(212,175,55,0.15)" }}>
      <div className="flex flex-col items-center gap-3">
        <button onClick={share}
          className="btn-ghost mono-font text-xs flex items-center gap-2 px-4 py-2.5 rounded font-medium uppercase tracking-[0.15em]">
          <Share2 size={13} /> share app
        </button>
        {note && <div className="mono-font text-[10px] fade-up" style={{ color: "#86EFAC" }}>{note}</div>}
        <div className="mono-font text-[10px] tracking-[0.14em]" style={{ color: "rgba(201,185,143,0.35)" }}>
          v{APP_VERSION}{APP_BUILD ? ` · ${APP_BUILD}` : ""}
        </div>
      </div>
    </div>
  );
}

/* Mini playing-card face, used to show the chosen atou. */
function CardFace({ rank, suit, size = "md" }) {
  const st = suitOf(suit);
  if (!rank || !st) return null;
  const dims = size === "sm" ? { w: 26, h: 36, r: 11, s: 11 } : { w: 44, h: 62, r: 17, s: 18 };
  const ink = st.red ? "#E4636F" : "#0A2818";
  return (
    <span className="inline-flex flex-col items-center justify-center rounded flex-shrink-0"
      style={{ width: dims.w, height: dims.h, background: "#F5E9CF", border: "1px solid #D4AF37", lineHeight: 1 }}>
      <span style={{ fontFamily: "'Geist', system-ui, sans-serif", fontWeight: 600, fontSize: dims.r, color: ink }}>{rank}</span>
      <span style={{ fontFamily: "serif", fontSize: dims.s, color: ink }}>{st.sym}</span>
    </span>
  );
}

/* Two-step atou picker: rank first, then suit. */
function AtouPicker({ rank, suit, onChange }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="section-label"><span className="section-prefix">//</span> atou card</span>
        {(rank || suit) && (
          <button type="button" onClick={() => onChange(null, null)}
            className="mono-font text-[10px] uppercase tracking-wider" style={{ color: "rgba(201,185,143,0.5)" }}>
            clear
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {rank && suit ? (
          <CardFace rank={rank} suit={suit} />
        ) : (
          <span className="inline-flex items-center justify-center rounded flex-shrink-0 mono-font text-[9px] uppercase tracking-wider text-center px-1"
            style={{ width: 44, height: 62, border: "1px dashed rgba(212,175,55,0.4)", color: "rgba(201,185,143,0.4)" }}>
            not set
          </span>
        )}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-1">
            {RANKS.map(r => (
              <button key={r} type="button" onClick={() => onChange(r, suit)}
                className={`mono-font text-[11px] font-semibold rounded ${rank === r ? "chip-active" : "chip"}`}
                style={{ minWidth: 30, height: 30 }}>
                {r}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {SUITS.map(st => (
              <button key={st.id} type="button" onClick={() => onChange(rank, st.id)}
                className={`rounded flex items-center justify-center ${suit === st.id ? "chip-active" : "chip"}`}
                style={{ width: 38, height: 32, fontFamily: "serif", fontSize: 17, color: st.red ? "#E4636F" : "#F5E9CF" }}
                aria-label={st.name}>
                {st.sym}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Who deals and who splits, for the round about to be played. */
function RotationPanel({ game, roundNumber, players }) {
  const rot = rotationForRound(game, roundNumber);
  if (!rot) return null;
  const shuffler = players.find(p => p.id === rot.shufflerId);
  const splitter = players.find(p => p.id === rot.splitterId);
  if (!shuffler && !splitter) return null;

  return (
    <div className="rounded px-4 py-3 space-y-2"
      style={{ background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.28)" }}>
      <div className="section-label"><span className="section-prefix">//</span> round {roundNumber}</div>
      {shuffler && <DealRow player={shuffler} action="deal" tone="gold" flashClass="deal-flash" />}
      {splitter && <DealRow player={splitter} action="make biribákia" tone="cream" flashClass="deal-flash-2" />}
    </div>
  );
}

function DealRow({ player, action, tone, flashClass }) {
  const color = tone === "gold" ? "#F4CD5C" : "#F5E9CF";
  return (
    <div className="flex items-center gap-2.5">
      <Avatar player={player} size={26} />
      <span className="ui-font text-sm font-semibold uppercase tracking-wide truncate" style={{ color: "#F5E9CF" }}>
        {player.name}
      </span>
      <span className={`mono-font text-[11px] font-semibold uppercase tracking-[0.18em] ${flashClass}`} style={{ color }}>
        {action}
      </span>
    </div>
  );
}

/* Team tints so you can see at a glance whether partners are sitting opposite. */
const SEAT_TINTS = [
  { ring: "#D4AF37", soft: "rgba(212,175,55,0.16)" },
  { ring: "#22C55E", soft: "rgba(34,197,94,0.16)" },
  { ring: "#E4636F", soft: "rgba(228,99,111,0.16)" },
  { ring: "#8FB8DE", soft: "rgba(143,184,222,0.16)" },
];

/* Seats laid out evenly around a table, so four players form a cross with
   partners facing each other. Index order runs clockwise from the top, which is
   exactly the order the shuffle passes in. */
function TableSeating({ candidates, seating, setSeating, shuffleStart, setShuffleStart }) {
  const n = candidates.length;
  const size = 268;
  const cx = size / 2, cy = size / 2, radius = size / 2 - 34;

  /* Seats keep their positions while you edit, so the array may hold nulls.
     It is only sent to the server once every seat is filled. */
  const slots = Array.from({ length: n }, (_, i) => seating[i] || null);
  const [activeSeat, setActiveSeat] = useState(null);

  const unseated = candidates.filter(p => !slots.includes(p.id));
  const seatedCount = slots.filter(Boolean).length;
  const full = seatedCount === n;

  /* Put a player in the active seat. If they already have a seat, the two swap,
     so rearranging never needs a reset. */
  function assign(playerId) {
    if (activeSeat == null) return;
    const next = [...slots];
    const from = next.indexOf(playerId);
    const displaced = next[activeSeat];
    next[activeSeat] = playerId;
    if (from !== -1 && from !== activeSeat) next[from] = displaced || null;
    setSeating(next);
    setActiveSeat(null);
  }

  function clearSeat(idx) {
    const next = [...slots];
    next[idx] = null;
    setSeating(next);
    setActiveSeat(null);
  }

  function tapSeat(i) {
    setActiveSeat(prev => (prev === i ? null : i));
  }

  /* Alternate team members so partners land opposite each other. */
  function autoSeat() {
    const byTeam = [];
    for (const p of candidates) {
      const k = p.teamIdx ?? 0;
      if (!byTeam[k]) byTeam[k] = [];
      byTeam[k].push(p);
    }
    const teams = byTeam.filter(Boolean);
    const out = [];
    while (out.length < n) {
      let placedAny = false;
      for (const t of teams) {
        const next = t.shift();
        if (next) { out.push(next.id); placedAny = true; }
      }
      if (!placedAny) break;
    }
    setSeating(out);
    setShuffleStart(0);
    setActiveSeat(null);
  }

  // With four seats and two teams, partners should be two apart.
  const partnersOpposite = (() => {
    if (!full || n !== 4) return null;
    const t = slots.map(id => candidates.find(p => p.id === id)?.teamIdx);
    return t[0] === t[2] && t[1] === t[3] && t[0] !== t[1];
  })();

  const activePlayer = activeSeat != null && slots[activeSeat]
    ? candidates.find(p => p.id === slots[activeSeat])
    : null;

  return (
    <div className="surface rounded p-4 space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="section-label"><span className="section-prefix">//</span> seating</span>
        <div className="flex items-center gap-3">
          <button type="button" onClick={autoSeat}
            className="mono-font text-[10px] uppercase tracking-wider" style={{ color: "rgba(212,175,55,0.85)" }}>
            auto seat
          </button>
          {seatedCount > 0 && (
            <button type="button" onClick={() => { setSeating([]); setShuffleStart(0); setActiveSeat(null); }}
              className="mono-font text-[10px] uppercase tracking-wider" style={{ color: "rgba(201,185,143,0.5)" }}>
              reset
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative" style={{ width: size, height: size }}>
          <div className="absolute rounded-full"
            style={{
              left: 44, top: 44, right: 44, bottom: 44,
              background: "rgba(10,40,24,0.65)",
              border: "1px solid rgba(212,175,55,0.25)",
              boxShadow: "inset 0 0 24px rgba(0,0,0,0.35)",
            }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg" style={{ color: "rgba(212,175,55,0.25)" }}>♠ ♥ ♦ ♣</span>
            </div>
          </div>

          {slots.map((pid, i) => {
            const angle = (-90 + i * (360 / n)) * Math.PI / 180;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            const p = pid ? candidates.find(c => c.id === pid) : null;
            const tint = p ? SEAT_TINTS[(p.teamIdx ?? 0) % SEAT_TINTS.length] : null;
            const isFirst = full && shuffleStart === i;
            const isActive = activeSeat === i;
            return (
              <button key={i} type="button" onClick={() => tapSeat(i)}
                className={`absolute flex flex-col items-center justify-center rounded-full ${isActive ? "seat-active" : ""}`}
                style={{
                  left: x - 30, top: y - 30, width: 60, height: 60,
                  background: isActive ? "rgba(212,175,55,0.2)" : tint ? tint.soft : "rgba(15,61,36,0.4)",
                  border: `1px ${p ? "solid" : "dashed"} ${isActive ? "#F4CD5C" : isFirst ? "#F4CD5C" : tint ? tint.ring : "rgba(212,175,55,0.3)"}`,
                }}
                aria-label={p ? `seat ${i + 1}, ${p.name}` : `seat ${i + 1}, empty`}>
                {p ? (
                  <>
                    <Avatar player={p} size={26} />
                    <span className="mono-font text-[8px] mt-0.5 truncate w-full text-center px-0.5" style={{ color: "#F5E9CF" }}>
                      {p.name.split(" ")[0]}
                    </span>
                  </>
                ) : (
                  <span className="stat-num text-lg" style={{ color: isActive ? "#F4CD5C" : "rgba(201,185,143,0.35)" }}>{i + 1}</span>
                )}
                {isFirst && !isActive && (
                  <span className="absolute" style={{ top: -9, right: -4 }}>
                    <Crown size={14} style={{ color: "#F4CD5C" }} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {activeSeat == null ? (
        <div className="mono-font text-[10px] text-center" style={{ color: "rgba(201,185,143,0.5)" }}>
          {full ? "tap a seat to change who sits there" : "tap a seat, then choose who sits there — place everyone as they actually sit"}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="section-label">who sits in seat {activeSeat + 1}?</span>
            <div className="flex items-center gap-3">
              {activePlayer && (
                <button type="button" onClick={() => clearSeat(activeSeat)}
                  className="mono-font text-[10px] uppercase tracking-wider" style={{ color: "rgba(201,185,143,0.6)" }}>
                  empty seat
                </button>
              )}
              <button type="button" onClick={() => setActiveSeat(null)}
                className="mono-font text-[10px] uppercase tracking-wider" style={{ color: "rgba(201,185,143,0.45)" }}>
                cancel
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {candidates.map(p => {
              const tint = SEAT_TINTS[(p.teamIdx ?? 0) % SEAT_TINTS.length];
              const atSeat = slots.indexOf(p.id);
              const here = atSeat === activeSeat;
              return (
                <button key={p.id} type="button" onClick={() => assign(p.id)}
                  className="ui-font text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5 font-medium"
                  style={{
                    background: here ? "rgba(34,197,94,0.18)" : tint.soft,
                    border: `1px solid ${here ? "#22C55E" : tint.ring}`,
                    color: "#F5E9CF",
                    opacity: atSeat !== -1 && !here ? 0.6 : 1,
                  }}>
                  <Avatar player={p} size={20} />{p.name}
                  {atSeat !== -1 && !here && (
                    <span className="mono-font text-[9px]" style={{ color: "rgba(201,185,143,0.7)" }}>seat {atSeat + 1}</span>
                  )}
                  {here && <Check size={10} />}
                </button>
              );
            })}
          </div>
          {unseated.length === 0 && (
            <div className="mono-font text-[10px]" style={{ color: "rgba(201,185,143,0.45)" }}>
              everyone is seated — picking someone swaps the two seats
            </div>
          )}
        </div>
      )}

      {full && (
        <div className="space-y-1.5 pt-1">
          <div className="section-label">who shuffles first?</div>
          <div className="flex flex-wrap gap-2">
            {slots.map((pid, i) => {
              const p = candidates.find(c => c.id === pid);
              if (!p) return null;
              return (
                <button key={p.id} type="button" onClick={() => setShuffleStart(i)}
                  className={`ui-font text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5 font-medium ${shuffleStart === i ? "chip-active" : "chip"}`}>
                  <Avatar player={p} size={18} />{p.name}
                  {shuffleStart === i && <Check size={10} />}
                </button>
              );
            })}
          </div>
          <div className="mono-font text-[10px]" style={{ color: "rgba(201,185,143,0.45)" }}>
            the player on their left splits the biribákia · the deal passes anti-clockwise
          </div>
          {partnersOpposite === false && (
            <div className="mono-font text-[10px]" style={{ color: "#F7A356" }}>
              partners aren’t sitting opposite — try auto seat
            </div>
          )}
          {partnersOpposite === true && (
            <div className="mono-font text-[10px] flex items-center gap-1.5" style={{ color: "#86EFAC" }}>
              <Check size={10} /> partners are opposite
            </div>
          )}
        </div>
      )}

      {candidates.length === 0 && (
        <div className="mono-font text-[11px] italic" style={{ color: "rgba(201,185,143,0.5)" }}>
          add teams with members first
        </div>
      )}
    </div>
  );
}

/* ============ HOME ============ */
function HomeView({ players, rooms, games, setView, setSelectedRoomId, setCurrentGameId, setSelectedGameId }) {
  const openRooms = rooms.filter(r => !r.closed_at);
  const closedRooms = rooms.filter(r => r.closed_at);
  const loose = orphanGames(games);

  return (
    <div className="fade-up space-y-5">
      <div className="space-y-2">
        <button onClick={() => setView("newRoom")} className="btn-gold mono-font w-full py-4 rounded flex items-center justify-between px-5 text-sm font-semibold uppercase tracking-[0.15em]">
          <span className="flex items-center gap-2.5"><Sparkles size={15} /> new room</span>
          <ChevronRight size={16} />
        </button>
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => setView("players")} className="btn-ghost mono-font py-3 rounded flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-wider">
            <User size={14} /> players
          </button>
          <button onClick={() => setView("teams")} className="btn-ghost mono-font py-3 rounded flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-wider">
            <Users size={14} /> teams
          </button>
          <button onClick={() => setView("history")} className="btn-ghost mono-font py-3 rounded flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-wider">
            <Trophy size={14} /> history
          </button>
        </div>
      </div>

      {openRooms.length > 0 && (
        <div className="space-y-3">
          <div className="ornament-divider section-label"><span><span className="section-prefix">//</span> your rooms</span></div>
          <div className="space-y-2">
            {openRooms.map(r => (
              <RoomCard key={r.id} room={r} games={games} players={players} onClick={() => { setSelectedRoomId(r.id); setView("room"); }} />
            ))}
          </div>
        </div>
      )}

      {openRooms.length === 0 && (
        <EmptyState text="No rooms yet. Create one for the place you play — a room holds all the games you play there." />
      )}

      {closedRooms.length > 0 && (
        <div className="space-y-3">
          <div className="ornament-divider section-label"><span><span className="section-prefix">//</span> closed rooms</span></div>
          <div className="space-y-2">
            {closedRooms.map(r => (
              <RoomCard key={r.id} room={r} games={games} players={players} onClick={() => { setSelectedRoomId(r.id); setView("room"); }} />
            ))}
          </div>
        </div>
      )}

      {loose.length > 0 && (
        <div className="space-y-3">
          <div className="ornament-divider section-label"><span><span className="section-prefix">//</span> games without a room</span></div>
          <div className="space-y-2">
            {loose.map(g => {
              const totals = computeTotals(g);
              const winner = getWinner(g);
              return (
                <button key={g.id} onClick={() => {
                  if (g.finished_at) { setSelectedGameId(g.id); setView("gameDetail"); }
                  else { setCurrentGameId(g.id); setView("game"); }
                }} className="surface w-full p-4 rounded text-left flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="display-font text-xl truncate" style={{ color: "#F5E9CF" }}>{g.name}</div>
                    <div className="mono-font text-[10px] mt-0.5" style={{ color: "rgba(201,185,143,0.6)" }}>
                      {formatShortDate(g.created_at)} · {g.finished_at ? `${winner?.name} won (${totals[winner?.id] || 0})` : "in progress"}
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: "#D4AF37" }} className="opacity-50 flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* Pulsing "live" pill, used on room cards and on games in play. */
function LiveBadge({ count, label = "live" }) {
  return (
    <span className="live-badge mono-font text-[10px] uppercase tracking-[0.14em] font-semibold inline-flex items-center gap-1.5 px-2 py-1 rounded"
      style={{ background: "rgba(34,197,94,0.12)", color: "#86EFAC", border: "1px solid rgba(34,197,94,0.35)" }}>
      <span className="live-dot" />
      {count != null ? `${count} ${label}` : label}
    </span>
  );
}

function RoomCard({ room, games, players, onClick }) {
  const rg = gamesInRoom(games, room.id);
  const live = rg.filter(g => !g.finished_at);
  const standings = computeRoomStandings(rg);
  const leader = standings[0];
  const leaderMembers = (leader?.member_ids || []).map(id => players.find(p => p.id === id)).filter(Boolean);
  return (
    <button onClick={onClick} className="surface w-full p-4 rounded text-left hover:border-yellow-600/40 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="display-font text-2xl truncate" style={{ color: "#F5E9CF" }}>{room.name}</div>
          {room.location && (
            <div className="mono-font text-[10px] mt-0.5 flex items-center gap-1" style={{ color: "rgba(201,185,143,0.55)" }}>
              <MapPin size={9} /> {room.location}
            </div>
          )}
          <div className="mono-font text-[11px] mt-1.5 flex items-center gap-2 flex-wrap font-medium" style={{ color: "rgba(201,185,143,0.7)" }}>
            <span className="flex items-center gap-1"><Layers size={10} /> {rg.length} {rg.length === 1 ? "game" : "games"}</span>
            {leader && leader.wins > 0 && (<><span style={{ color: "#D4AF37" }}>·</span><span className="gold-text">{leader.name} leads {leader.wins}</span></>)}
          </div>
          {leaderMembers.length > 0 && (
            <div className="flex -space-x-1.5 mt-1.5">{leaderMembers.map(m => <Avatar key={m.id} player={m} size={16} />)}</div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
          {live.length > 0 && <LiveBadge count={live.length} />}
          <ChevronRight size={18} style={{ color: "#D4AF37" }} className="opacity-60" />
        </div>
      </div>
    </button>
  );
}

/* ============ NEW ROOM ============ */
function NewRoomView({ players, teams, setTeams, setRooms, setSelectedRoomId, setView, handleErr }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [target, setTarget] = useState(3000);
  const [selected, setSelected] = useState([]);
  const [busy, setBusy] = useState(false);

  async function create() {
    if (!name.trim() || busy) return;
    setBusy(true);
    try {
      const r = await api.send("POST", "/api/rooms", {
        name: name.trim(),
        location: location.trim() || null,
        default_target_score: Number(target) || 3000,
        default_teams: selected.map(t => ({ id: t.id, name: t.name, member_ids: t.member_ids || [] })),
      });
      setRooms(prev => [r.room, ...prev]);
      setSelectedRoomId(r.room.id);
      setView("room");
    } catch (e) { handleErr(e); setBusy(false); }
  }

  return (
    <div className="fade-up space-y-4">
      <div className="text-center">
        <div className="section-label"><span className="section-prefix">//</span> new room</div>
        <h2 className="display-font text-4xl mt-2" style={{ color: "#F5E9CF" }}>Create a Room</h2>
        <div className="mono-font text-[11px] mt-2" style={{ color: "rgba(201,185,143,0.6)" }}>a room holds all the games you play at one place</div>
      </div>

      <div className="surface rounded p-4 space-y-4">
        <div>
          <Label>room name</Label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Yiayia's Kitchen" className="input-field w-full px-4 py-3 rounded text-base mt-2" />
        </div>
        <div>
          <Label>location (optional)</Label>
          <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Kifisia" className="input-field w-full px-4 py-3 rounded text-base mt-2" />
        </div>
        <div>
          <Label>default target score</Label>
          <input type="number" value={target} onChange={e => setTarget(e.target.value)} className="input-field w-full px-4 py-3 rounded text-base mt-2" />
          <div className="mono-font text-[10px] mt-1.5" style={{ color: "rgba(201,185,143,0.45)" }}>each game starts with this, and you can change it per game</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="section-label flex items-center justify-between">
          <span><span className="section-prefix">//</span> regular teams ({selected.length})</span>
          <span className="normal-case tracking-normal text-[10px]" style={{ color: "rgba(201,185,143,0.4)" }}>optional</span>
        </div>
        <div className="mono-font text-[10px]" style={{ color: "rgba(201,185,143,0.45)" }}>the teams that usually play here — every new game is pre-filled with them</div>
        <TeamPicker players={players} teams={teams} selected={selected} setSelected={setSelected} setTeams={setTeams} handleErr={handleErr} />
      </div>

      <button onClick={create} disabled={!name.trim() || busy} className="btn-gold mono-font w-full py-4 rounded text-sm font-semibold uppercase tracking-[0.18em]">
        {busy ? "creating..." : "create room →"}
      </button>
    </div>
  );
}

/* ============ EDIT ROOM ============ */
function EditRoomView({ room, players, teams, setTeams, setRooms, setView, handleErr }) {
  const [name, setName] = useState(room.name);
  const [location, setLocation] = useState(room.location || "");
  const [target, setTarget] = useState(room.default_target_score || 3000);
  const [selected, setSelected] = useState(room.default_teams || []);
  const [busy, setBusy] = useState(false);

  async function save() {
    if (!name.trim() || busy) return;
    setBusy(true);
    try {
      const r = await api.send("PATCH", `/api/rooms/${room.id}`, {
        name: name.trim(),
        location: location.trim() || null,
        default_target_score: Number(target) || 3000,
        default_teams: selected.map(t => ({ id: t.id, name: t.name, member_ids: t.member_ids || [] })),
      });
      setRooms(prev => prev.map(x => x.id === room.id ? r.room : x));
      setView("room");
    } catch (e) { handleErr(e); setBusy(false); }
  }

  return (
    <div className="fade-up space-y-4">
      <div className="text-center">
        <div className="section-label"><span className="section-prefix">//</span> edit room</div>
        <h2 className="display-font text-4xl mt-2" style={{ color: "#F5E9CF" }}>{room.name}</h2>
      </div>
      <div className="surface rounded p-4 space-y-4">
        <div>
          <Label>room name</Label>
          <input value={name} onChange={e => setName(e.target.value)} className="input-field w-full px-4 py-3 rounded text-base mt-2" />
        </div>
        <div>
          <Label>location</Label>
          <input value={location} onChange={e => setLocation(e.target.value)} placeholder="optional" className="input-field w-full px-4 py-3 rounded text-base mt-2" />
        </div>
        <div>
          <Label>default target score</Label>
          <input type="number" value={target} onChange={e => setTarget(e.target.value)} className="input-field w-full px-4 py-3 rounded text-base mt-2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="section-label"><span className="section-prefix">//</span> regular teams ({selected.length})</div>
        <TeamPicker players={players} teams={teams} selected={selected} setSelected={setSelected} setTeams={setTeams} handleErr={handleErr} />
      </div>
      <div className="flex gap-2">
        <button onClick={() => setView("room")} className="btn-ghost mono-font flex-1 py-3 rounded text-xs font-medium uppercase tracking-wider">cancel</button>
        <button onClick={save} disabled={!name.trim() || busy} className="btn-gold mono-font flex-1 py-3 rounded text-xs font-semibold uppercase tracking-[0.15em]">{busy ? "saving..." : "save"}</button>
      </div>
    </div>
  );
}

/* ============ ROOM DETAIL ============ */
function RoomView({ room, players, games, rooms, setRooms, setGames, setView, setSelectedRoomId, setCurrentGameId, setSelectedGameId, setSelectedTeamId, handleErr }) {
  async function deleteEmptyGame(g) {
    if (!gameHasNoPoints(g)) return;
    if (!confirm(`Delete "${g.name}"? It has no points recorded.`)) return;
    try {
      await api.send("DELETE", `/api/games/${g.id}`);
      setGames(prev => prev.filter(x => x.id !== g.id));
    } catch (e) { handleErr(e); }
  }

  const rg = gamesInRoom(games, room.id);
  const live = rg.filter(g => !g.finished_at);
  const done = rg.filter(g => g.finished_at);
  const standings = computeRoomStandings(rg);
  const medalColors = ["#F4CD5C", "#E8E4D0", "#C68B5C"];

  async function toggleClosed() {
    try {
      const r = await api.send("PATCH", `/api/rooms/${room.id}`, { closed_at: room.closed_at ? null : new Date().toISOString() });
      setRooms(prev => prev.map(x => x.id === room.id ? r.room : x));
    } catch (e) { handleErr(e); }
  }
  async function deleteRoom() {
    if (!confirm(`Delete "${room.name}" and all ${rg.length} of its games? This cannot be undone.`)) return;
    try {
      await api.send("DELETE", `/api/rooms/${room.id}`);
      setRooms(prev => prev.filter(x => x.id !== room.id));
      setGames(prev => prev.filter(g => g.room_id !== room.id));
      setView("home");
    } catch (e) { handleErr(e); }
  }

  return (
    <div className="fade-up space-y-5">
      <div className="text-center">
        <div className="section-label">
          <span className="section-prefix">//</span> {room.closed_at ? "closed room" : "room"}
          {room.default_target_score ? ` · target ${room.default_target_score}` : ""}
        </div>
        <h2 className="display-font text-5xl mt-2" style={{ color: "#F5E9CF" }}>{room.name}</h2>
        {room.location && (
          <div className="mono-font text-[11px] mt-2 flex items-center justify-center gap-1.5 uppercase tracking-[0.2em]" style={{ color: "rgba(201,185,143,0.6)" }}>
            <MapPin size={10} /> {room.location}
          </div>
        )}
      </div>

      <div className="surface rounded p-5">
        <div className="grid grid-cols-3 gap-4 text-center">
          <Stat label="games" value={rg.length} />
          <StatDivider />
          <Stat label="rounds" value={rg.reduce((s, g) => s + (g.rounds?.length || 0), 0)} />
          <StatDivider />
          <Stat label="teams" value={standings.length} />
        </div>
      </div>

      {!room.closed_at && (
        <button onClick={() => { setSelectedRoomId(room.id); setView("newGame"); }} className="btn-gold mono-font w-full py-4 rounded text-sm font-semibold uppercase tracking-[0.18em]">
          <Plus size={15} className="inline mr-2" />new game in this room
        </button>
      )}

      {standings.length > 0 && standings.some(s => s.plays > 0) && (
        <div className="space-y-3">
          <div className="ornament-divider section-label"><span><span className="section-prefix">//</span> room standings</span></div>
          <div className="surface rounded overflow-hidden">
            {standings.map((s, i) => {
              const members = (s.member_ids || []).map(id => players.find(p => p.id === id)).filter(Boolean);
              const winRate = s.plays > 0 ? Math.round((s.wins / s.plays) * 100) : 0;
              return (
                <button key={s.teamId} onClick={() => { setSelectedTeamId(s.teamId); setView("teamStats"); }} className="w-full px-5 py-3.5 flex items-center justify-between border-b last:border-0 hover:bg-white/5 transition text-left" style={{ borderColor: "rgba(212,175,55,0.1)" }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded flex items-center justify-center stat-num text-base font-semibold flex-shrink-0" style={{
                      background: i < 3 ? `${medalColors[i]}1a` : "rgba(15,61,36,0.5)",
                      border: `1px solid ${i < 3 ? medalColors[i] : "rgba(212,175,55,0.2)"}`,
                      color: i < 3 ? medalColors[i] : "rgba(245,233,207,0.7)",
                    }}>{i + 1}</div>
                    <div className="min-w-0">
                      <div className="display-font text-2xl truncate" style={{ color: "#F5E9CF" }}>{s.name}</div>
                      {members.length > 0 && <div className="flex -space-x-1.5 mt-0.5">{members.map(m => <Avatar key={m.id} player={m} size={16} />)}</div>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 flex items-center gap-3">
                    <div>
                      <div className="stat-num text-base" style={{ color: "#F5E9CF" }}>{winRate}<span className="mono-font text-[10px] ml-0.5" style={{ color: "rgba(201,185,143,0.5)" }}>%</span></div>
                      <div className="mono-font text-[9px] uppercase tracking-wider" style={{ color: "rgba(201,185,143,0.5)" }}>rate</div>
                    </div>
                    <div>
                      <div className="stat-num text-2xl" style={{ color: "#F5E9CF" }}>{s.wins}<span className="mono-font text-xs ml-1" style={{ color: "rgba(201,185,143,0.5)" }}>/ {s.plays}</span></div>
                      <div className="mono-font text-[10px] uppercase tracking-wider" style={{ color: "rgba(201,185,143,0.5)" }}>wins</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {live.length > 0 && (
        <div className="space-y-3">
          <div className="ornament-divider section-label">
            <span className="flex items-center gap-2">
              <span><span className="section-prefix">//</span> in play</span>
              <LiveBadge count={live.length} />
            </span>
          </div>
          <div className="space-y-2">
            {live.map(g => {
              const totals = computeTotals(g);
              const leader = [...(g.teams || [])].sort((a, b) => (totals[b.id] || 0) - (totals[a.id] || 0))[0];
              return (
                <div key={g.id} className="surface rounded flex items-center hover:border-yellow-600/40 transition">
                  <button onClick={() => { setCurrentGameId(g.id); setView("game"); }} className="flex-1 min-w-0 p-4 text-left">
                    <div className="display-font text-2xl truncate" style={{ color: "#F5E9CF" }}>{g.name}</div>
                    <div className="mono-font text-[11px] mt-1 flex items-center gap-2 flex-wrap" style={{ color: "rgba(201,185,143,0.7)" }}>
                      <LiveBadge />
                      <span>{(g.rounds?.length || 0)} rounds</span>
                      <span style={{ color: "#D4AF37" }}>·</span>
                      <span>target {g.target_score}</span>
                      {leader && (<><span style={{ color: "#D4AF37" }}>·</span><span className="gold-text">{leader.name} {totals[leader.id] || 0}</span></>)}
                    </div>
                  </button>
                  {gameHasNoPoints(g) ? (
                    <button onClick={() => deleteEmptyGame(g)} title="Delete — nothing scored yet"
                      className="p-4 flex-shrink-0" style={{ color: "rgba(201,185,143,0.45)" }}>
                      <Trash2 size={15} />
                    </button>
                  ) : (
                    <div className="p-4 flex-shrink-0"><ChevronRight size={18} style={{ color: "#D4AF37" }} className="opacity-60" /></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {done.length > 0 && (
        <div className="space-y-3">
          <div className="ornament-divider section-label"><span><span className="section-prefix">//</span> finished games ({done.length})</span></div>
          <div className="space-y-2">
            {done.map(g => {
              const winner = getWinner(g);
              const totals = computeTotals(g);
              return (
                <div key={g.id} className="surface rounded flex items-center hover:border-yellow-600/40 transition">
                  <button onClick={() => { setSelectedGameId(g.id); setView("gameDetail"); }} className="flex items-center gap-3 min-w-0 flex-1 p-3.5 text-left">
                    <div className="flex-shrink-0 w-9 h-9 rounded flex items-center justify-center" style={{ background: "rgba(212,175,55,0.12)", border: "1px solid #D4AF37" }}>
                      <Crown size={14} style={{ color: "#F4CD5C" }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="display-font text-lg truncate" style={{ color: "#F5E9CF" }}>{g.name}</div>
                      <div className="mono-font text-[10px] mt-0.5" style={{ color: "rgba(201,185,143,0.6)" }}>{formatShortDate(g.created_at)} · {winner?.name} won</div>
                    </div>
                  </button>
                  {gameHasNoPoints(g) ? (
                    <button onClick={() => deleteEmptyGame(g)} title="Delete — nothing scored yet"
                      className="p-3.5 flex-shrink-0" style={{ color: "rgba(201,185,143,0.45)" }}>
                      <Trash2 size={15} />
                    </button>
                  ) : (
                    <div className="stat-num text-xl flex-shrink-0 px-3.5 gold-text-bright">{totals[winner?.id] || 0}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {rg.length === 0 && <EmptyState text="No games in this room yet. Start the first one above." />}

      <div className="pt-2 space-y-2">
        <div className="ornament-divider section-label"><span><span className="section-prefix">//</span> room settings</span></div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setView("editRoom")} className="btn-ghost mono-font py-3 rounded flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-wider">
            <Edit3 size={13} /> edit room
          </button>
          <button onClick={toggleClosed} className="btn-ghost mono-font py-3 rounded flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-wider">
            <DoorOpen size={13} /> {room.closed_at ? "reopen" : "close room"}
          </button>
        </div>
        <button onClick={deleteRoom} className="btn-ghost mono-font w-full py-2.5 rounded text-[11px] font-medium uppercase tracking-wider" style={{ color: "rgba(251,113,133,0.8)", borderColor: "rgba(184,49,63,0.3)" }}>
          <Trash2 size={12} className="inline mr-1.5" /> delete room and its games
        </button>
      </div>
    </div>
  );
}

/* ============ NEW GAME (inside a room) ============ */
function NewGameView({ room, players, teams, games, setTeams, setGames, setCurrentGameId, setView, handleErr }) {
  const roomDefaults = room?.default_teams || [];
  const existingCount = room ? gamesInRoom(games, room.id).length : 0;
  const suggestedName = room ? `Game ${existingCount + 1}` : "Game 1";
  const [name, setName] = useState("");
  const [target, setTarget] = useState(room?.default_target_score || 3000);
  const [selected, setSelected] = useState(roomDefaults.map(t => ({ id: t.id, name: t.name, member_ids: t.member_ids || [] })));
  const [starting, setStarting] = useState(false);
  const [seating, setSeating] = useState([]);
  const [shuffleStart, setShuffleStart] = useState(0);

  // Everyone who belongs to a team in this game is a candidate for a seat.
  // teamIdx drives the seat tint and lets auto-seat alternate teams so partners
  // end up facing each other.
  const seatCandidates = [];
  selected.forEach((t, teamIdx) => {
    for (const id of (t.member_ids || [])) {
      if (!seatCandidates.some(p => p.id === id)) {
        const p = players.find(x => x.id === id);
        if (p) seatCandidates.push({ ...p, teamIdx, teamName: t.name });
      }
    }
  });

  // If teams change after seats were assigned, drop seats for players who are no
  // longer in the lineup. Seating is only sent when the whole ring is filled,
  // since a partial ring would give a wrong shuffle rotation.
  const keptSeats = seating.map(id => (seatCandidates.some(p => p.id === id) ? id : null));
  const seatingComplete = seatCandidates.length >= 2
    && keptSeats.length === seatCandidates.length
    && keptSeats.every(Boolean);
  const validSeating = seatingComplete ? keptSeats : [];

  async function start() {
    const gameName = name.trim() || suggestedName || "Game";
    if (selected.length < 2 || starting) return;
    setStarting(true);
    try {
      const r = await api.send("POST", "/api/games", {
        room_id: room?.id || null,
        name: gameName,
        target_score: Number(target) || 3000,
        teams: selected.map(t => ({ id: t.id, name: t.name, member_ids: t.member_ids || [] })),
        seating: validSeating,
        shuffle_start: validSeating.length >= 2 ? Math.min(shuffleStart, validSeating.length - 1) : 0,
      });
      setGames(prev => [r.game, ...prev]);
      setCurrentGameId(r.game.id);
      setView("game");
    } catch (e) { handleErr(e); setStarting(false); }
  }

  return (
    <div className="fade-up space-y-4">
      <div className="text-center">
        <div className="section-label"><span className="section-prefix">//</span> new game{room ? ` in ${room.name}` : ""}</div>
        <h2 className="display-font text-4xl mt-2" style={{ color: "#F5E9CF" }}>Deal a Game</h2>
      </div>

      <div className="surface rounded p-4 space-y-4">
        <div>
          <Label>game name</Label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder={suggestedName || "Round 1"} className="input-field w-full px-4 py-3 rounded text-base mt-2" />
        </div>
        <div>
          <Label>target score</Label>
          <input type="number" value={target} onChange={e => setTarget(e.target.value)} className="input-field w-full px-4 py-3 rounded text-base mt-2" />
          {room && Number(target) !== room.default_target_score && (
            <div className="mono-font text-[10px] mt-1.5 gold-text">overriding room default of {room.default_target_score}</div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="section-label flex items-center justify-between">
          <span><span className="section-prefix">//</span> teams ({selected.length})</span>
          <span className="normal-case tracking-normal text-[10px]" style={{ color: "rgba(201,185,143,0.4)" }}>min. 2</span>
        </div>
        {roomDefaults.length > 0 && (
          <div className="mono-font text-[10px]" style={{ color: "rgba(201,185,143,0.45)" }}>pre-filled from the room — change them freely for this game</div>
        )}
        <TeamPicker players={players} teams={teams} selected={selected} setSelected={setSelected} setTeams={setTeams} handleErr={handleErr} />
      </div>

      {seatCandidates.length >= 2 && (
        <TableSeating candidates={seatCandidates} seating={keptSeats} setSeating={setSeating}
          shuffleStart={shuffleStart} setShuffleStart={setShuffleStart} />
      )}

      <button onClick={start} disabled={selected.length < 2 || starting} className="btn-gold mono-font w-full py-4 rounded text-sm font-semibold uppercase tracking-[0.18em]">
        {starting ? "dealing..." : "begin game →"}
      </button>
      {selected.length < 2 && <div className="mono-font text-xs text-center font-medium" style={{ color: "rgba(201,185,143,0.4)" }}>add at least two teams to begin</div>}
    </div>
  );
}

/* ============ GAME ============ */
/* Shown once a team crosses the target. The game is closed automatically
   behind this; dismissing the overlay just gets it out of the way. */
function WinOverlay({ name, total, target, onClose }) {
  const suits = ["♠", "♥", "♦", "♣", "♠", "♥"];
  return (
    <div className="fixed inset-0 flex items-center justify-center px-6 win-backdrop" style={{ zIndex: 60 }} onClick={onClose}>
      <div className="win-card surface-deeper rounded p-8 text-center relative overflow-hidden w-full max-w-sm"
        onClick={ev => ev.stopPropagation()}>
        {suits.map((sym, i) => (
          <span key={i} className="suit-fall"
            style={{
              left: `${8 + i * 16}%`,
              top: 0,
              fontSize: `${16 + (i % 3) * 7}px`,
              color: i % 2 === 0 ? "rgba(212,175,55,0.55)" : "rgba(184,49,63,0.5)",
              animationDelay: `${i * 0.34}s`,
            }}>{sym}</span>
        ))}

        <div className="relative">
          <div className="flex justify-center mb-3">
            <Crown size={52} className="win-crown win-glow" style={{ color: "#F4CD5C" }} />
          </div>
          <div className="section-label win-rise">// winner</div>
          <div className="display-font text-5xl mt-1 win-rise-2" style={{ color: "#F5E9CF" }}>{name}</div>
          <div className="stat-num text-6xl mt-2 win-rise-2" style={{ color: "#F4CD5C" }}>{total}</div>
          <div className="mono-font text-[11px] mt-1 win-rise-3" style={{ color: "rgba(201,185,143,0.6)" }}>
            target was {target}
          </div>
          <div className="mono-font text-[10px] mt-5 uppercase tracking-[0.2em] win-rise-3" style={{ color: "rgba(201,185,143,0.45)" }}>
            game closed
          </div>
          <button onClick={onClose}
            className="btn-gold mono-font w-full py-3 rounded text-xs font-semibold uppercase tracking-[0.15em] mt-3 win-rise-3">
            done
          </button>
        </div>
      </div>
    </div>
  );
}

function GameView({ game, rooms, setGames, setView, setSelectedRoomId, players, handleErr }) {
  const [showRoundForm, setShowRoundForm] = useState(false);
  const [editingRoundId, setEditingRoundId] = useState(null);
  const [celebration, setCelebration] = useState(null);
  const totals = computeTotals(game);
  const sortedTeams = [...(game.teams || [])].sort((a, b) => (totals[b.id] || 0) - (totals[a.id] || 0));
  const leader = sortedTeams[0];
  const leaderTotal = leader ? (totals[leader.id] || 0) : 0;
  const reachedTarget = leaderTotal >= game.target_score;
  const room = rooms.find(r => r.id === game.room_id);

  function patchGame(updater) { setGames(prev => prev.map(g => g.id === game.id ? updater(g) : g)); }

  /* Who dealt a given round. Prefers what the round recorded, falling back to the
     rotation for rounds saved before this was tracked. */
  function dealInfo(roundNumber, meta) {
    const rot = rotationForRound(game, roundNumber);
    const dealerId = meta?.dealerId || rot?.shufflerId || null;
    const splitterId = meta?.splitterId || rot?.splitterId || null;
    return {
      dealer: dealerId ? players.find(p => p.id === dealerId) || null : null,
      splitter: splitterId ? players.find(p => p.id === splitterId) || null : null,
    };
  }

  /* Called after a round is saved. If someone has reached the target, close the
     game and celebrate. Deliberately only runs on a save, never on render, so
     reopening a game already past the target doesn't instantly re-close it. */
  async function closeIfWon(updatedGame) {
    if (updatedGame.finished_at) return;
    const totals = computeTotals(updatedGame);
    const ranked = [...(updatedGame.teams || [])].sort((a, b) => (totals[b.id] || 0) - (totals[a.id] || 0));
    const top = ranked[0];
    if (!top) return;
    const score = totals[top.id] || 0;
    if (score < updatedGame.target_score) return;

    setCelebration({ name: top.name, total: score, target: updatedGame.target_score });
    try {
      const r = await api.send("PATCH", `/api/games/${game.id}`, { finished_at: new Date().toISOString() });
      patchGame(g => ({ ...g, finished_at: r.game.finished_at }));
    } catch (e) { handleErr(e); }
  }

  async function addRound(roundData) {
    try {
      const r = await api.send("POST", `/api/games/${game.id}/rounds`, roundData);
      const updated = { ...game, rounds: [...(game.rounds || []), r.round] };
      patchGame(() => updated);
      setShowRoundForm(false);
      closeIfWon(updated);
    } catch (e) { handleErr(e); }
  }
  async function updateRound(roundId, roundData) {
    try {
      const r = await api.send("PATCH", `/api/games/${game.id}/rounds/${roundId}`, roundData);
      const updated = { ...game, rounds: (game.rounds || []).map(rr => rr.id === roundId ? r.round : rr) };
      patchGame(() => updated);
      setEditingRoundId(null);
      closeIfWon(updated);
    } catch (e) { handleErr(e); }
  }
  async function removeRound(rid) {
    try {
      await api.send("DELETE", `/api/games/${game.id}/rounds/${rid}`);
      patchGame(g => ({ ...g, rounds: (g.rounds || []).filter(r => r.id !== rid) }));
    } catch (e) { handleErr(e); }
  }
  async function finishGame() {
    try {
      const r = await api.send("PATCH", `/api/games/${game.id}`, { finished_at: new Date().toISOString() });
      patchGame(g => ({ ...g, finished_at: r.game.finished_at }));
      if (room) { setSelectedRoomId(room.id); setView("room"); } else setView("home");
    } catch (e) { handleErr(e); }
  }
  async function reopenGame() {
    try {
      await api.send("PATCH", `/api/games/${game.id}`, { finished_at: null });
      patchGame(g => ({ ...g, finished_at: null }));
    } catch (e) { handleErr(e); }
  }

  return (
    <div className="fade-up space-y-5">
      {celebration && (
        <WinOverlay name={celebration.name} total={celebration.total} target={celebration.target}
          onClose={() => setCelebration(null)} />
      )}
      {room && (
        <button onClick={() => { setSelectedRoomId(room.id); setView("room"); }} className="mono-font text-[11px] flex items-center gap-1.5 uppercase tracking-[0.15em]" style={{ color: "rgba(212,175,55,0.8)" }}>
          <ArrowLeft size={11} /> {room.name}
        </button>
      )}

      <div className="text-center">
        <div className="section-label">{game.finished_at ? "// final" : `// target ${game.target_score}`}</div>
        <h2 className="display-font text-5xl mt-2" style={{ color: "#F5E9CF" }}>{game.name}</h2>
      </div>

      <div className="surface-deeper rounded overflow-hidden">
        {sortedTeams.map((team, i) => {
          const total = totals[team.id] || 0;
          const pct = Math.min(100, (total / game.target_score) * 100);
          const isWinning = total >= game.target_score;
          const restriction = restrictionFor(total);
          const members = (team.member_ids || []).map(id => players.find(p => p.id === id)).filter(Boolean);
          return (
            <div key={team.id} className="px-5 py-4 border-b last:border-0" style={{ borderColor: "rgba(212,175,55,0.1)" }}>
              <div className="flex items-baseline justify-between mb-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  {i === 0 && total > 0 && (
                    <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0" style={{ background: "rgba(212,175,55,0.12)", border: "1px solid #D4AF37" }}>
                      <Crown size={12} style={{ color: "#F4CD5C" }} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="display-font text-3xl truncate" style={{ color: "#F5E9CF" }}>{team.name}</div>
                    {members.length > 0 && <div className="flex -space-x-1.5 mt-0.5">{members.map(m => <Avatar key={m.id} player={m} size={16} />)}</div>}
                    {restriction && (
                      <div className={`mono-font text-[10px] uppercase tracking-wider px-2 py-1 rounded font-semibold mt-1.5 inline-block ${restriction.pulse}`}
                        style={{ background: restriction.bg, color: restriction.color, border: `1px solid ${restriction.border}` }}>
                        {restriction.label}
                      </div>
                    )}
                  </div>
                </div>
                <span className="stat-num text-5xl flex-shrink-0 ml-2" style={isWinning ? { color: "#F4CD5C" } : { color: "#F5E9CF" }}>{total}</span>
              </div>
              <div className="h-1 rounded overflow-hidden progress-track">
                <div className={`h-full transition-all duration-700 ${isWinning ? "progress-fill-win" : "progress-fill"}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {!game.finished_at && (
        <>
          <RotationPanel game={game} roundNumber={(game.rounds?.length || 0) + 1} players={players} />

          {!showRoundForm && !editingRoundId ? (
            <button onClick={() => setShowRoundForm(true)} className="btn-gold mono-font w-full py-4 rounded text-sm font-semibold uppercase tracking-[0.18em]">
              <Plus size={15} className="inline mr-2" />record round {(game.rounds?.length || 0) + 1}
            </button>
          ) : showRoundForm ? (
            <RoundForm teams={game.teams} onCancel={() => setShowRoundForm(false)} onSubmit={addRound}
              roundNumber={(game.rounds?.length || 0) + 1}
              {...dealInfo((game.rounds?.length || 0) + 1, null)} />
          ) : null}
          {reachedTarget && (
            <button onClick={finishGame} className="btn-primary mono-font w-full py-3 rounded text-xs font-semibold uppercase tracking-[0.15em]">
              <Crown size={14} className="inline mr-2" style={{ color: "#F4CD5C" }} />finish · {leader?.name} wins
            </button>
          )}
        </>
      )}

      {game.finished_at && (
        <button onClick={reopenGame} className="btn-ghost mono-font w-full py-3 rounded text-xs font-semibold tracking-[0.18em] uppercase">reopen game</button>
      )}

      {(game.rounds?.length || 0) > 0 && (
        <div className="space-y-3">
          <div className="ornament-divider section-label"><span><span className="section-prefix">//</span> round log</span></div>
          <div className="space-y-2">
            {[...(game.rounds || [])].reverse().map((r, idx) => {
              const roundNum = game.rounds.length - idx;
              if (editingRoundId === r.id) {
                return <RoundForm key={r.id} teams={game.teams} initialScores={r.scores} initialMeta={r.meta}
                  {...dealInfo(roundNum, r.meta)}
                  onCancel={() => setEditingRoundId(null)} onSubmit={(data) => updateRound(r.id, data)} roundNumber={roundNum} editing />;
              }
              return (
                <div key={r.id} className="surface p-4 rounded">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="stat-num text-xl gold-text-bright">{roundNum}</div>
                      <div className="section-label">round {r.edited_at && <span style={{ color: "rgba(201,185,143,0.4)" }}>· edited</span>}</div>
                      {r.meta?.atouCard && <CardFace rank={r.meta.atouCard.rank} suit={r.meta.atouCard.suit} size="sm" />}
                      {(() => {
                        const { dealer, splitter } = dealInfo(roundNum, r.meta);
                        if (!dealer && !splitter) return null;
                        return (
                          <span className="mono-font text-[9px] uppercase tracking-wider" style={{ color: "rgba(201,185,143,0.5)" }}>
                            {dealer && <>{dealer.name} dealt</>}
                            {dealer && splitter && " · "}
                            {splitter && <>{splitter.name} split</>}
                          </span>
                        );
                      })()}
                    </div>
                    {!game.finished_at && (
                      <div className="flex items-center gap-1">
                        <button onClick={() => setEditingRoundId(r.id)} className="p-1.5" style={{ color: "rgba(212,175,55,0.7)" }}><Edit3 size={13} /></button>
                        <button onClick={() => { if (confirm("Delete this round?")) removeRound(r.id); }} className="p-1.5" style={{ color: "rgba(201,185,143,0.4)" }}><Trash2 size={13} /></button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {(game.teams || []).map(t => {
                      const s = r.scores?.[t.id];
                      const sum = roundTeamTotal(s);
                      const b = biribaPoints(s), bonus = bonusPoints(s), hand = handPoints(s), deck = deckPoints(s);
                      return (
                        <div key={t.id} className="flex items-start justify-between text-sm gap-2">
                          <span className="display-font text-xl truncate flex-shrink min-w-0" style={{ color: "rgba(245,233,207,0.95)" }}>{t.name}</span>
                          <div className="flex items-center gap-1.5 mono-font text-[11px] flex-shrink-0 flex-wrap justify-end">
                            {b !== 0 && <ScoreChip label="B" value={b} variant="emerald" />}
                            {bonus !== 0 && <ScoreChip label="O" value={bonus} variant="cream" />}
                            {hand !== 0 && <ScoreChip label="H" value={hand} variant="rose" />}
                            {deck !== 0 && <ScoreChip label="D" value={deck} variant="gold" />}
                            {b === 0 && bonus === 0 && hand === 0 && deck === 0 && (
                              <span style={{ color: "rgba(201,185,143,0.35)" }}>—</span>
                            )}
                            <span className="stat-num text-xl ml-1" style={{ color: sum < 0 ? "#FB7185" : "#F5E9CF", minWidth: 44, textAlign: "right" }}>{sum}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreChip({ label, value, variant }) {
  const variants = {
    emerald: { bg: "rgba(34,197,94,0.12)", text: "#86EFAC", border: "rgba(34,197,94,0.3)" },
    cream: { bg: "rgba(245,233,207,0.08)", text: "#F5E9CF", border: "rgba(245,233,207,0.2)" },
    gold: { bg: "rgba(212,175,55,0.12)", text: "#F4CD5C", border: "rgba(212,175,55,0.35)" },
    rose: { bg: "rgba(122,31,43,0.2)", text: "#FB7185", border: "rgba(184,49,63,0.45)" },
  };
  const c = variants[variant];
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm tabular-nums font-medium" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      <span className="opacity-70 font-semibold">{label}</span><span>{value}</span>
    </span>
  );
}

/* ============ ROUND FORM ============ */
function blankEntry() {
  return { dirtyBiriba: 0, cleanBiriba: 0, atouDirty: 0, atouClean: 0, fullDeckBiriba: 0,
           noBiribaki: false, handPoints: "", deckPoints: "" };
}

/** Turn a stored score entry into editable form state. */
function entryFromScore(init) {
  if (!init) return blankEntry();
  if (isLegacyScore(init)) {
    // Old rounds only kept three totals, so surface them as deck/hand numbers
    // rather than guessing how many biribas they represented.
    return {
      dirtyBiriba: 0, cleanBiriba: 0, atouDirty: 0, atouClean: 0, fullDeckBiriba: 0,
      noBiribaki: (init.outcome || 0) < 0,
      handPoints: "", deckPoints: String((init.biriba || 0) + (init.deck || 0)),
    };
  }
  return {
    dirtyBiriba: init.dirtyBiriba || 0,
    cleanBiriba: init.cleanBiriba || 0,
    atouDirty: init.atouDirty || 0,
    atouClean: init.atouClean || 0,
    fullDeckBiriba: init.fullDeckBiriba || 0,
    noBiribaki: !!init.noBiribaki,
    handPoints: init.handPoints ? String(Math.abs(init.handPoints)) : "",
    deckPoints: init.deckPoints ? String(init.deckPoints) : "",
  };
}

function CountTile({ label, points, value, onChange }) {
  const active = value > 0;
  return (
    <div className="rounded p-2 flex flex-col items-center gap-1.5"
      style={{
        background: active ? "rgba(34,197,94,0.10)" : "rgba(10,40,24,0.45)",
        border: `1px solid ${active ? "rgba(212,175,55,0.5)" : "rgba(212,175,55,0.16)"}`,
      }}>
      <div className="text-center leading-tight">
        <div className="ui-font text-[11px] font-medium whitespace-nowrap" style={{ color: "#F5E9CF" }}>{label}</div>
        <div className="mono-font text-[9px]" style={{ color: "rgba(201,185,143,0.45)" }}>{points}</div>
      </div>
      <div className="flex items-center justify-between gap-1 w-full">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))} disabled={value === 0}
          className="btn-ghost w-8 h-8 rounded flex items-center justify-center flex-shrink-0" aria-label={`one fewer ${label}`}>
          <Minus size={13} />
        </button>
        <span className="stat-num text-xl" style={{ color: active ? "#F4CD5C" : "rgba(201,185,143,0.3)" }}>{value}</span>
        <button type="button" onClick={() => onChange(value + 1)}
          className="btn-gold w-8 h-8 rounded flex items-center justify-center flex-shrink-0" aria-label={`one more ${label}`}>
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}

/* Header for a biriba group, with that group's running subtotal. */
function GroupLabel({ name, subtotal }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="section-label"><span className="section-prefix">//</span> {name}</span>
      {subtotal > 0 && <span className="stat-num text-sm" style={{ color: "#86EFAC" }}>+{subtotal}</span>}
    </div>
  );
}

function RoundForm({ teams, onCancel, onSubmit, roundNumber, initialScores, initialMeta, dealer, splitter, editing }) {
  const list = teams || [];
  const [entries, setEntries] = useState(() => {
    const init = {};
    list.forEach(t => { init[t.id] = entryFromScore(initialScores?.[t.id]); });
    return init;
  });
  // The atou is chosen per round, as the hand is dealt.
  const [atouRank, setAtouRank] = useState(initialMeta?.atouCard?.rank || null);
  const [atouSuit, setAtouSuit] = useState(initialMeta?.atouCard?.suit || null);
  // Only one team goes out first; null means nobody did.
  const [outFirstId, setOutFirstId] = useState(() => {
    const found = list.find(t => initialScores?.[t.id]?.outFirst);
    return found ? found.id : null;
  });

  function set(teamId, field, value) {
    setEntries(prev => ({ ...prev, [teamId]: { ...prev[teamId], [field]: value } }));
  }

  function chooseOutFirst(teamId) {
    setOutFirstId(teamId);
    // Clear a penalty that was ticked before this team was marked out first.
    if (teamId) set(teamId, "noBiribaki", false);
  }

  function buildScore(teamId) {
    const e = entries[teamId] || blankEntry();
    const hand = Math.abs(Number(e.handPoints) || 0);
    const wentOut = outFirstId === teamId;
    return {
      dirtyBiriba: e.dirtyBiriba || 0,
      cleanBiriba: e.cleanBiriba || 0,
      atouDirty: e.atouDirty || 0,
      atouClean: e.atouClean || 0,
      fullDeckBiriba: e.fullDeckBiriba || 0,
      outFirst: wentOut,
      // Going out first rules out the no-biribáki penalty.
      noBiribaki: wentOut ? false : !!e.noBiribaki,
      handPoints: hand === 0 ? 0 : -hand,
      deckPoints: Number(e.deckPoints) || 0,
    };
  }

  function submit() {
    const cleaned = {};
    list.forEach(t => { cleaned[t.id] = buildScore(t.id); });
    const meta = {};
    if (atouRank && atouSuit) meta.atouCard = { rank: atouRank, suit: atouSuit };
    // Store who dealt and who split so the round keeps its own record, even if
    // the seating is edited later.
    if (dealer?.id) meta.dealerId = dealer.id;
    if (splitter?.id) meta.splitterId = splitter.id;
    onSubmit({ scores: cleaned, meta });
  }

  return (
    <div className="surface-deeper rounded p-5 space-y-5 fade-up">
      <div className="text-center">
        <div className="section-label">// round {roundNumber}</div>
        <div className="display-font text-3xl mt-1" style={{ color: "#F5E9CF" }}>{editing ? "edit scores" : "enter scores"}</div>
      </div>

      {(dealer || splitter) && (
        <div className="flex items-center justify-center gap-2 flex-wrap mono-font text-[10px] uppercase tracking-[0.14em]">
          {dealer && (
            <span className="flex items-center gap-1.5" style={{ color: "rgba(201,185,143,0.75)" }}>
              <Avatar player={dealer} size={18} />{dealer.name}
              <span style={{ color: "#F4CD5C" }}>dealt</span>
            </span>
          )}
          {dealer && splitter && <span style={{ color: "rgba(212,175,55,0.4)" }}>·</span>}
          {splitter && (
            <span className="flex items-center gap-1.5" style={{ color: "rgba(201,185,143,0.75)" }}>
              <Avatar player={splitter} size={18} />{splitter.name}
              <span style={{ color: "rgba(201,185,143,0.9)" }}>split</span>
            </span>
          )}
        </div>
      )}

      <AtouPicker rank={atouRank} suit={atouSuit}
        onChange={(r, su) => { setAtouRank(r); setAtouSuit(su); }} />

      {/* Out-first is a round-level choice, so it lives outside the team cards */}
      <div className="space-y-2">
        <div className="section-label"><span className="section-prefix">//</span> who went out first? +{SCORING.OUT_FIRST}</div>
        <div className="flex flex-wrap gap-2">
          {list.map(t => (
            <button key={t.id} type="button" onClick={() => chooseOutFirst(t.id)}
              className={`ui-font text-xs px-3 py-2 rounded font-medium ${outFirstId === t.id ? "chip-active" : "chip"}`}>
              {t.name}{outFirstId === t.id && <Check size={11} className="inline ml-1.5" />}
            </button>
          ))}
          <button type="button" onClick={() => chooseOutFirst(null)}
            className={`ui-font text-xs px-3 py-2 rounded font-medium ${outFirstId === null ? "chip-active" : "chip"}`}>
            nobody
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {list.map(t => {
          const e = entries[t.id] || blankEntry();
          const preview = buildScore(t.id);
          const total = roundTeamTotal(preview);
          const atouTotal = (e.atouDirty || 0) * SCORING.ATOU_DIRTY + (e.atouClean || 0) * SCORING.ATOU_CLEAN;
          const normalTotal = (e.dirtyBiriba || 0) * SCORING.DIRTY_BIRIBA
                            + (e.cleanBiriba || 0) * SCORING.CLEAN_BIRIBA
                            + (e.fullDeckBiriba || 0) * SCORING.FULL_DECK_BIRIBA;
          return (
            <div key={t.id} className="surface rounded p-4 space-y-3">
              <div className="flex items-baseline justify-between gap-2">
                <span className="display-font text-2xl truncate" style={{ color: "#F5E9CF" }}>{t.name}</span>
                <span className="stat-num text-3xl flex-shrink-0" style={{ color: total < 0 ? "#FB7185" : "#F4CD5C" }}>
                  {total > 0 ? "+" : ""}{total}
                </span>
              </div>

              <div className="space-y-3 pt-1">
                <div className="space-y-1.5">
                  <GroupLabel name="atou" subtotal={atouTotal} />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    <CountTile label="dirty" points={SCORING.ATOU_DIRTY} value={e.atouDirty} onChange={v => set(t.id, "atouDirty", v)} />
                    <CountTile label="clean" points={SCORING.ATOU_CLEAN} value={e.atouClean} onChange={v => set(t.id, "atouClean", v)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <GroupLabel name="normal" subtotal={normalTotal} />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    <CountTile label="dirty" points={SCORING.DIRTY_BIRIBA} value={e.dirtyBiriba} onChange={v => set(t.id, "dirtyBiriba", v)} />
                    <CountTile label="clean" points={SCORING.CLEAN_BIRIBA} value={e.cleanBiriba} onChange={v => set(t.id, "cleanBiriba", v)} />
                    <CountTile label="full deck" points={SCORING.FULL_DECK_BIRIBA} value={e.fullDeckBiriba} onChange={v => set(t.id, "fullDeckBiriba", v)} />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {outFirstId === t.id && (
                  <span className="mono-font text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded font-medium"
                    style={{ background: "rgba(212,175,55,0.12)", color: "#F4CD5C", border: "1px solid #D4AF37" }}>
                    out first +{SCORING.OUT_FIRST}
                  </span>
                )}
                {outFirstId !== t.id && (
                <button type="button" onClick={() => set(t.id, "noBiribaki", !e.noBiribaki)}
                  className={`mono-font text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded font-medium ${e.noBiribaki ? "" : "chip"}`}
                  style={e.noBiribaki ? { background: "rgba(122,31,43,0.25)", color: "#FB7185", border: "1px solid rgba(184,49,63,0.6)" } : undefined}>
                  {e.noBiribaki && <Check size={10} className="inline mr-1" />}no biribáki {SCORING.NO_BIRIBAKI}
                </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="space-y-1.5">
                  <div className="section-label">cards in hand</div>
                  <input type="number" inputMode="numeric" value={e.handPoints}
                    onChange={ev => set(t.id, "handPoints", ev.target.value)} placeholder="0"
                    className="input-field w-full px-3 py-2.5 rounded text-base text-center" />
                  <div className="mono-font text-[10px] text-center" style={{ color: e.handPoints ? "#FB7185" : "rgba(201,185,143,0.4)" }}>
                    {e.handPoints ? `counts as ${-Math.abs(Number(e.handPoints) || 0)}` : "always negative"}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="section-label">deck count</div>
                  <input type="number" inputMode="numeric" value={e.deckPoints}
                    onChange={ev => set(t.id, "deckPoints", ev.target.value)} placeholder="0"
                    className="input-field w-full px-3 py-2.5 rounded text-base text-center" />
                  <div className="mono-font text-[10px] text-center" style={{ color: "rgba(201,185,143,0.4)" }}>
                    card counting
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="btn-ghost mono-font flex-1 py-3 rounded text-xs font-medium uppercase tracking-wider">cancel</button>
        <button onClick={submit} className="btn-gold mono-font flex-1 py-3 rounded text-xs font-semibold uppercase tracking-[0.15em]">{editing ? "save changes" : "save round"}</button>
      </div>
    </div>
  );
}

/* ============ GAME DETAIL ============ */
function GameDetailView({ game, rooms, players, setView, setCurrentGameId, setSelectedRoomId }) {
  if (!game) return <EmptyState text="Game not found." />;
  const totals = computeTotals(game);
  const sortedTeams = [...(game.teams || [])].sort((a, b) => (totals[b.id] || 0) - (totals[a.id] || 0));
  const winner = sortedTeams[0];
  const room = rooms.find(r => r.id === game.room_id);
  return (
    <div className="fade-up space-y-5">
      {room && (
        <button onClick={() => { setSelectedRoomId(room.id); setView("room"); }} className="mono-font text-[11px] flex items-center gap-1.5 uppercase tracking-[0.15em]" style={{ color: "rgba(212,175,55,0.8)" }}>
          <ArrowLeft size={11} /> {room.name}
        </button>
      )}
      <div className="text-center">
        <div className="section-label">// {formatDate(game.created_at)}</div>
        <h2 className="display-font text-5xl mt-2" style={{ color: "#F5E9CF" }}>{game.name}</h2>
        {winner && (
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded" style={{ background: "rgba(212,175,55,0.12)", border: "1px solid #D4AF37" }}>
            <Crown size={14} style={{ color: "#F4CD5C" }} />
            <span className="display-font text-xl" style={{ color: "#F5E9CF" }}>{winner.name}</span>
            <span className="stat-num text-lg" style={{ color: "rgba(245,233,207,0.7)" }}>· {totals[winner.id] || 0}</span>
          </div>
        )}
      </div>
      <div className="surface rounded overflow-hidden">
        {sortedTeams.map((team, i) => {
          const members = (team.member_ids || []).map(id => players.find(p => p.id === id)).filter(Boolean);
          return (
            <div key={team.id} className="px-5 py-3.5 flex items-center justify-between border-b last:border-0" style={{ borderColor: "rgba(212,175,55,0.1)" }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="stat-num text-2xl w-6 flex-shrink-0" style={{ color: "rgba(201,185,143,0.4)" }}>{i + 1}</div>
                <div className="min-w-0">
                  <div className="display-font text-2xl truncate" style={{ color: "#F5E9CF" }}>{team.name}</div>
                  {members.length > 0 && <div className="flex -space-x-1.5 mt-0.5">{members.map(m => <Avatar key={m.id} player={m} size={16} />)}</div>}
                </div>
              </div>
              <span className="stat-num text-3xl flex-shrink-0" style={{ color: "#F5E9CF" }}>{totals[team.id] || 0}</span>
            </div>
          );
        })}
      </div>
      <button onClick={() => { setCurrentGameId(game.id); setView("game"); }} className="btn-ghost mono-font w-full py-3 rounded text-xs font-medium uppercase tracking-[0.15em]">
        view round-by-round →
      </button>
    </div>
  );
}

/* ============ ROSTER ============ */
function RosterView({ initialTab = "players", players, teams, setPlayers, setTeams, setSelectedPlayerId, setSelectedTeamId, setView, handleErr }) {
  const [tab, setTab] = useState(initialTab);
  const [newPlayer, setNewPlayer] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamMembers, setNewTeamMembers] = useState([]);
  const fileInputRef = useRef(null);
  const [uploadingForId, setUploadingForId] = useState(null);

  async function addPlayer() {
    const name = newPlayer.trim();
    if (!name) return;
    if (players.some(p => p.name.toLowerCase() === name.toLowerCase())) return;
    try {
      const r = await api.send("POST", "/api/players", { name });
      setPlayers([...players, r.player]);
      setNewPlayer("");
    } catch (e) { handleErr(e); }
  }
  async function removePlayer(id) {
    try {
      await api.send("DELETE", `/api/players/${id}`);
      setPlayers(players.filter(p => p.id !== id));
      setTeams(teams.map(t => ({ ...t, member_ids: (t.member_ids || []).filter(m => m !== id) })));
    } catch (e) { handleErr(e); }
  }
  async function addTeam() {
    const name = newTeamName.trim();
    if (!name || newTeamMembers.length === 0) return;
    try {
      const r = await api.send("POST", "/api/teams", { name, member_ids: newTeamMembers });
      setTeams([...teams, r.team]);
      setNewTeamName(""); setNewTeamMembers([]);
    } catch (e) { handleErr(e); }
  }
  async function removeTeam(id) {
    try {
      await api.send("DELETE", `/api/teams/${id}`);
      setTeams(teams.filter(t => t.id !== id));
    } catch (e) { handleErr(e); }
  }
  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file || !uploadingForId) return;
    try {
      const compressed = await compressImage(file);
      const r = await api.send("PATCH", `/api/players/${uploadingForId}`, { photo: compressed });
      setPlayers(players.map(p => p.id === uploadingForId ? r.player : p));
    } catch (err) { handleErr(err); }
    finally {
      setUploadingForId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }
  function triggerPhotoUpload(playerId) {
    setUploadingForId(playerId);
    setTimeout(() => fileInputRef.current?.click(), 0);
  }
  async function removePhoto(playerId) {
    try {
      const r = await api.send("PATCH", `/api/players/${playerId}`, { photo: null });
      setPlayers(players.map(p => p.id === playerId ? r.player : p));
    } catch (e) { handleErr(e); }
  }

  return (
    <div className="fade-up space-y-4">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
      <div className="tab-bar flex gap-1 p-1 rounded">
        <button onClick={() => setTab("players")} className={`flex-1 py-2 mono-font text-xs font-medium tracking-[0.15em] uppercase rounded transition ${tab === "players" ? "tab-active" : "tab-inactive"}`}>players</button>
        <button onClick={() => setTab("teams")} className={`flex-1 py-2 mono-font text-xs font-medium tracking-[0.15em] uppercase rounded transition ${tab === "teams" ? "tab-active" : "tab-inactive"}`}>teams</button>
      </div>

      {tab === "players" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input value={newPlayer} onChange={e => setNewPlayer(e.target.value)} onKeyDown={e => e.key === "Enter" && addPlayer()} placeholder="add a player..." className="input-field flex-1 px-4 py-3 rounded text-sm" />
            <button onClick={addPlayer} className="btn-gold px-4 rounded"><Plus size={18} /></button>
          </div>
          <div className="space-y-2">
            {players.length === 0 && <EmptyState text="No players yet. Add the first one above." />}
            {players.map((p, i) => (
              <div key={p.id} className="surface p-3 rounded flex items-center justify-between fade-up" style={{ animationDelay: `${i * 30}ms` }}>
                <button onClick={() => { setSelectedPlayerId(p.id); setView("playerStats"); }} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                  <Avatar player={p} size={42} />
                  <div className="min-w-0 flex-1">
                    <div className="display-font text-2xl truncate" style={{ color: "#F5E9CF" }}>{p.name}</div>
                    <div className="mono-font text-[10px] mt-0.5 font-medium" style={{ color: "rgba(201,185,143,0.5)" }}>view stats →</div>
                  </div>
                </button>
                <div className="flex items-center gap-1">
                  {p.photo && <button onClick={() => removePhoto(p.id)} title="Remove photo" className="p-2" style={{ color: "rgba(201,185,143,0.5)" }}><X size={14} /></button>}
                  <button onClick={() => triggerPhotoUpload(p.id)} title="Add photo" className="p-2" style={{ color: "#D4AF37", opacity: 0.7 }}><Camera size={15} /></button>
                  <button onClick={() => removePlayer(p.id)} className="p-2" style={{ color: "rgba(201,185,143,0.4)" }}><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "teams" && (
        <div className="space-y-4">
          <div className="surface rounded p-4 space-y-3">
            <input value={newTeamName} onChange={e => setNewTeamName(e.target.value)} placeholder="team name..." className="input-field w-full px-4 py-3 rounded text-sm" />
            <div className="space-y-2">
              <div className="section-label">select members</div>
              {players.length === 0 && <div className="mono-font text-xs italic" style={{ color: "rgba(201,185,143,0.5)" }}>add players first.</div>}
              <div className="flex flex-wrap gap-2">
                {players.map(p => {
                  const sel = newTeamMembers.includes(p.id);
                  return (
                    <button key={p.id} onClick={() => setNewTeamMembers(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])} className={`ui-font text-xs px-2.5 py-1.5 rounded-full transition flex items-center gap-1.5 font-medium ${sel ? "chip-active" : "chip"}`}>
                      <Avatar player={p} size={20} />{p.name}{sel && <Check size={11} />}
                    </button>
                  );
                })}
              </div>
            </div>
            <button onClick={addTeam} disabled={!newTeamName.trim() || newTeamMembers.length === 0} className="btn-primary mono-font w-full py-3 rounded text-xs font-semibold uppercase tracking-[0.15em]">create team</button>
          </div>
          <div className="space-y-2">
            {teams.length === 0 && <EmptyState text="No saved teams yet." />}
            {teams.map((t, i) => {
              const members = (t.member_ids || []).map(id => players.find(p => p.id === id)).filter(Boolean);
              return (
                <div key={t.id} className="surface p-4 rounded flex items-center justify-between fade-up" style={{ animationDelay: `${i * 30}ms` }}>
                  <button onClick={() => { setSelectedTeamId(t.id); setView("teamStats"); }} className="min-w-0 flex-1 text-left">
                    <div className="display-font text-2xl truncate" style={{ color: "#F5E9CF" }}>{t.name}</div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {members.length > 0 ? (
                        <>
                          <div className="flex -space-x-2">{members.map(m => <Avatar key={m.id} player={m} size={22} />)}</div>
                          <span className="mono-font text-xs ml-1.5 truncate font-medium" style={{ color: "rgba(201,185,143,0.65)" }}>{members.map(m => m.name).join(" · ")}</span>
                        </>
                      ) : <span className="mono-font text-xs" style={{ color: "rgba(201,185,143,0.4)" }}>—</span>}
                    </div>
                    <div className="mono-font text-[10px] mt-1 font-medium" style={{ color: "rgba(201,185,143,0.4)" }}>view stats →</div>
                  </button>
                  <button onClick={() => removeTeam(t.id)} className="p-2" style={{ color: "rgba(201,185,143,0.4)" }}><Trash2 size={15} /></button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ PLAYER STATS ============ */
function PlayerStatsView({ player, teams, games, rooms, setSelectedGameId, setCurrentGameId, setView }) {
  if (!player) return <EmptyState text="Player not found." />;
  const log = buildPlayerGameLog(player, games, teams);
  const finishedLog = log.filter(l => l.isFinished);
  const summary = summarizeLog(log);
  const ranks = computePlayerStandings(games, teams);
  const myRank = ranks.findIndex(r => r.playerId === player.id) + 1;
  const totalRanked = ranks.length;

  // Room breakdown — which rooms has this player played in
  const byRoom = {};
  for (const l of finishedLog) {
    const key = l.roomId || "__none";
    if (!byRoom[key]) byRoom[key] = { roomId: l.roomId, wins: 0, plays: 0 };
    byRoom[key].plays += 1;
    if (l.won) byRoom[key].wins += 1;
  }
  const roomBreakdown = Object.values(byRoom).sort((a, b) => b.plays - a.plays);

  return (
    <div className="fade-up space-y-5">
      <div className="surface rounded p-5 text-center space-y-3">
        <div className="flex justify-center"><Avatar player={player} size={88} /></div>
        <div>
          <div className="display-font text-5xl" style={{ color: "#F5E9CF" }}>{player.name}</div>
          <div className="mono-font text-[10px] mt-2 uppercase tracking-[0.3em] flex items-center justify-center gap-2 flex-wrap" style={{ color: "rgba(201,185,143,0.6)" }}>
            <span>{summary.gamesPlayed} {summary.gamesPlayed === 1 ? "game" : "games"}</span>
            {myRank > 0 && (<><span style={{ color: "#D4AF37" }}>·</span><span style={{ color: "#F4CD5C" }}>rank #{myRank}</span><span style={{ opacity: 0.5 }}>of {totalRanked}</span></>)}
          </div>
        </div>
        {summary.currentStreak.count > 1 && (
          <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded" style={{ background: summary.currentStreak.type === "win" ? "rgba(212,175,55,0.12)" : "rgba(245,233,207,0.06)", border: `1px solid ${summary.currentStreak.type === "win" ? "#D4AF37" : "rgba(245,233,207,0.2)"}` }}>
            <Zap size={12} style={{ color: summary.currentStreak.type === "win" ? "#F4CD5C" : "rgba(201,185,143,0.6)" }} />
            <span className="mono-font text-[11px] uppercase tracking-wider font-medium" style={{ color: summary.currentStreak.type === "win" ? "#F4CD5C" : "rgba(201,185,143,0.7)" }}>
              {summary.currentStreak.count} game {summary.currentStreak.type} streak
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatTile label="wins" value={summary.wins} sub={`/ ${summary.finishedCount} played`} highlight />
        <StatTile label="win rate" value={`${summary.winRate}%`} sub={`${summary.wins} W · ${summary.losses} L`} />
        <StatTile label="avg / game" value={summary.avgPerGame.toLocaleString()} sub={`${summary.totalPoints.toLocaleString()} total`} />
        <StatTile label="best game" value={summary.bestGame.toLocaleString()} sub="all-time high" />
      </div>

      {finishedLog.length >= 2 && (
        <div className="surface rounded p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="section-label flex items-center gap-2"><TrendingUp size={11} /> score trend</div>
            <div className="mono-font text-[10px]" style={{ color: "rgba(201,185,143,0.5)" }}>last {finishedLog.length} games</div>
          </div>
          <TrendChart data={finishedLog} accentColor="#D4AF37" />
          <ChartLegend />
        </div>
      )}

      {finishedLog.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          <div className="surface rounded p-4 space-y-3">
            <div className="section-label">recent rhythm</div>
            <WinLossRhythm data={finishedLog} recent={12} />
            <div className="mono-font text-[10px] uppercase tracking-wider flex justify-between" style={{ color: "rgba(201,185,143,0.5)" }}>
              <span>oldest</span><span>newest</span>
            </div>
          </div>
          <div className="surface rounded p-4 space-y-2.5">
            <div className="section-label">records</div>
            <div className="flex items-center justify-between">
              <span className="mono-font text-[11px]" style={{ color: "rgba(201,185,143,0.7)" }}>worst game</span>
              <span className="stat-num text-lg" style={{ color: "#F5E9CF" }}>{summary.worstGame.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="mono-font text-[11px]" style={{ color: "rgba(201,185,143,0.7)" }}>best streak</span>
              <span className="stat-num text-lg" style={{ color: "#F5E9CF" }}>{summary.longestWinStreak} <span className="mono-font text-[10px]" style={{ color: "rgba(201,185,143,0.5)" }}>wins</span></span>
            </div>
          </div>
        </div>
      )}

      {roomBreakdown.length > 1 && (
        <div className="space-y-3">
          <div className="ornament-divider section-label"><span><span className="section-prefix">//</span> by room</span></div>
          <div className="surface rounded overflow-hidden">
            {roomBreakdown.map((b, i) => {
              const room = rooms.find(r => r.id === b.roomId);
              const rate = b.plays > 0 ? Math.round((b.wins / b.plays) * 100) : 0;
              return (
                <div key={i} className="px-4 py-3 flex items-center justify-between border-b last:border-0" style={{ borderColor: "rgba(212,175,55,0.1)" }}>
                  <div className="min-w-0 flex-1">
                    <div className="display-font text-lg truncate" style={{ color: "#F5E9CF" }}>{room?.name || "No room"}</div>
                    {room?.location && <div className="mono-font text-[10px]" style={{ color: "rgba(201,185,143,0.5)" }}>{room.location}</div>}
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="stat-num text-lg" style={{ color: "#F5E9CF" }}>{b.wins}<span className="mono-font text-[11px] ml-1" style={{ color: "rgba(201,185,143,0.5)" }}>/ {b.plays}</span></div>
                    <div className="mono-font text-[10px]" style={{ color: "rgba(201,185,143,0.5)" }}>{rate}% rate</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {log.length > 0 && (
        <div className="space-y-3">
          <div className="ornament-divider section-label"><span><span className="section-prefix">//</span> game history</span></div>
          <div className="space-y-2">
            {[...log].reverse().map(l => {
              const room = rooms.find(r => r.id === l.roomId);
              return (
                <button key={l.gameId} onClick={() => {
                  if (l.isFinished) { setSelectedGameId(l.gameId); setView("gameDetail"); }
                  else { setCurrentGameId(l.gameId); setView("game"); }
                }} className="surface w-full p-3.5 rounded text-left flex items-center justify-between hover:border-yellow-600/40 transition">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex-shrink-0 w-9 h-9 rounded flex items-center justify-center mono-font text-xs font-semibold uppercase tracking-wider" style={!l.isFinished ? { background: "rgba(34,197,94,0.12)", color: "#86EFAC", border: "1px solid rgba(34,197,94,0.3)" } : l.won ? { background: "rgba(212,175,55,0.15)", color: "#F4CD5C", border: "1px solid #D4AF37" } : { background: "rgba(15,61,36,0.5)", color: "rgba(201,185,143,0.6)", border: "1px solid rgba(212,175,55,0.15)" }}>
                      {!l.isFinished ? "..." : l.won ? "W" : "L"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="display-font text-lg truncate" style={{ color: "#F5E9CF" }}>{l.gameName}</div>
                      <div className="mono-font text-[10px] mt-0.5 truncate" style={{ color: "rgba(201,185,143,0.6)" }}>
                        {room ? `${room.name} · ` : ""}{formatShortDate(l.created_at)} · {l.teamName}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="stat-num text-xl" style={{ color: l.isFinished && l.won ? "#F4CD5C" : "#F5E9CF" }}>{l.score.toLocaleString()}</div>
                    {l.opponent && <div className="mono-font text-[10px]" style={{ color: "rgba(201,185,143,0.5)" }}>vs {l.opponentScore.toLocaleString()}</div>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {log.length === 0 && <EmptyState text="No games yet for this player." />}
    </div>
  );
}

/* ============ TEAM STATS ============ */
function TeamStatsView({ team, games, rooms, players, setSelectedGameId, setCurrentGameId, setView }) {
  if (!team) return <EmptyState text="Team not found." />;
  const log = buildTeamGameLog(team.id, games);
  const finishedLog = log.filter(l => l.isFinished);
  const summary = summarizeLog(log);
  const members = (team.member_ids || []).map(id => players.find(p => p.id === id)).filter(Boolean);
  const standings = computeTeamStandings(games);
  const myRank = standings.findIndex(s => s.teamId === team.id) + 1;
  const totalRanked = standings.length;

  const h2h = {};
  for (const l of finishedLog) {
    if (!l.opponentId) continue;
    if (!h2h[l.opponentId]) h2h[l.opponentId] = { name: l.opponent, wins: 0, losses: 0 };
    if (l.won) h2h[l.opponentId].wins += 1; else h2h[l.opponentId].losses += 1;
  }
  const h2hList = Object.values(h2h).sort((a, b) => (b.wins + b.losses) - (a.wins + a.losses));

  return (
    <div className="fade-up space-y-5">
      <div className="surface rounded p-5 text-center space-y-3">
        {members.length > 0 && <div className="flex justify-center -space-x-3">{members.map(m => <Avatar key={m.id} player={m} size={64} />)}</div>}
        <div>
          <div className="display-font text-5xl" style={{ color: "#F5E9CF" }}>{team.name}</div>
          <div className="mono-font text-[10px] mt-2 uppercase tracking-[0.3em] flex items-center justify-center gap-2 flex-wrap" style={{ color: "rgba(201,185,143,0.6)" }}>
            {members.length > 0 ? <span>{members.map(m => m.name).join(" · ")}</span> : <span style={{ opacity: 0.5 }}>no members</span>}
            {myRank > 0 && (<><span style={{ color: "#D4AF37" }}>·</span><span style={{ color: "#F4CD5C" }}>rank #{myRank}</span><span style={{ opacity: 0.5 }}>of {totalRanked}</span></>)}
          </div>
        </div>
        {myRank === 1 && summary.finishedCount > 0 && (
          <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded" style={{ background: "rgba(212,175,55,0.15)", border: "1px solid #D4AF37" }}>
            <Crown size={12} style={{ color: "#F4CD5C" }} />
            <span className="mono-font text-[11px] uppercase tracking-wider font-medium" style={{ color: "#F4CD5C" }}>current leaders</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatTile label="wins" value={summary.wins} sub={`/ ${summary.finishedCount} played`} highlight />
        <StatTile label="win rate" value={`${summary.winRate}%`} sub={`${summary.wins} W · ${summary.losses} L`} />
        <StatTile label="avg / game" value={summary.avgPerGame.toLocaleString()} sub={`${summary.totalPoints.toLocaleString()} total`} />
        <StatTile label="best game" value={summary.bestGame.toLocaleString()} sub="all-time high" />
      </div>

      {finishedLog.length >= 2 && (
        <div className="surface rounded p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="section-label flex items-center gap-2"><TrendingUp size={11} /> team performance</div>
            <div className="mono-font text-[10px]" style={{ color: "rgba(201,185,143,0.5)" }}>last {finishedLog.length} games</div>
          </div>
          <TrendChart data={finishedLog} accentColor="#22C55E" />
          <ChartLegend />
        </div>
      )}

      {h2hList.length > 0 && (
        <div className="space-y-3">
          <div className="ornament-divider section-label"><span><span className="section-prefix">//</span> head to head</span></div>
          <div className="space-y-2">
            {h2hList.map((r, i) => {
              const total = r.wins + r.losses;
              const winPct = (r.wins / total) * 100;
              return (
                <div key={i} className="surface p-3.5 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="display-font text-lg" style={{ color: "#F5E9CF" }}>vs {r.name}</div>
                    <div className="mono-font text-xs" style={{ color: "rgba(201,185,143,0.65)" }}>
                      <span className="gold-text-bright font-semibold">{r.wins}</span><span className="opacity-50"> – </span><span style={{ color: "#F5E9CF" }}>{r.losses}</span>
                    </div>
                  </div>
                  <div className="flex h-1.5 rounded overflow-hidden" style={{ background: "rgba(10,40,24,0.6)", border: "1px solid rgba(212,175,55,0.12)" }}>
                    <div style={{ width: `${winPct}%`, background: "linear-gradient(90deg, #D4AF37, #F4CD5C)" }} />
                    <div style={{ width: `${100 - winPct}%`, background: "rgba(245,233,207,0.18)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {summary.currentStreak.count > 1 && (
        <div className="surface rounded p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="section-label">current streak</div>
            <div className="display-font text-2xl" style={{ color: summary.currentStreak.type === "win" ? "#F4CD5C" : "#F5E9CF" }}>
              {summary.currentStreak.count} {summary.currentStreak.count === 1 ? "game" : "games"} {summary.currentStreak.type === "win" ? "won" : "lost"}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: summary.currentStreak.type === "win" ? "rgba(212,175,55,0.15)" : "rgba(245,233,207,0.06)", border: `1px solid ${summary.currentStreak.type === "win" ? "#D4AF37" : "rgba(245,233,207,0.2)"}` }}>
            <Zap size={20} style={{ color: summary.currentStreak.type === "win" ? "#F4CD5C" : "rgba(201,185,143,0.5)" }} />
          </div>
        </div>
      )}

      {log.length === 0 && <EmptyState text="No games yet for this team." />}
    </div>
  );
}

/* ============ HISTORY ============ */
function HistoryView({ players, teams, rooms, games, setView, setSelectedGameId, setCurrentGameId, setSelectedPlayerId, setSelectedTeamId, setSelectedRoomId, setGames, handleErr }) {
  const [tab, setTab] = useState("rooms");
  if (games.length === 0 && rooms.length === 0) return <EmptyState text="Nothing yet. Create a room and play a game to start your history." />;

  async function deleteGame(id) {
    try {
      await api.send("DELETE", `/api/games/${id}`);
      setGames(prev => prev.filter(g => g.id !== id));
    } catch (e) { handleErr(e); }
  }

  const teamLeaderboard = computeTeamStandings(games);
  const playerStandings = computePlayerStandings(games, teams);
  const playerLeaderboard = playerStandings.map(s => ({ ...s, player: players.find(p => p.id === s.playerId) })).filter(s => s.player);
  const medalColors = ["#F4CD5C", "#E8E4D0", "#C68B5C"];

  return (
    <div className="fade-up space-y-4">
      <div className="tab-bar flex gap-1 p-1 rounded">
        {["rooms", "teams", "players", "games"].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 mono-font text-[11px] font-medium rounded transition uppercase tracking-[0.12em] ${tab === t ? "tab-active" : "tab-inactive"}`}>{t}</button>
        ))}
      </div>

      {tab === "rooms" && (
        rooms.length > 0 ? (
          <div className="space-y-2">
            {rooms.map(r => (
              <RoomCard key={r.id} room={r} games={games} players={players} onClick={() => { setSelectedRoomId(r.id); setView("room"); }} />
            ))}
          </div>
        ) : <EmptyState text="No rooms yet." />
      )}

      {tab === "teams" && (
        teamLeaderboard.length > 0 ? (
          <div className="space-y-4">
            {teamLeaderboard.length >= 3 && (
              <div className="grid grid-cols-3 gap-2 items-end">
                <PodiumCard team={teamLeaderboard[1]} place={2} height={140} medalColor={medalColors[1]} players={players} onClick={() => { setSelectedTeamId(teamLeaderboard[1].teamId); setView("teamStats"); }} />
                <PodiumCard team={teamLeaderboard[0]} place={1} height={170} medalColor={medalColors[0]} players={players} crown onClick={() => { setSelectedTeamId(teamLeaderboard[0].teamId); setView("teamStats"); }} />
                <PodiumCard team={teamLeaderboard[2]} place={3} height={120} medalColor={medalColors[2]} players={players} onClick={() => { setSelectedTeamId(teamLeaderboard[2].teamId); setView("teamStats"); }} />
              </div>
            )}
            <div className="surface rounded overflow-hidden">
              {teamLeaderboard.map((s, i) => {
                const winRate = s.plays > 0 ? Math.round((s.wins / s.plays) * 100) : 0;
                const members = (s.member_ids || []).map(id => players.find(p => p.id === id)).filter(Boolean);
                return (
                  <button key={s.teamId} onClick={() => { setSelectedTeamId(s.teamId); setView("teamStats"); }} className="w-full px-5 py-3.5 flex items-center justify-between border-b last:border-0 hover:bg-white/5 transition text-left" style={{ borderColor: "rgba(212,175,55,0.1)" }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded flex items-center justify-center stat-num text-base font-semibold flex-shrink-0" style={{
                        background: i < 3 ? `${medalColors[i]}1a` : "rgba(15,61,36,0.5)",
                        border: `1px solid ${i < 3 ? medalColors[i] : "rgba(212,175,55,0.2)"}`,
                        color: i < 3 ? medalColors[i] : "rgba(245,233,207,0.7)",
                      }}>{i + 1}</div>
                      <div className="min-w-0">
                        <div className="display-font text-2xl truncate" style={{ color: "#F5E9CF" }}>{s.name}</div>
                        {members.length > 0 && <div className="flex -space-x-1.5 mt-0.5">{members.map(m => <Avatar key={m.id} player={m} size={16} />)}</div>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 flex items-center gap-3">
                      <div>
                        <div className="stat-num text-base" style={{ color: "#F5E9CF" }}>{winRate}<span className="mono-font text-[10px] ml-0.5" style={{ color: "rgba(201,185,143,0.5)" }}>%</span></div>
                        <div className="mono-font text-[9px] uppercase tracking-wider" style={{ color: "rgba(201,185,143,0.5)" }}>rate</div>
                      </div>
                      <div>
                        <div className="stat-num text-2xl" style={{ color: "#F5E9CF" }}>{s.wins}<span className="mono-font text-xs ml-1" style={{ color: "rgba(201,185,143,0.5)" }}>/ {s.plays}</span></div>
                        <div className="mono-font text-[10px] uppercase tracking-wider" style={{ color: "rgba(201,185,143,0.5)" }}>wins</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : <EmptyState text="No finished games yet." />
      )}

      {tab === "players" && (
        playerLeaderboard.length > 0 ? (
          <div className="surface rounded overflow-hidden">
            {playerLeaderboard.map((s, i) => (
              <button key={s.player.id} onClick={() => { setSelectedPlayerId(s.player.id); setView("playerStats"); }} className="w-full px-5 py-3 flex items-center justify-between border-b last:border-0 hover:bg-white/5 transition text-left" style={{ borderColor: "rgba(212,175,55,0.1)" }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 stat-num text-lg font-semibold flex-shrink-0" style={{ color: i < 3 ? medalColors[i] : "rgba(201,185,143,0.5)" }}>{i + 1}</div>
                  <Avatar player={s.player} size={38} />
                  <div className="min-w-0">
                    <div className="display-font text-xl truncate" style={{ color: "#F5E9CF" }}>{s.player.name}</div>
                    <div className="mono-font text-[10px] font-medium" style={{ color: "rgba(201,185,143,0.6)" }}>{s.totalPoints.toLocaleString()} pts total</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="stat-num text-2xl" style={{ color: "#F5E9CF" }}>{s.wins}<span className="mono-font text-xs ml-1 font-medium" style={{ color: "rgba(201,185,143,0.5)" }}>/ {s.plays}</span></div>
                  <div className="mono-font text-[10px] uppercase tracking-wider font-medium" style={{ color: "rgba(201,185,143,0.5)" }}>wins</div>
                </div>
              </button>
            ))}
          </div>
        ) : <EmptyState text="No player stats yet — finish a game with rostered teams." />
      )}

      {tab === "games" && (
        <div className="space-y-2">
          {games.map((g, i) => {
            const winner = getWinner(g);
            const totals = computeTotals(g);
            const room = rooms.find(r => r.id === g.room_id);
            return (
              <div key={g.id} className="surface p-4 rounded flex items-center justify-between fade-up" style={{ animationDelay: `${i * 30}ms` }}>
                <button onClick={() => {
                  if (g.finished_at) { setSelectedGameId(g.id); setView("gameDetail"); }
                  else { setCurrentGameId(g.id); setView("game"); }
                }} className="flex-1 text-left min-w-0">
                  <div className="display-font text-2xl truncate" style={{ color: "#F5E9CF" }}>{g.name}</div>
                  <div className="mono-font text-xs flex items-center gap-2 mt-0.5 flex-wrap font-medium" style={{ color: "rgba(201,185,143,0.6)" }}>
                    {room && <><span className="gold-text">{room.name}</span><span style={{ color: "#D4AF37" }}>·</span></>}
                    <Calendar size={11} />{formatDate(g.created_at)}
                    <span style={{ color: "#D4AF37" }}>·</span>
                    {g.finished_at ? <span className="flex items-center gap-1"><Crown size={11} style={{ color: "#F4CD5C" }} /> {winner?.name} ({totals[winner?.id] || 0})</span> : <LiveBadge label="in progress" />}
                  </div>
                </button>
                <button onClick={() => { if (confirm(`Delete "${g.name}"?`)) deleteGame(g.id); }} className="p-2 ml-1" style={{ color: "rgba(201,185,143,0.4)" }}><Trash2 size={14} /></button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PodiumCard({ team, place, height, medalColor, players, crown, onClick }) {
  const members = (team.member_ids || []).map(id => players.find(p => p.id === id)).filter(Boolean);
  return (
    <button onClick={onClick} className="surface rounded p-3 text-center transition hover:border-yellow-600/40" style={{ borderColor: place === 1 ? medalColor : "rgba(212,175,55,0.18)", height }}>
      <div className="flex flex-col items-center justify-end h-full space-y-1.5">
        {crown && <Crown size={16} style={{ color: medalColor }} />}
        {members.length > 0 && <div className="flex justify-center -space-x-2">{members.map(m => <Avatar key={m.id} player={m} size={place === 1 ? 32 : 24} />)}</div>}
        <div className="display-font truncate w-full" style={{ color: "#F5E9CF", fontSize: place === 1 ? "18px" : "14px" }}>{team.name}</div>
        <div className="stat-num" style={{ color: medalColor, fontSize: place === 1 ? "26px" : "20px", lineHeight: 1 }}>{team.wins}<span className="mono-font text-[10px] ml-0.5 opacity-60">W</span></div>
        <div className="mono-font text-[10px] uppercase tracking-wider font-semibold" style={{ color: medalColor }}>#{place}</div>
      </div>
    </button>
  );
}
