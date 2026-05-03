// ─── EYESPY v1.0.0 ───────────────────────────────────────────────────────────
import { useState, useEffect, createContext, useContext } from "react";
import { db } from "./firebase";
import {
  collection, doc, setDoc, onSnapshot, addDoc,
  query, orderBy, where, updateDoc, deleteDoc,
  arrayUnion, getDocs, writeBatch,
} from "firebase/firestore";

// ─── VERSION ──────────────────────────────────────────────────────────────────
const VERSION = "1.0.0";

// ─── GRUVBOX PALETTES ─────────────────────────────────────────────────────────
const GV_DARK = {
  bg:"#282828", bg0:"#1d2021", bg1:"#3c3836", bg2:"#504945",
  bg3:"#665c54", bg4:"#7c6f64", fg:"#ebdbb2", fg1:"#d5c4a1",
  fg2:"#bdae93", fg3:"#a89984", red:"#cc241d", redB:"#fb4934",
  green:"#98971a", greenB:"#b8bb26", yellow:"#d79921", yellowB:"#fabd2f",
  blue:"#458588", blueB:"#83a598", purple:"#b16286", purpleB:"#d3869b",
  aqua:"#689d6a", aquaB:"#8ec07c", orange:"#d65d0e", orangeB:"#fe8019",
};
const GV_LIGHT = {
  bg:"#fbf1c7", bg0:"#f9f5d7", bg1:"#ebdbb2", bg2:"#d5c4a1",
  bg3:"#bdae93", bg4:"#a89984", fg:"#3c3836", fg1:"#504945",
  fg2:"#665c54", fg3:"#7c6f64", red:"#cc241d", redB:"#9d0006",
  green:"#98971a", greenB:"#79740e", yellow:"#d79921", yellowB:"#b57614",
  blue:"#458588", blueB:"#076678", purple:"#b16286", purpleB:"#8f3f71",
  aqua:"#689d6a", aquaB:"#427b58", orange:"#d65d0e", orangeB:"#af3a03",
};

// ─── THEME CONTEXT ────────────────────────────────────────────────────────────
const ThemeContext = createContext(GV_DARK);

// ─── WORD BANK ────────────────────────────────────────────────────────────────
const WORD_BANK = [
  { id:"c01", category:"Color",   word:"Red"      },
  { id:"c02", category:"Color",   word:"Blue"     },
  { id:"c03", category:"Color",   word:"Green"    },
  { id:"c04", category:"Color",   word:"Yellow"   },
  { id:"c05", category:"Color",   word:"Orange"   },
  { id:"c06", category:"Color",   word:"Purple"   },
  { id:"c07", category:"Color",   word:"Pink"     },
  { id:"c08", category:"Color",   word:"White"    },
  { id:"c09", category:"Color",   word:"Black"    },
  { id:"c10", category:"Color",   word:"Brown"    },
  { id:"n01", category:"Number",  word:"One"      },
  { id:"n02", category:"Number",  word:"Two"      },
  { id:"n03", category:"Number",  word:"Three"    },
  { id:"n04", category:"Number",  word:"Four"     },
  { id:"n05", category:"Number",  word:"Five"     },
  { id:"n06", category:"Number",  word:"Six"      },
  { id:"n07", category:"Number",  word:"Seven"    },
  { id:"n08", category:"Number",  word:"Eight"    },
  { id:"n09", category:"Number",  word:"Nine"     },
  { id:"n10", category:"Number",  word:"Ten"      },
  { id:"s01", category:"Shape",   word:"Round"    },
  { id:"s02", category:"Shape",   word:"Square"   },
  { id:"s03", category:"Shape",   word:"Triangle" },
  { id:"s04", category:"Shape",   word:"Oval"     },
  { id:"s05", category:"Shape",   word:"Star"     },
  { id:"s06", category:"Shape",   word:"Diamond"  },
  { id:"s07", category:"Shape",   word:"Heart"    },
  { id:"z01", category:"Size",    word:"Tiny"     },
  { id:"z02", category:"Size",    word:"Giant"    },
  { id:"z03", category:"Size",    word:"Tall"     },
  { id:"z04", category:"Size",    word:"Wide"     },
  { id:"z05", category:"Size",    word:"Flat"     },
  { id:"a01", category:"Animal",  word:"Dog"      },
  { id:"a02", category:"Animal",  word:"Cat"      },
  { id:"a03", category:"Animal",  word:"Bird"     },
  { id:"a04", category:"Animal",  word:"Fish"     },
  { id:"a05", category:"Animal",  word:"Bug"      },
  { id:"o01", category:"Object",  word:"Wheel"    },
  { id:"o02", category:"Object",  word:"Door"     },
  { id:"o03", category:"Object",  word:"Sign"     },
  { id:"o04", category:"Object",  word:"Window"   },
  { id:"o05", category:"Object",  word:"Bottle"   },
  { id:"o06", category:"Object",  word:"Box"      },
  { id:"o07", category:"Object",  word:"Key"      },
  { id:"o08", category:"Object",  word:"Ladder"   },
  { id:"t01", category:"Texture", word:"Shiny"    },
  { id:"t02", category:"Texture", word:"Rough"    },
  { id:"t03", category:"Texture", word:"Fuzzy"    },
  { id:"t04", category:"Texture", word:"Smooth"   },
  { id:"t05", category:"Texture", word:"Striped"  },
  { id:"t06", category:"Texture", word:"Spotted"  },
  { id:"st01",category:"State",   word:"Broken"   },
  { id:"st02",category:"State",   word:"Stacked"  },
  { id:"st03",category:"State",   word:"Moving"   },
  { id:"st04",category:"State",   word:"Open"     },
  { id:"st05",category:"State",   word:"Closed"   },
  { id:"st06",category:"State",   word:"Bent"     },
  { id:"st07",category:"State",   word:"Old"      },
  { id:"m01", category:"Material",word:"Wooden"   },
  { id:"m02", category:"Material",word:"Metal"    },
  { id:"m03", category:"Material",word:"Glass"    },
  { id:"m04", category:"Material",word:"Plastic"  },
  { id:"m05", category:"Material",word:"Stone"    },
  { id:"nat01",category:"Nature", word:"Leaf"     },
  { id:"nat02",category:"Nature", word:"Rock"     },
  { id:"nat03",category:"Nature", word:"Flower"   },
  { id:"nat04",category:"Nature", word:"Tree"     },
  { id:"nat05",category:"Nature", word:"Cloud"    },
  { id:"nat06",category:"Nature", word:"Water"    },
  { id:"nat07",category:"Nature", word:"Dirt"     },
];

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const REACTIONS = ["🔥","😂","🤯","👀","💯"];
const IMAGE_TTL_MS = 48 * 60 * 60 * 1000;
const EMOJI_OPTIONS = [
  "👴","👩","🎵","🧢","⭐","🌟","🎯","🎲","🚀","💎",
  "🦊","🐯","🦁","🐻","🐼","🎸","🏆","🔥","💥","🎪",
  "🧙","👑","🤖","👾","🎭","🌈","⚡","🍕","🎮","🏀",
  "🧶","🧦","🎩","🦄","🐉","🌵","🍀","🎻","🥷","🦸",
];
const COLOR_OPTIONS = [
  GV_DARK.orangeB, GV_DARK.purpleB, GV_DARK.blueB,  GV_DARK.greenB,  GV_DARK.yellowB,
  GV_DARK.redB,    GV_DARK.aquaB,   GV_DARK.orange,  GV_DARK.purple,  GV_DARK.blue,
  GV_DARK.green,   GV_DARK.yellow,  GV_DARK.fg,      GV_DARK.fg2,     GV_DARK.aqua,
];
const CHANGELOG = [
  {
    version: "1.0.0",
    entries: [
      "EyeSpy is live! Find real-world objects matching today's daily words.",
      "Score points for every descriptor you match — match them all for a bonus!",
      "Create or join a game with friends and family using a join code.",
      "Weekly leaderboard resets every Monday at 4 AM CST.",
      "Hall of Champions tracks Top Score and Most Finds each week.",
    ],
  },
];

// ─── PERIOD HELPERS ───────────────────────────────────────────────────────────
function getISOWeekYear(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return { year: d.getUTCFullYear(), week };
}
function getPeriodKey(date, mode) {
  const d = date || new Date();
  if (mode === "weekly") {
    const shifted = new Date(d.getTime() - 10 * 60 * 60 * 1000);
    const { year, week } = getISOWeekYear(shifted);
    return `${year}-W${String(week).padStart(2, "0")}`;
  }
  const y = d.getFullYear(), m = d.getMonth() + 1;
  if (mode === "monthly") return `${y}-${String(m).padStart(2,"0")}`;
  return `${y}-Q${Math.ceil(m/3)}`;
}
function getPeriodLabel(key, mode) {
  if (mode === "weekly") {
    const [yearStr, weekStr] = key.split("-W");
    const year = parseInt(yearStr), week = parseInt(weekStr);
    const jan4 = new Date(Date.UTC(year, 0, 4));
    const jan4Day = jan4.getUTCDay() || 7;
    const week1Mon = new Date(jan4.getTime() - (jan4Day - 1) * 86400000);
    const monday = new Date(week1Mon.getTime() + (week - 1) * 7 * 86400000);
    const sunday = new Date(monday.getTime() + 6 * 86400000);
    const fmt = d => d.toLocaleDateString("en-US", { month:"short", day:"numeric" });
    return `Week of ${fmt(monday)} – ${fmt(sunday)}`;
  }
  if (mode === "monthly") {
    const [y, m] = key.split("-");
    return new Date(parseInt(y), parseInt(m)-1, 1).toLocaleString("default", { month:"long", year:"numeric" });
  }
  const [y, q] = key.split("-");
  return `${["","Jan–Mar","Apr–Jun","Jul–Sep","Oct–Dec"][parseInt(q.replace("Q",""))]} ${y}`;
}

// ─── DAILY WORD HELPERS ───────────────────────────────────────────────────────
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function generateDailyWords() {
  const count = 3 + Math.floor(Math.random() * 3); // 3, 4, or 5
  const categories = [...new Set(WORD_BANK.map(w => w.category))];
  const shuffledCats = categories.sort(() => Math.random() - 0.5).slice(0, count);
  return shuffledCats.map(cat => {
    const pool = WORD_BANK.filter(w => w.category === cat);
    return pool[Math.floor(Math.random() * pool.length)];
  });
}

// ─── SCORING ─────────────────────────────────────────────────────────────────
const MATCH_POINTS = [0, 1, 4, 10, 20, 35];
function scoreSubmission(matchedCount, totalWords) {
  const base = MATCH_POINTS[Math.min(matchedCount, 5)] || 0;
  const bonus = matchedCount === totalWords && totalWords > 0 ? 5 : 0;
  return { base, bonus, total: base + bonus, matchedCount, totalWords };
}

// ─── IMAGE HELPERS ────────────────────────────────────────────────────────────
function compressImage(file, maxWidth = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = url;
  });
}
function isImageExpired(ts) { return Date.now() - new Date(ts).getTime() > IMAGE_TTL_MS; }

// ─── CACHE HELPERS ────────────────────────────────────────────────────────────
function readCache(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function writeCache(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ─── MISC ─────────────────────────────────────────────────────────────────────
function generateJoinCode() { return Math.random().toString(36).substring(2,8).toUpperCase(); }

// ─── CONFETTI ─────────────────────────────────────────────────────────────────
function Confetti({ active }) {
  if (!active) return null;
  const pieces = Array.from({ length: 32 }, (_, i) => i);
  const colors = [GV_DARK.orangeB, GV_DARK.yellowB, GV_DARK.greenB, GV_DARK.blueB, GV_DARK.purpleB];
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9999, overflow:"hidden" }}>
      {pieces.map(i => (
        <div key={i} style={{
          position:"absolute", top:"-10px",
          left:`${Math.random()*100}%`,
          width:8, height:8, borderRadius:"50%",
          background: colors[i % colors.length],
          animation:`fall ${0.8 + Math.random()*1.2}s ease-in forwards`,
          animationDelay:`${Math.random()*0.5}s`,
        }} />
      ))}
      <style>{`@keyframes fall { to { transform: translateY(110vh) rotate(720deg); opacity:0; } }`}</style>
    </div>
  );
}

// ─── PLAYER BADGE ─────────────────────────────────────────────────────────────
function PlayerBadge({ player, size="sm" }) {
  const sz = size === "lg" ? 40 : 28;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div style={{ width:sz, height:sz, borderRadius:"50%", background:player.color,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize: sz * 0.55, flexShrink:0 }}>
        {player.emoji}
      </div>
      <span style={{ fontWeight:700, fontSize: size === "lg" ? 16 : 13 }}>{player.name}</span>
    </div>
  );
}

// ─── PROOF IMAGE ──────────────────────────────────────────────────────────────
function ProofImage({ imageData, timestamp, hadImage }) {
  const GV = useContext(ThemeContext);
  if (!hadImage) return <span style={{ color:GV.fg3, fontSize:11 }}>No photo</span>;
  if (isImageExpired(timestamp)) return <span style={{ color:GV.fg3, fontSize:11 }}>📷 Photo expired</span>;
  if (!imageData) return <span style={{ color:GV.fg3, fontSize:11 }}>📷 Loading…</span>;
  return <img src={imageData} alt="proof" style={{ width:"100%", borderRadius:8, marginTop:8 }} />;
}

// ─── REACTION BAR ─────────────────────────────────────────────────────────────
function ReactionBar({ submissionId, reactions = {} }) {
  const GV = useContext(ThemeContext);
  async function handleReact(emoji) {
    const ref = doc(db, "submissions", submissionId);
    const key = `reactions.${emoji}`;
    await updateDoc(ref, { [key]: (reactions[emoji] || 0) + 1 });
  }
  return (
    <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:8 }}>
      {REACTIONS.map(e => (
        <button key={e} onClick={() => handleReact(e)}
          style={{ background:GV.bg2, border:"none", borderRadius:20,
            padding:"2px 8px", cursor:"pointer", fontSize:13,
            color:GV.fg, fontFamily:"inherit" }}>
          {e}{reactions[e] ? ` ${reactions[e]}` : ""}
        </button>
      ))}
    </div>
  );
}

// ─── WORD CHIP ────────────────────────────────────────────────────────────────
function WordChip({ word, matched, selected, onToggle, disabled }) {
  const GV = useContext(ThemeContext);
  const bg = matched ? GV.greenB : selected ? GV.orangeB : GV.bg2;
  const fg = matched || selected ? GV.bg0 : GV.fg;
  return (
    <button onClick={onToggle} disabled={disabled}
      style={{ background:bg, color:fg, border:"none", borderRadius:20,
        padding:"6px 14px", fontSize:13, fontWeight:700, cursor: disabled ? "default" : "pointer",
        fontFamily:"inherit", transition:"background 0.15s" }}>
      {word.word}
      <span style={{ fontSize:10, opacity:0.75, marginLeft:4 }}>({word.category})</span>
    </button>
  );
}

// ─── WINNER BANNER ────────────────────────────────────────────────────────────
function WinnerBanner({ winner, periodLabel, onDismiss }) {
  const GV = useContext(ThemeContext);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:999, padding:24 }}>
      <div style={{ background:GV.bg1, borderRadius:16, padding:32, textAlign:"center", maxWidth:320 }}>
        <div style={{ fontSize:48 }}>🏆</div>
        <div style={{ color:GV.yellowB, fontSize:20, fontWeight:900, margin:"12px 0 4px" }}>
          Week Champion!
        </div>
        <div style={{ color:GV.fg3, fontSize:12, marginBottom:16 }}>{periodLabel}</div>
        <PlayerBadge player={winner} size="lg" />
        <div style={{ color:GV.fg, marginTop:8 }}>{winner.total} pts</div>
        <button onClick={onDismiss}
          style={{ marginTop:20, background:GV.orange, border:"none", borderRadius:10,
            padding:"10px 24px", color:GV.bg0, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          Let's Go! 🎉
        </button>
      </div>
    </div>
  );
}

// ─── WELCOME MODAL ────────────────────────────────────────────────────────────
function WelcomeModal({ isFirstTime, onAccept }) {
  const GV = useContext(ThemeContext);
  return (
    <div style={{ background:GV.bg0, minHeight:"100vh", display:"flex", alignItems:"center",
      justifyContent:"center", padding:24, fontFamily:"'Courier Prime',monospace" }}>
      <div style={{ maxWidth:400, width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <span style={{ fontSize:40 }}>👁️</span>
          <div style={{ fontSize:28, fontWeight:900, color:GV.orangeB, letterSpacing:2 }}>EYESPY</div>
          <div style={{ color:GV.fg3, fontSize:11, letterSpacing:3 }}>SCAVENGER HUNT</div>
        </div>
        {CHANGELOG.map(c => (
          <div key={c.version} style={{ marginBottom:16 }}>
            <div style={{ color:GV.yellowB, fontSize:12, fontWeight:700, marginBottom:8 }}>
              v{c.version}
            </div>
            {c.entries.map((e,i) => (
              <div key={i} style={{ color:GV.fg1, fontSize:12, marginBottom:4, paddingLeft:12 }}>
                • {e}
              </div>
            ))}
          </div>
        ))}
        <div style={{ background:GV.bg1, borderRadius:10, padding:12, marginBottom:20,
          color:GV.fg3, fontSize:11, lineHeight:1.6 }}>
          By playing EyeSpy you agree to keep it fun, family-friendly, and safe.
          Only photograph things you're allowed to photograph. Play responsibly.
        </div>
        <button onClick={onAccept}
          style={{ width:"100%", background:GV.orange, border:"none", borderRadius:12,
            padding:"14px", color:GV.bg0, fontWeight:900, fontSize:16,
            cursor:"pointer", fontFamily:"inherit", letterSpacing:1 }}>
          {isFirstTime ? "Let's Play! 👁️" : "Got It!"}
        </button>
      </div>
    </div>
  );
}

// ─── PLAYER MODAL ─────────────────────────────────────────────────────────────
function PlayerModal({ player, onSave, onRemove, onClose, inputStyle, isEdit }) {
  const GV = useContext(ThemeContext);
  const [name, setName] = useState(player?.name || "");
  const [emoji, setEmoji] = useState(player?.emoji || "👴");
  const [color, setColor] = useState(player?.color || GV_DARK.orangeB);
  function handleSave() {
    if (!name.trim()) return;
    onSave({ name: name.trim(), emoji, color });
  }
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:20 }}>
      <div style={{ background:GV_DARK.bg1, borderRadius:16, padding:24, width:"100%", maxWidth:380 }}>
        <div style={{ fontWeight:900, color:GV_DARK.orangeB, marginBottom:16 }}>
          {isEdit ? "Edit Player" : "New Player"}
        </div>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name"
          style={{ ...inputStyle, width:"100%", marginBottom:12, display:"block" }} />
        <div style={{ color:GV_DARK.fg3, fontSize:11, letterSpacing:2, marginBottom:8 }}>EMOJI</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
          {EMOJI_OPTIONS.map(e => (
            <button key={e} onClick={()=>setEmoji(e)}
              style={{ fontSize:20, background: e===emoji ? GV_DARK.bg3 : "transparent",
                border: e===emoji ? `2px solid ${GV_DARK.orangeB}` : "2px solid transparent",
                borderRadius:8, cursor:"pointer", padding:4 }}>
              {e}
            </button>
          ))}
        </div>
        <div style={{ color:GV_DARK.fg3, fontSize:11, letterSpacing:2, marginBottom:8 }}>COLOR</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:20 }}>
          {COLOR_OPTIONS.map(c => (
            <div key={c} onClick={()=>setColor(c)}
              style={{ width:28, height:28, borderRadius:"50%", background:c, cursor:"pointer",
                border: c===color ? `3px solid ${GV_DARK.fg}` : "3px solid transparent" }} />
          ))}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={handleSave}
            style={{ flex:1, background:GV_DARK.orange, border:"none", borderRadius:10,
              padding:"12px", color:GV_DARK.bg0, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            {isEdit ? "Save" : "Add Player"}
          </button>
          <button onClick={onClose}
            style={{ flex:1, background:GV_DARK.bg2, border:"none", borderRadius:10,
              padding:"12px", color:GV_DARK.fg, cursor:"pointer", fontFamily:"inherit" }}>
            Cancel
          </button>
        </div>
        {isEdit && onRemove && (
          <button onClick={onRemove}
            style={{ width:"100%", marginTop:10, background:"transparent",
              border:`1px solid ${GV_DARK.red}`, borderRadius:10, padding:"10px",
              color:GV_DARK.red, cursor:"pointer", fontFamily:"inherit", fontSize:12 }}>
            Remove Player
          </button>
        )}
      </div>
    </div>
  );
}

// ─── PLAYER SELECT SCREEN ─────────────────────────────────────────────────────
function PlayerSelectScreen({ players, playersLoaded, onSelect, onAddPlayer }) {
  const GV = useContext(ThemeContext);
  return (
    <div style={{ background:GV_DARK.bg0, minHeight:"100vh", padding:24,
      fontFamily:"'Courier Prime',monospace", color:GV_DARK.fg }}>
      <div style={{ textAlign:"center", marginBottom:32, paddingTop:24 }}>
        <span style={{ fontSize:40 }}>👁️</span>
        <div style={{ fontSize:28, fontWeight:900, color:GV_DARK.orangeB, letterSpacing:2 }}>EYESPY</div>
        <div style={{ color:GV_DARK.fg3, fontSize:11, letterSpacing:3 }}>WHO'S PLAYING?</div>
      </div>
      {!playersLoaded && players.length === 0 ? (
        <div style={{ textAlign:"center", color:GV_DARK.fg3, fontSize:13 }}>🔍 Loading…</div>
      ) : (
        <>
          {players.map(p => (
            <button key={p.id} onClick={() => onSelect(p)}
              style={{ width:"100%", background:GV_DARK.bg1, border:`1px solid ${GV_DARK.bg2}`,
                borderRadius:12, padding:"14px 16px", marginBottom:10, cursor:"pointer",
                display:"flex", alignItems:"center", gap:12, fontFamily:"inherit" }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:p.color,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>
                {p.emoji}
              </div>
              <span style={{ color:GV_DARK.fg, fontWeight:700, fontSize:15 }}>{p.name}</span>
            </button>
          ))}
          <button onClick={onAddPlayer}
            style={{ width:"100%", background:"transparent", border:`2px dashed ${GV_DARK.bg3}`,
              borderRadius:12, padding:"14px", color:GV_DARK.fg3, cursor:"pointer",
              fontFamily:"inherit", fontSize:13, marginTop:4 }}>
            + New Player
          </button>
        </>
      )}
    </div>
  );
}

// ─── GAME SELECT SCREEN ───────────────────────────────────────────────────────
function GameSelectScreen({ player, games, gamesLoaded, onSelect, onCreateGame, onJoinGame, onSwitchPlayer }) {
  const GV = useContext(ThemeContext);
  return (
    <div style={{ background:GV.bg0, minHeight:"100vh", padding:24,
      fontFamily:"'Courier Prime',monospace", color:GV.fg }}>
      <div style={{ textAlign:"center", marginBottom:32, paddingTop:24 }}>
        <span style={{ fontSize:40 }}>👁️</span>
        <div style={{ fontSize:28, fontWeight:900, color:GV.orangeB, letterSpacing:2 }}>EYESPY</div>
        <div style={{ color:GV.fg3, fontSize:11, letterSpacing:3, marginBottom:16 }}>SELECT A GAME</div>
        <PlayerBadge player={player} />
      </div>
      {!gamesLoaded ? (
        <div style={{ textAlign:"center", color:GV.fg3 }}>🔍 Loading…</div>
      ) : games.length === 0 ? (
        <div style={{ textAlign:"center", color:GV.fg3, fontSize:13, marginBottom:24 }}>
          No games yet — create one or join with a code!
        </div>
      ) : (
        games.map(g => (
          <button key={g.id} onClick={() => onSelect(g)}
            style={{ width:"100%", background:GV.bg1, border:`1px solid ${GV.bg2}`,
              borderRadius:12, padding:"14px 16px", marginBottom:10, cursor:"pointer",
              textAlign:"left", fontFamily:"inherit" }}>
            <div style={{ color:GV.fg, fontWeight:700 }}>{g.name}</div>
            <div style={{ color:GV.fg3, fontSize:11, marginTop:2 }}>
              {g.members?.length || 0} player{g.members?.length !== 1 ? "s" : ""} · {g.periodMode || "weekly"}
            </div>
          </button>
        ))
      )}
      <button onClick={onCreateGame}
        style={{ width:"100%", background:GV.orange, border:"none", borderRadius:12,
          padding:"12px", color:GV.bg0, fontWeight:700, cursor:"pointer",
          fontFamily:"inherit", marginBottom:10 }}>
        + Create Game
      </button>
      <button onClick={onJoinGame}
        style={{ width:"100%", background:GV.bg1, border:`1px solid ${GV.bg2}`, borderRadius:12,
          padding:"12px", color:GV.fg, cursor:"pointer", fontFamily:"inherit", marginBottom:24 }}>
        Join with Code
      </button>
      <button onClick={onSwitchPlayer}
        style={{ width:"100%", background:"transparent", border:"none",
          color:GV.fg3, cursor:"pointer", fontFamily:"inherit", fontSize:12 }}>
        ← Switch Player
      </button>
    </div>
  );
}

// ─── CREATE GAME MODAL ────────────────────────────────────────────────────────
function CreateGameModal({ onSave, onClose, inputStyle }) {
  const GV = useContext(ThemeContext);
  const [name, setName] = useState("");
  async function handleCreate() {
    if (!name.trim()) return;
    await onSave({ name: name.trim(), periodMode: "weekly", joinCode: generateJoinCode() });
  }
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:20 }}>
      <div style={{ background:GV_DARK.bg1, borderRadius:16, padding:24, width:"100%", maxWidth:360 }}>
        <div style={{ fontWeight:900, color:GV_DARK.orangeB, marginBottom:16 }}>Create Game</div>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Game name"
          style={{ ...inputStyle, width:"100%", marginBottom:16, display:"block" }} />
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={handleCreate}
            style={{ flex:1, background:GV_DARK.orange, border:"none", borderRadius:10,
              padding:"12px", color:GV_DARK.bg0, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            Create
          </button>
          <button onClick={onClose}
            style={{ flex:1, background:GV_DARK.bg2, border:"none", borderRadius:10,
              padding:"12px", color:GV_DARK.fg, cursor:"pointer", fontFamily:"inherit" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── JOIN GAME MODAL ──────────────────────────────────────────────────────────
function JoinGameModal({ onJoin, onClose, inputStyle }) {
  const GV = useContext(ThemeContext);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  async function handleJoin() {
    const err = await onJoin(code.trim().toUpperCase());
    if (err) setError(err);
  }
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:20 }}>
      <div style={{ background:GV_DARK.bg1, borderRadius:16, padding:24, width:"100%", maxWidth:360 }}>
        <div style={{ fontWeight:900, color:GV_DARK.orangeB, marginBottom:16 }}>Join Game</div>
        <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Enter join code"
          style={{ ...inputStyle, width:"100%", marginBottom:8, display:"block" }} />
        {error && <div style={{ color:GV_DARK.redB, fontSize:12, marginBottom:8 }}>{error}</div>}
        <div style={{ display:"flex", gap:10, marginTop:8 }}>
          <button onClick={handleJoin}
            style={{ flex:1, background:GV_DARK.orange, border:"none", borderRadius:10,
              padding:"12px", color:GV_DARK.bg0, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            Join
          </button>
          <button onClick={onClose}
            style={{ flex:1, background:GV_DARK.bg2, border:"none", borderRadius:10,
              padding:"12px", color:GV_DARK.fg, cursor:"pointer", fontFamily:"inherit" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CHAMPIONS TAB ────────────────────────────────────────────────────────────
function ChampionsTab({ champions, players }) {
  const GV = useContext(ThemeContext);
  const sorted = [...champions].sort((a,b) => b.periodKey?.localeCompare(a.periodKey));
  const periods = [...new Set(sorted.map(c => c.periodKey))];
  if (periods.length === 0) return (
    <div style={{ textAlign:"center", color:GV.fg3, padding:40 }}>
      No champions yet — keep playing!
    </div>
  );
  return (
    <div>
      {periods.map(pk => {
        const ts = sorted.filter(c => c.periodKey === pk);
        const top = ts.find(c => c.type === "topscore");
        const mf  = ts.find(c => c.type === "mostfinds");
        const label = ts[0]?.periodLabel || pk;
        return (
          <div key={pk} style={{ background:GV.bg1, border:`1px solid ${GV.bg2}`,
            borderRadius:12, padding:"14px 16px", marginBottom:10 }}>
            <div style={{ color:GV.fg3, fontSize:11, letterSpacing:2, marginBottom:10 }}>{label}</div>
            {top && (
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <span style={{ fontSize:13 }}>🏆 Top Score</span>
                <span style={{ color:GV.yellowB, fontWeight:700 }}>{top.playerName} · {top.value} pts</span>
              </div>
            )}
            {mf && (
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:13 }}>📸 Most Finds</span>
                <span style={{ color:GV.blueB, fontWeight:700 }}>{mf.playerName} · {mf.value} finds</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── RULES TAB ────────────────────────────────────────────────────────────────
function RulesTab() {
  const GV = useContext(ThemeContext);
  const S = { section: { marginBottom:24 }, heading: { color:GV.orangeB, fontWeight:900,
    fontSize:13, letterSpacing:2, marginBottom:10 }, body: { color:GV.fg1, fontSize:13, lineHeight:1.7 } };
  return (
    <div>
      <div style={S.section}>
        <div style={S.heading}>HOW TO PLAY</div>
        <div style={S.body}>
          Each day EyeSpy gives you 3–5 words. Go out into the real world and find
          something that matches as many of those words as possible. Snap a photo as
          proof, tag which words you matched, and submit!
        </div>
      </div>
      <div style={S.section}>
        <div style={S.heading}>SCORING</div>
        {[["1 match","1 pt"],["2 matches","4 pts"],["3 matches","10 pts"],
          ["4 matches","20 pts"],["5 matches","35 pts"]].map(([k,v]) => (
          <div key={k} style={{ display:"flex", justifyContent:"space-between",
            color:GV.fg1, fontSize:13, marginBottom:4 }}>
            <span>{k}</span><span style={{ color:GV.yellowB, fontWeight:700 }}>{v}</span>
          </div>
        ))}
        <div style={{ color:GV.greenB, fontSize:12, marginTop:8 }}>
          +5 bonus for matching ALL words of the day!
        </div>
      </div>
      <div style={S.section}>
        <div style={S.heading}>WORD CATEGORIES</div>
        <div style={S.body}>
          Color · Number · Shape · Size · Animal · Object · Texture · State · Material · Nature
        </div>
      </div>
      <div style={S.section}>
        <div style={S.heading}>LEADERBOARD</div>
        <div style={S.body}>
          Scores reset every Monday at 4:00 AM CST. The weekly champion is crowned
          for Top Score 🏆 and Most Finds 📸.
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("today");

  // Players
  const [players, setPlayers] = useState(() => readCache("esp_cached_players", []));
  const [playersLoaded, setPlayersLoaded] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  // Games
  const [games, setGames] = useState(() => readCache("esp_cached_games", []));
  const [gamesLoaded, setGamesLoaded] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  // Daily words
  const [dailyWords, setDailyWords] = useState([]);
  const [todayKey, setTodayKey] = useState(getTodayKey());

  // Submissions
  const [submissions, setSubmissions] = useState([]);

  // Champions
  const [champions, setChampions] = useState([]);
  const [pendingWinner, setPendingWinner] = useState(null);

  // UI state
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showCreateGame, setShowCreateGame] = useState(false);
  const [showJoinGame, setShowJoinGame] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [editingCurrentPlayer, setEditingCurrentPlayer] = useState(false);

  // Submit form
  const [selectedWords, setSelectedWords] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = { current: null };

  // ── Welcome modal ──
  useEffect(() => {
    const seen = localStorage.getItem("esp_seen_version");
    if (seen !== VERSION) {
      setIsFirstTimeUser(!seen);
      setShowWelcomeModal(true);
    }
  }, []);
  function handleAcceptTerms() {
    localStorage.setItem("esp_seen_version", VERSION);
    setShowWelcomeModal(false);
  }

  // ── Players subscription ──
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "players"), snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPlayers(data);
      setPlayersLoaded(true);
      writeCache("esp_cached_players", data);
    });
    return unsub;
  }, []);

  // ── Restore session ──
  useEffect(() => {
    if (!playersLoaded || currentPlayer) return;
    const savedId = localStorage.getItem("esp_player_id");
    if (savedId) {
      const p = players.find(x => x.id === savedId);
      if (p) setCurrentPlayer(p);
    }
  }, [playersLoaded, players]);

  // ── Keep currentPlayer in sync ──
  useEffect(() => {
    if (!currentPlayer) return;
    const fresh = players.find(p => p.id === currentPlayer.id);
    if (fresh) setCurrentPlayer(fresh);
  }, [players]);

  // ── Games subscription ──
  useEffect(() => {
    if (!currentPlayer) return;
    const unsub = onSnapshot(collection(db, "games"), snap => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const mine = all.filter(g => g.members?.includes(currentPlayer.id));
      setGames(mine);
      setGamesLoaded(true);
      writeCache("esp_cached_games", mine);
    });
    return unsub;
  }, [currentPlayer?.id]);

  // ── Restore active game ──
  useEffect(() => {
    if (!gamesLoaded || activeGame) return;
    const savedId = localStorage.getItem("esp_active_game");
    if (savedId) {
      const g = games.find(x => x.id === savedId);
      if (g) setActiveGame(g);
    }
  }, [gamesLoaded, games]);

  // ── Daily words ──
  useEffect(() => {
    if (!activeGame) return;
    const key = getTodayKey();
    setTodayKey(key);
    const unsub = onSnapshot(doc(db, "dailyWords", key), async snap => {
      if (snap.exists()) {
        setDailyWords(snap.data().words || []);
      } else {
        const words = generateDailyWords();
        await setDoc(doc(db, "dailyWords", key), {
          date: key, words, generatedAt: new Date().toISOString(),
        });
        setDailyWords(words);
      }
    });
    return unsub;
  }, [activeGame?.id]);

  // ── Submissions subscription ──
  useEffect(() => {
    if (!activeGame) return;
    const q = query(
      collection(db, "submissions"),
      where("gameIds", "array-contains", activeGame.id),
      orderBy("timestamp", "desc")
    );
    const unsub = onSnapshot(q, snap => {
      setSubmissions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [activeGame?.id]);

  // ── Champions subscription ──
  useEffect(() => {
    if (!activeGame) return;
    const q = query(collection(db, "champions"), where("gameId", "==", activeGame.id));
    const unsub = onSnapshot(q, snap => {
      setChampions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [activeGame?.id]);

  // ── Period reset check ──
  useEffect(() => {
    if (!activeGame || submissions.length === 0) return;
    const mode = activeGame.periodMode || "weekly";
    const currentKey = getPeriodKey(new Date(), mode);
    const lsKey = `esp_last_period_${activeGame.id}`;
    const lastResetKey = localStorage.getItem(lsKey) || currentKey;
    localStorage.setItem(lsKey, currentKey);
    if (lastResetKey === currentKey) return;
    const lastSubs = submissions.filter(s =>
      getPeriodKey(new Date(s.timestamp), mode) === lastResetKey
    );
    if (lastSubs.length === 0) return;
    const scores = {}, finds = {};
    lastSubs.forEach(s => {
      scores[s.playerId] = (scores[s.playerId] || 0) + s.score;
      finds[s.playerId]  = (finds[s.playerId]  || 0) + 1;
    });
    const [[topId, topScore]] = Object.entries(scores).sort((a,b) => b[1]-a[1]);
    const [[mfId,  mfCount]]  = Object.entries(finds).sort((a,b)  => b[1]-a[1]);
    const topPlayer = players.find(p => p.id === topId) || { name: topId, emoji:"🏆", color:GV_DARK.yellowB };
    const mfPlayer  = players.find(p => p.id === mfId)  || { name: mfId,  emoji:"📸", color:GV_DARK.blueB  };
    const periodLabel = getPeriodLabel(lastResetKey, mode);
    setDoc(doc(db, "champions", `${activeGame.id}_${lastResetKey}_topscore`), {
      gameId: activeGame.id, periodKey: lastResetKey, periodLabel,
      type: "topscore", playerId: topId, playerName: topPlayer.name, value: topScore,
    });
    setDoc(doc(db, "champions", `${activeGame.id}_${lastResetKey}_mostfinds`), {
      gameId: activeGame.id, periodKey: lastResetKey, periodLabel,
      type: "mostfinds", playerId: mfId, playerName: mfPlayer.name, value: mfCount,
    });
    setPendingWinner({ ...topPlayer, total: topScore, periodLabel });
  }, [activeGame?.id, submissions.length]);

  // ── Theme ──
  const GV = currentPlayer?.theme === "light" ? GV_LIGHT : GV_DARK;
  const darkInput = { background:GV_DARK.bg0, border:`1px solid ${GV_DARK.bg2}`, borderRadius:10,
    padding:"12px 14px", color:GV_DARK.fg, fontSize:13, fontFamily:"inherit", outline:"none",
    boxSizing:"border-box" };
  const inputStyle = { background:GV.bg0, border:`1px solid ${GV.bg2}`, borderRadius:10,
    padding:"12px 14px", color:GV.fg, fontSize:13, fontFamily:"inherit", outline:"none",
    boxSizing:"border-box" };

  // ── Player CRUD ──
  async function handleAddPlayer({ name, emoji, color }) {
    const id = name.toLowerCase().replace(/\s+/g,"_") + "_" + Date.now();
    await setDoc(doc(db, "players", id), { id, name, emoji, color, isAdmin: false, theme:"dark" });
    setShowAddPlayer(false);
  }
  async function handleEditPlayer(playerId, changes) {
    await updateDoc(doc(db, "players", playerId), changes);
    setEditingCurrentPlayer(false);
  }
  async function handleRemovePlayer(playerId) {
    await deleteDoc(doc(db, "players", playerId));
    setEditingCurrentPlayer(false);
  }
  function handleSelectPlayer(player) {
    localStorage.setItem("esp_player_id", player.id);
    setCurrentPlayer(player);
  }
  function handleLogout() {
    localStorage.removeItem("esp_player_id");
    localStorage.removeItem("esp_active_game");
    setCurrentPlayer(null);
    setActiveGame(null);
    setTab("today");
  }
  async function handleThemeToggle() {
    const newTheme = currentPlayer.theme === "light" ? "dark" : "light";
    setCurrentPlayer(prev => ({ ...prev, theme: newTheme }));
    await updateDoc(doc(db, "players", currentPlayer.id), { theme: newTheme });
  }

  // ── Game CRUD ──
  async function handleCreateGame({ name, periodMode, joinCode }) {
    const id = name.toLowerCase().replace(/\s+/g,"_") + "_" + Date.now();
    await setDoc(doc(db, "games", id), {
      id, name, periodMode, joinCode,
      members: [currentPlayer.id],
      createdBy: currentPlayer.id,
      createdAt: new Date().toISOString(),
    });
    setShowCreateGame(false);
  }
  async function handleJoinGame(code) {
    const snap = await getDocs(query(collection(db, "games"), where("joinCode", "==", code)));
    if (snap.empty) return "Game not found. Check your join code.";
    const gameDoc = snap.docs[0];
    const game = { id: gameDoc.id, ...gameDoc.data() };
    if (game.members?.includes(currentPlayer.id)) return "You're already in this game!";
    await updateDoc(doc(db, "games", game.id), { members: arrayUnion(currentPlayer.id) });
    setShowJoinGame(false);
    return null;
  }
  function handleSelectGame(game) {
    setActiveGame(game);
    localStorage.setItem("esp_active_game", game.id);
    setTab("today");
  }

  // ── Submit ──
  async function handleSubmit() {
    setSubmitError("");
    if (selectedWords.length === 0) { setSubmitError("Tag at least one word you matched."); return; }
    if (!imageFile) { setSubmitError("Attach a proof photo — pic or it didn't happen! 📷"); return; }
    setSubmitting(true);
    try {
      const scoreResult = scoreSubmission(selectedWords.length, dailyWords.length);
      const imageData = await compressImage(imageFile);
      const playerSubs = submissions.filter(s => s.playerId === currentPlayer.id);
      const prevBest = playerSubs.length ? Math.max(...playerSubs.map(s => s.score)) : 0;
      if (scoreResult.total > prevBest && prevBest > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
      await addDoc(collection(db, "submissions"), {
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        gameIds: [activeGame.id],
        dailyKey: todayKey,
        dailyWords: dailyWords,
        matchedWords: selectedWords,
        score: scoreResult.total,
        scoreDetail: scoreResult,
        hasImage: true, imageData, reactions: {},
        note: note.trim(),
        timestamp: new Date().toISOString(),
      });
      setSelectedWords([]);
      setNote("");
      setImageFile(null);
      setImagePreviewUrl(null);
      setTab("board");
    } catch(e) {
      console.error(e);
      setSubmitError("Couldn't save. Try a smaller photo.");
    }
    setSubmitting(false);
  }

  // ── Derived data ──
  const periodMode = activeGame?.periodMode || "weekly";
  const currentPeriodKey = activeGame ? getPeriodKey(new Date(), periodMode) : null;
  const periodSubs = activeGame
    ? submissions.filter(s => getPeriodKey(new Date(s.timestamp), periodMode) === currentPeriodKey)
    : [];
  const leaderboard = players
    .filter(p => activeGame?.members?.includes(p.id))
    .map(p => {
      const subs = periodSubs.filter(s => s.playerId === p.id);
      return { ...p,
        total: subs.reduce((a,s) => a + s.score, 0),
        count: subs.length,
        best: subs.length ? Math.max(...subs.map(s => s.score)) : 0,
      };
    }).sort((a,b) => b.total - a.total);

  // ── Loading screen ──
  if (players.length === 0 && !playersLoaded) return (
    <div style={{ background:GV_DARK.bg0, minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", fontFamily:"'Courier Prime',monospace" }}>
      <span style={{ fontSize:40 }}>👁️</span>
      <div style={{ fontSize:28, fontWeight:900, color:GV_DARK.orangeB, letterSpacing:2, marginTop:8 }}>EYESPY</div>
      <div style={{ color:GV_DARK.fg3, fontSize:12, letterSpacing:3, marginTop:8 }}>LOADING…</div>
    </div>
  );

  if (showWelcomeModal) return (
    <ThemeContext.Provider value={GV}>
      <WelcomeModal isFirstTime={isFirstTimeUser} onAccept={handleAcceptTerms} />
    </ThemeContext.Provider>
  );

  if (!currentPlayer) return (
    <ThemeContext.Provider value={GV_DARK}>
      <PlayerSelectScreen players={players} playersLoaded={playersLoaded}
        onSelect={handleSelectPlayer} onAddPlayer={() => setShowAddPlayer(true)} />
      {showAddPlayer && (
        <PlayerModal player={null} onSave={handleAddPlayer} onRemove={null}
          onClose={() => setShowAddPlayer(false)} inputStyle={darkInput} isEdit={false} />
      )}
    </ThemeContext.Provider>
  );

  if (!activeGame) return (
    <ThemeContext.Provider value={GV}>
      <GameSelectScreen player={currentPlayer} games={games} gamesLoaded={gamesLoaded}
        onSelect={handleSelectGame} onCreateGame={() => setShowCreateGame(true)}
        onJoinGame={() => setShowJoinGame(true)} onSwitchPlayer={handleLogout} />
      {showCreateGame && (
        <CreateGameModal onSave={handleCreateGame} onClose={() => setShowCreateGame(false)} inputStyle={darkInput} />
      )}
      {showJoinGame && (
        <JoinGameModal onJoin={handleJoinGame} onClose={() => setShowJoinGame(false)} inputStyle={darkInput} />
      )}
    </ThemeContext.Provider>
  );

  const NAV = [
    ["today",    "👁️ Today"],
    ["submit",   "➕ Submit"],
    ["board",    "🏆 Board"],
    ["feed",     "📋 Feed"],
    ["rules",    "📖 Rules"],
    ["champs",   "🥇 Champs"],
  ];

  return (
    <ThemeContext.Provider value={GV}>
      <div style={{ background:GV.bg0, minHeight:"100vh", fontFamily:"'Courier Prime',monospace",
        color:GV.fg, maxWidth:480, margin:"0 auto", paddingBottom:80 }}>

        <Confetti active={showConfetti} />

        {pendingWinner && (
          <WinnerBanner winner={pendingWinner} periodLabel={pendingWinner.periodLabel}
            onDismiss={() => setPendingWinner(null)} />
        )}

        {/* HEADER */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"16px 20px", borderBottom:`1px solid ${GV.bg2}` }}>
          <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
            <span style={{ fontSize:22, fontWeight:900, color:GV.orangeB, letterSpacing:1 }}>EYESPY</span>
            <span style={{ fontSize:18 }}>👁️</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ color:GV.fg3, fontSize:11 }}>{activeGame.name}</span>
            <button onClick={() => setEditingCurrentPlayer(true)}
              style={{ background:"transparent", border:"none", cursor:"pointer", padding:4 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:currentPlayer.color,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
                {currentPlayer.emoji}
              </div>
            </button>
          </div>
        </div>

        {/* TAB CONTENT */}
        <div style={{ padding:"16px 20px" }}>

          {/* TODAY TAB */}
          {tab === "today" && (
            <div>
              <div style={{ color:GV.fg3, fontSize:11, letterSpacing:2, marginBottom:4 }}>TODAY'S WORDS</div>
              <div style={{ color:GV.fg3, fontSize:11, marginBottom:16 }}>
                {new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" })}
              </div>
              {dailyWords.length === 0 ? (
                <div style={{ color:GV.fg3, textAlign:"center", padding:40 }}>🔍 Loading today's words…</div>
              ) : (
                <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:24 }}>
                  {dailyWords.map(w => (
                    <div key={w.id} style={{ background:GV.bg1, border:`2px solid ${GV.orangeB}`,
                      borderRadius:20, padding:"8px 16px" }}>
                      <div style={{ color:GV.fg, fontWeight:900, fontSize:16 }}>{w.word}</div>
                      <div style={{ color:GV.fg3, fontSize:10, textAlign:"center" }}>{w.category}</div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ background:GV.bg1, border:`1px solid ${GV.bg2}`, borderRadius:12, padding:"14px 16px" }}>
                <div style={{ color:GV.fg3, fontSize:11, letterSpacing:2, marginBottom:8 }}>HOW TO SCORE</div>
                {[["1 match","1 pt"],["2 matches","4 pts"],["3 matches","10 pts"],["4 matches","20 pts"],["5 matches","35 pts + 5 bonus"]].map(([k,v]) => (
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:3 }}>
                    <span style={{ color:GV.fg2 }}>{k}</span>
                    <span style={{ color:GV.yellowB, fontWeight:700 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBMIT TAB */}
          {tab === "submit" && (
            <div>
              <div style={{ color:GV.fg3, fontSize:11, letterSpacing:2, marginBottom:16 }}>NEW FIND</div>
              <div style={{ color:GV.fg3, fontSize:11, letterSpacing:2, marginBottom:8 }}>TAP WORDS YOU MATCHED</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:20 }}>
                {dailyWords.map(w => (
                  <WordChip key={w.id} word={w}
                    selected={selectedWords.some(s => s.id === w.id)}
                    matched={false}
                    onToggle={() => setSelectedWords(prev =>
                      prev.some(s => s.id === w.id)
                        ? prev.filter(s => s.id !== w.id)
                        : [...prev, w]
                    )}
                  />
                ))}
              </div>
              {selectedWords.length > 0 && (
                <div style={{ background:GV.bg1, borderRadius:10, padding:"10px 14px", marginBottom:16,
                  display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ color:GV.fg2, fontSize:12 }}>
                    {selectedWords.length} of {dailyWords.length} matched
                  </span>
                  <span style={{ color:GV.yellowB, fontWeight:900 }}>
                    {scoreSubmission(selectedWords.length, dailyWords.length).total} pts
                  </span>
                </div>
              )}
              <div style={{ marginBottom:16 }}>
                <label style={{ color:GV.fg3, fontSize:11, letterSpacing:2, display:"block", marginBottom:8 }}>
                  PROOF PHOTO *
                </label>
                <input type="file" accept="image/*" capture="environment"
                  ref={el => fileInputRef.current = el}
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) { setImageFile(f); setImagePreviewUrl(URL.createObjectURL(f)); }
                  }}
                  style={{ display:"none" }} />
                {imagePreviewUrl ? (
                  <div>
                    <img src={imagePreviewUrl} alt="preview"
                      style={{ width:"100%", borderRadius:10, marginBottom:8 }} />
                    <button onClick={() => { setImageFile(null); setImagePreviewUrl(null); }}
                      style={{ background:"transparent", border:`1px solid ${GV.bg3}`, borderRadius:8,
                        padding:"6px 12px", color:GV.fg3, cursor:"pointer", fontFamily:"inherit", fontSize:12 }}>
                      Remove Photo
                    </button>
                  </div>
                ) : (
                  <button onClick={() => fileInputRef.current?.click()}
                    style={{ width:"100%", background:GV.bg1, border:`2px dashed ${GV.bg3}`,
                      borderRadius:10, padding:"20px", color:GV.fg3, cursor:"pointer",
                      fontFamily:"inherit", fontSize:13 }}>
                    📷 Tap to Add Photo
                  </button>
                )}
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ color:GV.fg3, fontSize:11, letterSpacing:2, display:"block", marginBottom:8 }}>
                  NOTE (optional)
                </label>
                <input value={note} onChange={e=>setNote(e.target.value)}
                  placeholder="What did you find?"
                  style={{ ...inputStyle, width:"100%", display:"block" }} />
              </div>
              {submitError && (
                <div style={{ color:GV.redB, fontSize:12, marginBottom:12 }}>{submitError}</div>
              )}
              <button onClick={handleSubmit} disabled={submitting}
                style={{ width:"100%", background: submitting ? GV.bg2 : GV.orange,
                  border:"none", borderRadius:12, padding:"14px", color:GV.bg0,
                  fontWeight:900, fontSize:15, cursor: submitting ? "default" : "pointer",
                  fontFamily:"inherit" }}>
                {submitting ? "Submitting…" : "Submit Find 👁️"}
              </button>
            </div>
          )}

          {/* BOARD TAB */}
          {tab === "board" && (
            <div>
              <div style={{ color:GV.fg3, fontSize:11, letterSpacing:2, marginBottom:4 }}>LEADERBOARD</div>
              <div style={{ color:GV.fg3, fontSize:11, marginBottom:16 }}>
                {getPeriodLabel(currentPeriodKey, periodMode)}
              </div>
              {leaderboard.length === 0 ? (
                <div style={{ textAlign:"center", color:GV.fg3, padding:40 }}>No scores yet this week!</div>
              ) : leaderboard.map((p, i) => (
                <div key={p.id} style={{ background: i===0 ? GV.bg1 : GV.bg1,
                  border:`1px solid ${i===0 ? GV.yellowB : GV.bg2}`,
                  borderRadius:12, padding:"12px 16px", marginBottom:8,
                  display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ color: i===0 ? GV.yellowB : GV.fg3,
                    fontWeight:900, fontSize:18, width:24, textAlign:"center" }}>
                    {i===0 ? "🏆" : i+1}
                  </div>
                  <PlayerBadge player={p} />
                  <div style={{ marginLeft:"auto", textAlign:"right" }}>
                    <div style={{ color:GV.yellowB, fontWeight:900 }}>{p.total} pts</div>
                    <div style={{ color:GV.fg3, fontSize:11 }}>{p.count} find{p.count!==1?"s":""}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FEED TAB */}
          {tab === "feed" && (
            <div>
              <div style={{ color:GV.fg3, fontSize:11, letterSpacing:2, marginBottom:16 }}>RECENT FINDS</div>
              {submissions.length === 0 ? (
                <div style={{ textAlign:"center", color:GV.fg3, padding:40 }}>
                  No finds yet — go explore! 👁️
                </div>
              ) : submissions.slice(0,30).map(s => {
                const player = players.find(p => p.id === s.playerId);
                return (
                  <div key={s.id} style={{ background:GV.bg1, border:`1px solid ${GV.bg2}`,
                    borderRadius:12, padding:"14px 16px", marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      {player ? <PlayerBadge player={player} /> : <span>{s.playerName}</span>}
                      <span style={{ color:GV.yellowB, fontWeight:900 }}>{s.score} pts</span>
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>
                      {(s.dailyWords || []).map(w => (
                        <span key={w.id} style={{
                          background: s.matchedWords?.some(m => m.id === w.id) ? GV.greenB : GV.bg2,
                          color: s.matchedWords?.some(m => m.id === w.id) ? GV.bg0 : GV.fg3,
                          borderRadius:12, padding:"2px 10px", fontSize:11, fontWeight:700,
                        }}>{w.word}</span>
                      ))}
                    </div>
                    {s.note && <div style={{ color:GV.fg2, fontSize:12, marginBottom:8 }}>{s.note}</div>}
                    <ProofImage imageData={s.imageData} timestamp={s.timestamp} hadImage={s.hasImage} />
                    <ReactionBar submissionId={s.id} reactions={s.reactions} />
                    <div style={{ color:GV.fg3, fontSize:10, marginTop:6 }}>
                      {new Date(s.timestamp).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* RULES TAB */}
          {tab === "rules" && <RulesTab />}

          {/* CHAMPS TAB */}
          {tab === "champs" && <ChampionsTab champions={champions} players={players} />}

        </div>

        {/* BOTTOM NAV */}
        <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
          width:"100%", maxWidth:480, background:GV.bg1,
          borderTop:`1px solid ${GV.bg2}`, display:"flex" }}>
          {NAV.map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ flex:1, background:"transparent", border:"none",
                padding:"10px 4px", color: tab===key ? GV.orangeB : GV.fg3,
                fontWeight: tab===key ? 900 : 400, cursor:"pointer",
                fontFamily:"inherit", fontSize:10, borderTop: tab===key ? `2px solid ${GV.orangeB}` : "2px solid transparent" }}>
              {label}
            </button>
          ))}
        </div>

        {/* PROFILE / EDIT MODAL */}
        {editingCurrentPlayer && (
          <PlayerModal player={currentPlayer} onSave={changes => handleEditPlayer(currentPlayer.id, changes)}
            onRemove={() => handleRemovePlayer(currentPlayer.id)}
            onClose={() => setEditingCurrentPlayer(false)} inputStyle={darkInput} isEdit={true} />
        )}

      </div>
    </ThemeContext.Provider>
  );
}
