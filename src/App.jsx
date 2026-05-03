// ─── EYESPY v1.0.0 ───────────────────────────────────────────────────────────
import { useState, useEffect, createContext, useContext } from "react";
import { db } from "./firebase";
import {
  collection, doc, setDoc, onSnapshot, addDoc,
  query, orderBy, where, updateDoc, deleteDoc,
  arrayUnion, getDocs, writeBatch,
} from "firebase/firestore";

// ─── VERSION ──────────────────────────────────────────────────────────────────
const VERSION = "1.2.3";

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
  // ── DESCRIPTORS (adjectives) ──
  { id:"d001", type:"descriptor", word:"Red"        },
  { id:"d002", type:"descriptor", word:"Blue"       },
  { id:"d003", type:"descriptor", word:"Green"      },
  { id:"d004", type:"descriptor", word:"Yellow"     },
  { id:"d005", type:"descriptor", word:"Orange"     },
  { id:"d006", type:"descriptor", word:"Purple"     },
  { id:"d007", type:"descriptor", word:"Pink"       },
  { id:"d008", type:"descriptor", word:"White"      },
  { id:"d009", type:"descriptor", word:"Black"      },
  { id:"d010", type:"descriptor", word:"Brown"      },
  { id:"d011", type:"descriptor", word:"Gray"       },
  { id:"d012", type:"descriptor", word:"Silver"     },
  { id:"d013", type:"descriptor", word:"Gold"       },
  { id:"d014", type:"descriptor", word:"Teal"       },
  { id:"d015", type:"descriptor", word:"Maroon"     },
  { id:"d016", type:"descriptor", word:"Navy"       },
  { id:"d017", type:"descriptor", word:"Turquoise"  },
  { id:"d018", type:"descriptor", word:"Beige"      },
  { id:"d019", type:"descriptor", word:"Cream"      },
  { id:"d020", type:"descriptor", word:"Colorful"   },
  { id:"d021", type:"descriptor", word:"Tiny"       },
  { id:"d022", type:"descriptor", word:"Giant"      },
  { id:"d023", type:"descriptor", word:"Tall"       },
  { id:"d024", type:"descriptor", word:"Wide"       },
  { id:"d025", type:"descriptor", word:"Flat"       },
  { id:"d026", type:"descriptor", word:"Narrow"     },
  { id:"d027", type:"descriptor", word:"Thick"      },
  { id:"d028", type:"descriptor", word:"Short"      },
  { id:"d029", type:"descriptor", word:"Long"       },
  { id:"d030", type:"descriptor", word:"Deep"       },
  { id:"d031", type:"descriptor", word:"Round"      },
  { id:"d032", type:"descriptor", word:"Square"     },
  { id:"d033", type:"descriptor", word:"Triangular" },
  { id:"d034", type:"descriptor", word:"Oval"       },
  { id:"d035", type:"descriptor", word:"Spiral"     },
  { id:"d036", type:"descriptor", word:"Curved"     },
  { id:"d037", type:"descriptor", word:"Crooked"    },
  { id:"d038", type:"descriptor", word:"Straight"   },
  { id:"d039", type:"descriptor", word:"Jagged"     },
  { id:"d040", type:"descriptor", word:"Hollow"     },
  { id:"d041", type:"descriptor", word:"Shiny"      },
  { id:"d042", type:"descriptor", word:"Rough"      },
  { id:"d043", type:"descriptor", word:"Fuzzy"      },
  { id:"d044", type:"descriptor", word:"Smooth"     },
  { id:"d045", type:"descriptor", word:"Striped"    },
  { id:"d046", type:"descriptor", word:"Spotted"    },
  { id:"d047", type:"descriptor", word:"Bumpy"      },
  { id:"d048", type:"descriptor", word:"Cracked"    },
  { id:"d049", type:"descriptor", word:"Wet"        },
  { id:"d050", type:"descriptor", word:"Rusty"      },
  { id:"d051", type:"descriptor", word:"Dirty"      },
  { id:"d052", type:"descriptor", word:"Soft"       },
  { id:"d053", type:"descriptor", word:"Hard"       },
  { id:"d054", type:"descriptor", word:"Woven"      },
  { id:"d055", type:"descriptor", word:"Faded"      },
  { id:"d056", type:"descriptor", word:"Old"        },
  { id:"d057", type:"descriptor", word:"New"        },
  { id:"d058", type:"descriptor", word:"Bright"     },
  { id:"d059", type:"descriptor", word:"Dark"       },
  { id:"d060", type:"descriptor", word:"Sharp"      },
  { id:"d061", type:"descriptor", word:"Dull"       },
  { id:"d062", type:"descriptor", word:"Puffy"      },
  { id:"d063", type:"descriptor", word:"Transparent"},
  { id:"d064", type:"descriptor", word:"Patterned"  },
  { id:"d065", type:"descriptor", word:"Wooden"     },
  { id:"d066", type:"descriptor", word:"Metal"      },
  { id:"d067", type:"descriptor", word:"Plastic"    },
  { id:"d068", type:"descriptor", word:"Stone"      },
  { id:"d069", type:"descriptor", word:"Rubber"     },
  { id:"d070", type:"descriptor", word:"Fabric"     },
  { id:"d071", type:"descriptor", word:"Concrete"   },
  { id:"d072", type:"descriptor", word:"Brick"      },
  { id:"d073", type:"descriptor", word:"Glass"      },
  { id:"d074", type:"descriptor", word:"Paper"      },
  { id:"d075", type:"descriptor", word:"Leather"    },

  // ── NOUNS ──
  { id:"n001", type:"noun", word:"Door"       },
  { id:"n002", type:"noun", word:"Window"     },
  { id:"n003", type:"noun", word:"Sign"       },
  { id:"n004", type:"noun", word:"Wheel"      },
  { id:"n005", type:"noun", word:"Bottle"     },
  { id:"n006", type:"noun", word:"Box"        },
  { id:"n007", type:"noun", word:"Key"        },
  { id:"n008", type:"noun", word:"Ladder"     },
  { id:"n009", type:"noun", word:"Chair"      },
  { id:"n010", type:"noun", word:"Table"      },
  { id:"n011", type:"noun", word:"Fence"      },
  { id:"n012", type:"noun", word:"Pipe"       },
  { id:"n013", type:"noun", word:"Wire"       },
  { id:"n014", type:"noun", word:"Bucket"     },
  { id:"n015", type:"noun", word:"Hook"       },
  { id:"n016", type:"noun", word:"Rope"       },
  { id:"n017", type:"noun", word:"Bell"       },
  { id:"n018", type:"noun", word:"Nail"       },
  { id:"n019", type:"noun", word:"Bolt"       },
  { id:"n020", type:"noun", word:"Tree"       },
  { id:"n021", type:"noun", word:"Flower"     },
  { id:"n022", type:"noun", word:"Rock"       },
  { id:"n023", type:"noun", word:"Leaf"       },
  { id:"n024", type:"noun", word:"Branch"     },
  { id:"n025", type:"noun", word:"Puddle"     },
  { id:"n026", type:"noun", word:"Vine"       },
  { id:"n027", type:"noun", word:"Shadow"     },
  { id:"n028", type:"noun", word:"Cloud"      },
  { id:"n029", type:"noun", word:"Dog"        },
  { id:"n030", type:"noun", word:"Cat"        },
  { id:"n031", type:"noun", word:"Bird"       },
  { id:"n032", type:"noun", word:"Bug"        },
  { id:"n033", type:"noun", word:"Spider"     },
  { id:"n034", type:"noun", word:"Squirrel"   },
  { id:"n035", type:"noun", word:"Duck"       },
  { id:"n036", type:"noun", word:"Rabbit"     },
  { id:"n037", type:"noun", word:"Deer"       },
  { id:"n038", type:"noun", word:"Frog"       },
  { id:"n039", type:"noun", word:"Can"        },
  { id:"n040", type:"noun", word:"Cup"        },
  { id:"n041", type:"noun", word:"Wrapper"    },
  { id:"n042", type:"noun", word:"Straw"      },
  { id:"n043", type:"noun", word:"Tire"       },
  { id:"n044", type:"noun", word:"Bumper"     },
  { id:"n045", type:"noun", word:"Mirror"     },
  { id:"n046", type:"noun", word:"Antenna"    },
  { id:"n047", type:"noun", word:"Bench"      },
  { id:"n048", type:"noun", word:"Gate"       },
  { id:"n049", type:"noun", word:"Post"       },
  { id:"n050", type:"noun", word:"Step"       },
  { id:"n051", type:"noun", word:"Wall"       },
  { id:"n052", type:"noun", word:"Roof"       },
  { id:"n053", type:"noun", word:"Chimney"    },
  { id:"n054", type:"noun", word:"Drain"      },
  { id:"n055", type:"noun", word:"Crack"      },
  { id:"n056", type:"noun", word:"Pile"       },
  { id:"n057", type:"noun", word:"Stack"      },
  { id:"n058", type:"noun", word:"Bundle"     },
  { id:"n059", type:"noun", word:"Puddle"     },
  { id:"n060", type:"noun", word:"Patch"      },
  { id:"n061", type:"noun", word:"Bridge"     },
  { id:"n062", type:"noun", word:"Tunnel"     },
  { id:"n063", type:"noun", word:"Pole"       },
  { id:"n064", type:"noun", word:"Cone"       },
  { id:"n065", type:"noun", word:"Barrel"     },
  { id:"n066", type:"noun", word:"Crate"      },
  { id:"n067", type:"noun", word:"Shed"       },
  { id:"n068", type:"noun", word:"Hydrant"    },
  { id:"n069", type:"noun", word:"Mailbox"    },
  { id:"n070", type:"noun", word:"Dumpster"   },
  { id:"n071", type:"noun", word:"Cart"       },
  { id:"n072", type:"noun", word:"Tarp"       },
  { id:"n073", type:"noun", word:"Flag"       },
  { id:"n074", type:"noun", word:"Lock"       },
  { id:"n075", type:"noun", word:"Hose"       },

  // ── VERBS / STATES ──
  { id:"v001", type:"verb", word:"Leaning"     },
  { id:"v002", type:"verb", word:"Stacked"     },
  { id:"v003", type:"verb", word:"Moving"      },
  { id:"v004", type:"verb", word:"Open"        },
  { id:"v005", type:"verb", word:"Closed"      },
  { id:"v006", type:"verb", word:"Hanging"     },
  { id:"v007", type:"verb", word:"Spinning"    },
  { id:"v008", type:"verb", word:"Dripping"    },
  { id:"v009", type:"verb", word:"Folded"      },
  { id:"v010", type:"verb", word:"Tangled"     },
  { id:"v011", type:"verb", word:"Broken"      },
  { id:"v012", type:"verb", word:"Locked"      },
  { id:"v013", type:"verb", word:"Chained"     },
  { id:"v014", type:"verb", word:"Parked"      },
  { id:"v015", type:"verb", word:"Floating"    },
  { id:"v016", type:"verb", word:"Growing"     },
  { id:"v017", type:"verb", word:"Fallen"      },
  { id:"v018", type:"verb", word:"Buried"      },
  { id:"v019", type:"verb", word:"Wrapped"     },
  { id:"v020", type:"verb", word:"Tied"        },
  { id:"v021", type:"verb", word:"Painted"     },
  { id:"v022", type:"verb", word:"Bent"        },
  { id:"v023", type:"verb", word:"Twisted"     },
  { id:"v024", type:"verb", word:"Balanced"    },
  { id:"v025", type:"verb", word:"Scattered"   },
  { id:"v026", type:"verb", word:"Grouped"     },
  { id:"v027", type:"verb", word:"Upside-down" },
  { id:"v028", type:"verb", word:"Overflowing" },
  { id:"v029", type:"verb", word:"Rusted"      },
  { id:"v030", type:"verb", word:"Fenced"      },
  { id:"v031", type:"verb", word:"Abandoned"   },
  { id:"v032", type:"verb", word:"Patched"     },
  { id:"v033", type:"verb", word:"Labeled"     },
  { id:"v034", type:"verb", word:"Numbered"    },
  { id:"v035", type:"verb", word:"Attached"    },
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
    version: "1.2.3",
    entries: [
      "Photo submission now lets you choose from your camera roll or take a new photo",
    ],
  },
  {
    version: "1.2.2",
    entries: [
      "Update notifications now show only the latest changes instead of full history",
    ],
  },
  {
    version: "1.2.1",
    entries: [
      "Tap the EYESPY title anywhere to open the About sheet",
      "About sheet shows version, description, credits, terms, and full version history",
      "Tap any player on the leaderboard to view their stats and recent finds",
    ],
  },
  {
    version: "1.2.0",
    entries: [
      "Redesigned word bank — words are now Descriptors, Nouns, and Verbs/States for richer daily combos",
      "Streak bonus — submit 3+ days in a row for +2 pts on your first find each day 🔥",
      "Duplicate prevention — same word combination cannot be submitted twice in one day",
      "Images now purged from the database after 48 hours, not just hidden",
      "Word categories hidden from UI — just the word, no spoilers",
      "Suggest a Word — players can submit words for admin approval",
      "Admin Words panel — approve or reject player word suggestions",
    ],
  },
  {
    version: "1.1.1",
    entries: [
      "Responsive layout fixes — app now fits all screen sizes correctly",
      "Nav tabs scroll horizontally when Admin tab is visible",
      "First player created is automatically set as admin",
    ],
  },
  {
    version: "1.1.0",
    entries: [
      "Profile sheet — tap your avatar to see stats, switch games, toggle theme, or switch player",
      "Admin tab — manage players, view games, reset submissions and champions (PIN required)",
      "Theme toggle now accessible from the profile sheet",
    ],
  },
  {
    version: "1.0.2",
    entries: [
      "Daily words are now identical for all players on the same day — no more race conditions",
      "PWA manifest added — install EyeSpy to your home screen for the best experience",
      "Improved home screen icon support on iOS and Android",
    ],
  },
  {
    version: "1.0.1",
    entries: [
      "Nav moved to top of screen",
      "Join codes are now shown to game creators and can be edited to something memorable",
      "Submissions now appear correctly in Feed and Board",
      "App icon added",
    ],
  },
  {
    version: "1.0.0",
    entries: [
      "EyeSpy is live! Find real-world objects matching today's daily words.",
      "Score points for every descriptor you match — match them all for a bonus!",
      "Create or join a game with friends and family using a join code.",
      "Weekly leaderboard resets every Monday at 4 AM CST.",
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
function seededRandom(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return function() {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) | 0;
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) | 0;
    return ((h ^ (h >>> 16)) >>> 0) / 0xffffffff;
  };
}

function generateDailyWordsFromBank(bank, dateKey) {
  const rand = seededRandom(dateKey);
  const descriptors = bank.filter(w => w.type === "descriptor");
  const nouns       = bank.filter(w => w.type === "noun");
  const verbs       = bank.filter(w => w.type === "verb");

  function pick(pool, n) {
    const shuffled = [...pool].sort(() => rand() - 0.5);
    return shuffled.slice(0, n);
  }

  const dCount = rand() > 0.4 ? 2 : 1;
  const nCount = rand() > 0.4 ? 2 : 1;
  const vCount = rand() > 0.5 ? 1 : 0;

  return [
    ...pick(descriptors, dCount),
    ...pick(nouns, nCount),
    ...pick(verbs, vCount),
  ];
}

// ─── SCORING ─────────────────────────────────────────────────────────────────
const MATCH_POINTS = [0, 1, 4, 10, 20, 35];

function getStreakLength(submissions, playerId) {
  const days = [...new Set(
    submissions
      .filter(s => s.playerId === playerId)
      .map(s => {
        const d = new Date(s.timestamp);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
      })
  )].sort();

  if (days.length === 0) return 0;

  const today = getTodayKey();
  const yesterday = (() => {
    const d = new Date(); d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  })();

  if (!days.includes(today) && !days.includes(yesterday)) return 0;

  let streak = 1;
  for (let i = days.length - 1; i > 0; i--) {
    const curr = new Date(days[i]);
    const prev = new Date(days[i - 1]);
    const diff = Math.round((curr - prev) / 86400000);
    if (diff === 1) { streak++; }
    else { break; }
  }
  return streak;
}

function getStreakBonus(submissions, playerId) {
  const streak = getStreakLength(submissions, playerId);
  if (streak < 3) return 0;
  const today = getTodayKey();
  const alreadySubmittedToday = submissions.some(s => {
    if (s.playerId !== playerId) return false;
    const d = new Date(s.timestamp);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    return key === today;
  });
  return alreadySubmittedToday ? 0 : 2;
}

function scoreSubmission(matchedCount, totalWords, streakBonus = 0) {
  const base = MATCH_POINTS[Math.min(matchedCount, 5)] || 0;
  const fullBonus = matchedCount === totalWords && totalWords > 0 ? 5 : 0;
  const total = base + fullBonus + streakBonus;
  return { base, fullBonus, streakBonus, total, matchedCount, totalWords };
}

function hasDuplicateMatchToday(submissions, playerId, matchedWordIds, dailyKey) {
  if (!matchedWordIds || matchedWordIds.length === 0) return false;
  const sorted = [...matchedWordIds].sort().join(",");
  return submissions.some(s => {
    if (s.playerId !== playerId) return false;
    if (s.dailyKey !== dailyKey) return false;
    const prevSorted = [...(s.matchedWords || []).map(w => w.id)].sort().join(",");
    return prevSorted === sorted;
  });
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
function WelcomeModal({ isFirstTime, onAccept, onTitleClick }) {
  const GV = useContext(ThemeContext);
  const latestEntry = CHANGELOG[0];

  return (
    <div style={{ background:GV.bg0, minHeight:"100vh", display:"flex",
      alignItems:"center", justifyContent:"center", padding:"24px 16px",
      fontFamily:"'Courier Prime',monospace", boxSizing:"border-box",
      width:"100%" }}>
      <div style={{ maxWidth:400, width:"100%" }}>

        {/* Title */}
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <button onClick={onTitleClick} style={{ background:"none",
            border:"none", cursor:"pointer", padding:0,
            fontFamily:"inherit" }}>
            <span style={{ fontSize:40 }}>👁️</span>
            <div style={{ fontSize:28, fontWeight:900, color:GV.orangeB,
              letterSpacing:2 }}>EYESPY</div>
          </button>
          <div style={{ color:GV.fg3, fontSize:11, letterSpacing:3 }}>
            SCAVENGER HUNT
          </div>
        </div>

        {/* Changelog section */}
        <div style={{ marginBottom:20 }}>
          {isFirstTime ? (
            <>
              <div style={{ color:GV.yellowB, fontSize:12, fontWeight:700,
                marginBottom:8 }}>
                Welcome to EyeSpy!
              </div>
              {latestEntry.entries.map((e,i) => (
                <div key={i} style={{ color:GV.fg1, fontSize:12,
                  marginBottom:4, paddingLeft:12 }}>• {e}</div>
              ))}
            </>
          ) : (
            <>
              <div style={{ color:GV.yellowB, fontSize:12, fontWeight:700,
                marginBottom:4 }}>
                Updated to v{latestEntry.version}
              </div>
              <div style={{ color:GV.fg3, fontSize:10, letterSpacing:1,
                marginBottom:10 }}>
                WHAT'S NEW
              </div>
              {latestEntry.entries.map((e,i) => (
                <div key={i} style={{ color:GV.fg1, fontSize:12,
                  marginBottom:4, paddingLeft:12 }}>• {e}</div>
              ))}
            </>
          )}
        </div>

        {/* Terms */}
        <div style={{ background:GV.bg1, borderRadius:10, padding:12,
          marginBottom:20, color:GV.fg3, fontSize:11, lineHeight:1.6 }}>
          By playing EyeSpy you agree to keep it fun, family-friendly,
          and safe. Only photograph things you are allowed to photograph.
          Play responsibly.
        </div>

        {/* Button */}
        <button onClick={onAccept}
          style={{ width:"100%", background:GV.orange, border:"none",
            borderRadius:12, padding:"14px", color:GV.bg0, fontWeight:900,
            fontSize:16, cursor:"pointer", fontFamily:"inherit",
            letterSpacing:1 }}>
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
    <div style={{ background:GV_DARK.bg0, minHeight:"100vh", padding:"24px 16px",
      fontFamily:"'Courier Prime',monospace", color:GV_DARK.fg,
      boxSizing:"border-box", width:"100%" }}>
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
function GameSelectScreen({ player, games, gamesLoaded, onSelect, onCreateGame, onJoinGame, onSwitchPlayer, onEditGameCode }) {
  const GV = useContext(ThemeContext);
  return (
    <div style={{ background:GV.bg0, minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", padding:"24px 16px",
      fontFamily:"'Courier Prime',monospace", boxSizing:"border-box", width:"100%" }}>
      <div style={{ marginBottom:32, textAlign:"center" }}>
        <span style={{ fontSize:36 }}>👁️</span>
        <div style={{ fontSize:28, fontWeight:900, color:GV.orangeB, letterSpacing:2 }}>EYESPY</div>
        <div style={{ color:GV.fg3, fontSize:11, letterSpacing:3, marginBottom:12 }}>PLAYING AS</div>
        <div style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"center" }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:player.color+"33",
            border:`2px solid ${player.color}`, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:14 }}>{player.emoji}</div>
          <span style={{ color:player.color, fontWeight:700, fontSize:16 }}>{player.name}</span>
        </div>
      </div>

      {!gamesLoaded && (
        <div style={{ color:GV.fg3, fontSize:13, marginBottom:24 }}>Loading games…</div>
      )}

      {gamesLoaded && games.length > 0 && (
        <div style={{ width:"100%", maxWidth:400, marginBottom:24 }}>
          <div style={{ color:GV.fg3, fontSize:11, letterSpacing:3, marginBottom:12 }}>SELECT GAME</div>
          {games.map(g => (
            <div key={g.id} style={{ marginBottom:10 }}>
              <button onClick={() => onSelect(g)} style={{
                width:"100%", padding:"16px 20px",
                background:GV.bg1, border:`2px solid ${GV.bg2}`,
                borderRadius:14, cursor:"pointer", display:"flex", alignItems:"center",
                gap:14, fontFamily:"inherit",
              }}>
                <span style={{ fontSize:22 }}>👁️</span>
                <div style={{ flex:1, textAlign:"left" }}>
                  <div style={{ color:GV.fg, fontWeight:700, fontSize:15 }}>{g.name}</div>
                  <div style={{ color:GV.fg3, fontSize:11, marginTop:2 }}>
                    {g.members?.length || 0} player{g.members?.length !== 1 ? "s" : ""} · {g.periodMode || "weekly"}
                  </div>
                </div>
                <span style={{ color:GV.orangeB, fontSize:18 }}>›</span>
              </button>
              {g.createdBy === player.id && (
                <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 8px",
                  background:GV.bg0, borderRadius:"0 0 10px 10px",
                  border:`1px solid ${GV.bg2}`, borderTop:"none" }}>
                  <span style={{ color:GV.fg3, fontSize:10, letterSpacing:1 }}>CODE:</span>
                  <span style={{ color:GV.yellowB, fontWeight:900, letterSpacing:3, fontSize:13 }}>{g.joinCode}</span>
                  <button onClick={() => onEditGameCode(g)}
                    style={{ marginLeft:"auto", background:"transparent", border:`1px solid ${GV.bg3}`,
                      borderRadius:6, padding:"2px 8px", color:GV.fg3, fontSize:10,
                      cursor:"pointer", fontFamily:"inherit" }}>
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {gamesLoaded && games.length === 0 && (
        <div style={{ color:GV.fg3, fontSize:13, marginBottom:24, textAlign:"center" }}>
          No games yet — create one or join with a code!
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:10, width:"100%", maxWidth:400 }}>
        <button onClick={onJoinGame} style={{
          padding:"13px", background:"transparent",
          border:`1px solid ${GV.blueB}`, borderRadius:12, color:GV.blueB,
          fontSize:13, cursor:"pointer", fontFamily:"inherit", letterSpacing:1,
        }}>Join a Game →</button>
        <button onClick={onCreateGame} style={{
          padding:"13px", background:`linear-gradient(135deg,${GV.orange},${GV.orangeB})`,
          border:"none", borderRadius:12, color:GV.bg0,
          fontSize:13, fontWeight:900, cursor:"pointer", fontFamily:"inherit", letterSpacing:1,
        }}>+ Create New Game</button>
        <button onClick={onSwitchPlayer} style={{
          padding:"10px", background:"transparent",
          border:"none", color:GV.fg3,
          fontSize:12, cursor:"pointer", fontFamily:"inherit",
        }}>Switch Player</button>
      </div>
    </div>
  );
}

// ─── CREATE GAME MODAL ────────────────────────────────────────────────────────
function CreateGameModal({ onSave, onClose, inputStyle }) {
  const GV = useContext(ThemeContext);
  const [name, setName] = useState("");
  const [code, setCode] = useState(() => Math.random().toString(36).substring(2,8).toUpperCase());
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!name.trim() || !code.trim()) return;
    setSaving(true);
    await onSave({ name: name.trim(), periodMode: "weekly", joinCode: code.trim().toUpperCase() });
    setSaving(false);
  }

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)",
      zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:GV_DARK.bg1,
        border:`1px solid ${GV_DARK.bg2}`, borderRadius:16, padding:24, width:"100%", maxWidth:400 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <span style={{ color:GV_DARK.fg, fontWeight:700, fontSize:16 }}>Create Game</span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:GV_DARK.fg3, fontSize:20, cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ color:GV_DARK.fg3, fontSize:11, letterSpacing:2, display:"block", marginBottom:8 }}>GAME NAME</label>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. GrandPappy Family"
            style={{ ...inputStyle, width:"100%", boxSizing:"border-box" }} />
        </div>
        <div style={{ marginBottom:24 }}>
          <label style={{ color:GV_DARK.fg3, fontSize:11, letterSpacing:2, display:"block", marginBottom:4 }}>JOIN CODE</label>
          <div style={{ color:GV_DARK.fg3, fontSize:10, marginBottom:8 }}>
            Auto-generated — edit to make it memorable (e.g. FAMILY)
          </div>
          <input value={code}
            onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,12))}
            placeholder="JOIN CODE"
            style={{ ...inputStyle, width:"100%", boxSizing:"border-box",
              letterSpacing:4, fontSize:18, textAlign:"center", fontWeight:700 }} />
        </div>
        <button onClick={handleCreate} disabled={saving || !name.trim() || !code.trim()}
          style={{ width:"100%", padding:"13px",
            background: saving || !name.trim() ? GV_DARK.bg2 : `linear-gradient(135deg,${GV_DARK.orange},${GV_DARK.orangeB})`,
            border:"none", borderRadius:12, color:GV_DARK.bg0, fontSize:14,
            fontWeight:900, letterSpacing:2, cursor: saving ? "not-allowed" : "pointer", fontFamily:"inherit" }}>
          {saving ? "CREATING…" : "CREATE GAME"}
        </button>
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

// ─── ABOUT SHEET ──────────────────────────────────────────────────────────────
function AboutSheet({ onClose }) {
  const GV = useContext(ThemeContext);
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0,
      background:"rgba(0,0,0,0.75)", zIndex:300,
      display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:GV.bg1, borderRadius:"16px 16px 0 0",
        width:"100%", maxWidth:480, padding:"28px 24px 48px",
        maxHeight:"85vh", overflowY:"auto",
      }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"flex-start",
          justifyContent:"space-between", marginBottom:24 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <span style={{ fontSize:44 }}>👁️</span>
            <div>
              <div style={{ fontSize:26, fontWeight:900, color:GV.orangeB,
                letterSpacing:2, lineHeight:1 }}>EYESPY</div>
              <div style={{ color:GV.fg3, fontSize:11, letterSpacing:3,
                marginTop:4 }}>SCAVENGER HUNT</div>
              <div style={{ color:GV.yellowB, fontSize:12, fontWeight:700,
                marginTop:4 }}>v{VERSION}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none",
            color:GV.fg3, fontSize:22, cursor:"pointer", padding:4,
            lineHeight:1 }}>✕</button>
        </div>

        {/* Tagline */}
        <div style={{ background:GV.bg0, borderRadius:12,
          padding:"14px 16px", marginBottom:20,
          borderLeft:`3px solid ${GV.orangeB}` }}>
          <div style={{ color:GV.fg, fontSize:13, lineHeight:1.7 }}>
            A daily real-world scavenger hunt. Each day brings a fresh set
            of words — find something in the wild that matches as many as
            possible, snap a photo, and score points. Compete with family
            and friends on a weekly leaderboard.
          </div>
        </div>

        {/* Credits */}
        <div style={{ marginBottom:20 }}>
          <div style={{ color:GV.fg3, fontSize:11, letterSpacing:2,
            marginBottom:10 }}>MADE BY</div>
          <div style={{ background:GV.bg0, borderRadius:12,
            padding:"14px 16px" }}>
            <div style={{ color:GV.fg, fontWeight:700, fontSize:14,
              marginBottom:4 }}>👴 GrandPappyJay</div>
            <div style={{ color:GV.fg3, fontSize:12, lineHeight:1.6 }}>
              A GrandPappyLabs game — built for family and friends.
              If you're playing this, you probably know Jason. 👋
            </div>
          </div>
        </div>

        {/* Sister game */}
        <div style={{ marginBottom:20 }}>
          <div style={{ color:GV.fg3, fontSize:11, letterSpacing:2,
            marginBottom:10 }}>SISTER GAME</div>
          <div style={{ background:GV.bg0, borderRadius:12,
            padding:"14px 16px",
            border:`1px solid ${GV.bg2}` }}>
            <div style={{ color:GV.yellowB, fontWeight:700,
              fontSize:14, marginBottom:4 }}>🎲 Clocktzee</div>
            <div style={{ color:GV.fg3, fontSize:12, lineHeight:1.6 }}>
              A live number-hunting game inspired by Yahtzee.
              Photograph numbers you spot in the wild and score
              points based on digit patterns.
            </div>
          </div>
        </div>

        {/* Terms / Waiver */}
        <div style={{ marginBottom:20 }}>
          <div style={{ color:GV.fg3, fontSize:11, letterSpacing:2,
            marginBottom:10 }}>TERMS OF PLAY</div>
          <div style={{ background:GV.bg0, borderRadius:12,
            padding:"14px 16px", color:GV.fg3, fontSize:12,
            lineHeight:1.8 }}>
            By playing EyeSpy you agree to keep it fun, family-friendly,
            and safe. Only photograph things and places you are permitted
            to photograph. Never put yourself or others in danger to get
            a photo. Play responsibly and respect those around you.
            GrandPappyLabs is not responsible for anything that happens
            while you are out hunting. Have fun. 👁️
          </div>
        </div>

        {/* Version history */}
        <div>
          <div style={{ color:GV.fg3, fontSize:11, letterSpacing:2,
            marginBottom:10 }}>VERSION HISTORY</div>
          {CHANGELOG.map(c => (
            <div key={c.version} style={{ marginBottom:12 }}>
              <div style={{ color:GV.yellowB, fontSize:11, fontWeight:700,
                marginBottom:6 }}>v{c.version}</div>
              {c.entries.map((e,i) => (
                <div key={i} style={{ color:GV.fg2, fontSize:11,
                  marginBottom:3, paddingLeft:10 }}>• {e}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PLAYER PROFILE SHEET ─────────────────────────────────────────────────────
function PlayerProfileSheet({ player, submissions, onClose }) {
  const GV = useContext(ThemeContext);
  const subs = submissions.filter(s => s.playerId === player.id);
  const total = subs.reduce((a,s) => a + s.score, 0);
  const best  = subs.length ? Math.max(...subs.map(s => s.score)) : 0;
  const streak = getStreakLength(submissions, player.id);
  const fullMatches = subs.filter(s =>
    s.scoreDetail?.matchedCount === s.scoreDetail?.totalWords &&
    s.scoreDetail?.totalWords > 0
  ).length;

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0,
      background:"rgba(0,0,0,0.75)", zIndex:300,
      display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:GV.bg1,
        border:`1px solid ${player.color}44`,
        borderRadius:"16px 16px 0 0", width:"100%", maxWidth:480,
        padding:"24px 20px 48px", maxHeight:"85vh", overflowY:"auto",
      }}>
        {/* Player header */}
        <div style={{ display:"flex", alignItems:"center",
          gap:14, marginBottom:20 }}>
          <div style={{ width:52, height:52, borderRadius:"50%",
            background:player.color+"33",
            border:`3px solid ${player.color}`,
            display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:26 }}>
            {player.emoji}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:900, fontSize:20,
              color:GV.fg }}>{player.name}</div>
            <div style={{ color:player.color, fontSize:12, marginTop:2 }}>
              {subs.length} find{subs.length !== 1 ? "s" : ""} total
              {streak >= 3 && (
                <span style={{ marginLeft:8 }}>🔥 {streak} day streak</span>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none",
            border:"none", color:GV.fg3, fontSize:22,
            cursor:"pointer", padding:4 }}>✕</button>
        </div>

        {/* Stats row */}
        <div style={{ display:"flex", gap:10, marginBottom:20 }}>
          {[
            ["TOTAL PTS",  total],
            ["BEST FIND",  `+${best}`],
            ["FULL MATCH", fullMatches],
            ["STREAK",     streak >= 3 ? `🔥${streak}` : streak],
          ].map(([label, val]) => (
            <div key={label} style={{ flex:1, background:GV.bg0,
              borderRadius:10, padding:"10px 8px", textAlign:"center" }}>
              <div style={{ color:player.color, fontWeight:900,
                fontSize:18, fontFamily:"'Courier Prime',monospace" }}>
                {val}
              </div>
              <div style={{ color:GV.fg3, fontSize:9,
                letterSpacing:1, marginTop:2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Recent finds */}
        <div style={{ color:GV.fg3, fontSize:11, letterSpacing:2,
          marginBottom:12 }}>RECENT FINDS</div>
        {subs.length === 0 ? (
          <div style={{ color:GV.fg3, textAlign:"center",
            padding:"30px 0", fontSize:13 }}>No finds yet!</div>
        ) : subs.slice(0, 10).map(s => {
          const dt = new Date(s.timestamp);
          return (
            <div key={s.id} style={{ padding:"10px 0",
              borderBottom:`1px solid ${GV.bg0}` }}>
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"flex-start", marginBottom:4 }}>
                <div style={{ display:"flex", flexWrap:"wrap", gap:4, flex:1 }}>
                  {(s.dailyWords || []).map(w => (
                    <span key={w.id} style={{
                      background: s.matchedWords?.some(m => m.id === w.id)
                        ? GV.greenB : GV.bg1,
                      color: s.matchedWords?.some(m => m.id === w.id)
                        ? GV.bg0 : GV.fg3,
                      borderRadius:10, padding:"2px 8px",
                      fontSize:10, fontWeight:700,
                    }}>{w.word}</span>
                  ))}
                </div>
                <span style={{ color:GV.yellowB, fontWeight:900,
                  fontSize:16, marginLeft:8, flexShrink:0 }}>
                  +{s.score}
                </span>
              </div>
              {s.note && (
                <div style={{ color:GV.fg3, fontSize:11,
                  fontStyle:"italic", marginBottom:2 }}>
                  "{s.note}"
                </div>
              )}
              <div style={{ color:GV.fg3, fontSize:10 }}>
                {dt.toLocaleDateString("en-US", {
                  month:"short", day:"numeric",
                  hour:"2-digit", minute:"2-digit"
                })}
                {s.scoreDetail?.streakBonus > 0 && (
                  <span style={{ color:GV.orangeB,
                    marginLeft:6 }}>🔥 streak bonus</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SUGGEST WORD MODAL ───────────────────────────────────────────────────────
function SuggestWordModal({ onClose, playerId, playerName, inputStyle }) {
  const GV = useContext(ThemeContext);
  const [word, setWord] = useState("");
  const [type, setType] = useState("descriptor");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit() {
    if (!word.trim()) return;
    setSaving(true);
    await addDoc(collection(db, "wordBank"), {
      word: word.trim(),
      type,
      approved: false,
      suggestedBy: playerName,
      suggestedById: playerId,
      suggestedAt: new Date().toISOString(),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(onClose, 1500);
  }

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0,
      background:"rgba(0,0,0,0.88)", zIndex:300,
      display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:GV_DARK.bg1,
        border:`1px solid ${GV_DARK.bg2}`, borderRadius:16, padding:24,
        width:"100%", maxWidth:360 }}>
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:16 }}>
          <span style={{ color:GV_DARK.fg, fontWeight:700, fontSize:16 }}>
            Suggest a Word
          </span>
          <button onClick={onClose} style={{ background:"none", border:"none",
            color:GV_DARK.fg3, fontSize:20, cursor:"pointer" }}>✕</button>
        </div>
        {saved ? (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ fontSize:32, marginBottom:8 }}>✅</div>
            <div style={{ color:GV_DARK.greenB, fontWeight:700 }}>
              Word submitted for review!
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom:16 }}>
              <label style={{ color:GV_DARK.fg3, fontSize:11, letterSpacing:2,
                display:"block", marginBottom:8 }}>WORD TYPE</label>
              <div style={{ display:"flex", gap:8 }}>
                {[["descriptor","Descriptor"],["noun","Noun"],["verb","Verb/State"]].map(([val,label]) => (
                  <button key={val} onClick={() => setType(val)}
                    style={{ flex:1, padding:"8px 4px",
                      background: type===val ? `${GV_DARK.orangeB}22` : "transparent",
                      border:`1px solid ${type===val ? GV_DARK.orangeB : GV_DARK.bg2}`,
                      borderRadius:8, color: type===val ? GV_DARK.orangeB : GV_DARK.fg3,
                      fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ color:GV_DARK.fg3, fontSize:11, letterSpacing:2,
                display:"block", marginBottom:8 }}>WORD</label>
              <input value={word}
                onChange={e => setWord(e.target.value.slice(0,20))}
                placeholder={
                  type==="descriptor" ? "e.g. Sparkly" :
                  type==="noun" ? "e.g. Mailbox" : "e.g. Spinning"
                }
                style={{ ...inputStyle, width:"100%", boxSizing:"border-box" }} />
            </div>
            <button onClick={handleSubmit} disabled={saving || !word.trim()}
              style={{ width:"100%", padding:"13px",
                background: !word.trim() ? GV_DARK.bg2 :
                  `linear-gradient(135deg,${GV_DARK.orange},${GV_DARK.orangeB})`,
                border:"none", borderRadius:12, color:GV_DARK.bg0, fontSize:14,
                fontWeight:900, cursor: !word.trim() ? "default" : "pointer",
                fontFamily:"inherit" }}>
              {saving ? "Submitting…" : "Submit for Review"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── RULES TAB ────────────────────────────────────────────────────────────────
function RulesTab({ onSuggestWord }) {
  const GV = useContext(ThemeContext);
  const S = {
    section: { marginBottom:24 },
    heading: { color:GV.orangeB, fontWeight:900, fontSize:13,
      letterSpacing:2, marginBottom:10 },
    body: { color:GV.fg1, fontSize:13, lineHeight:1.7 },
  };
  return (
    <div>
      <div style={S.section}>
        <div style={S.heading}>HOW TO PLAY</div>
        <div style={S.body}>
          Each day EyeSpy gives you a set of words — a mix of descriptors,
          nouns, and verbs. Go out into the real world and find something
          that matches as many of those words as possible. Snap a photo as
          proof, tag the words you matched, and submit!
        </div>
      </div>
      <div style={S.section}>
        <div style={S.heading}>SCORING</div>
        {[
          ["1 match","1 pt"],
          ["2 matches","4 pts"],
          ["3 matches","10 pts"],
          ["4 matches","20 pts"],
          ["5 matches","35 pts"],
        ].map(([k,v]) => (
          <div key={k} style={{ display:"flex", justifyContent:"space-between",
            color:GV.fg1, fontSize:13, marginBottom:4 }}>
            <span>{k}</span>
            <span style={{ color:GV.yellowB, fontWeight:700 }}>{v}</span>
          </div>
        ))}
        <div style={{ color:GV.greenB, fontSize:12, marginTop:8 }}>
          +5 bonus for matching ALL words of the day!
        </div>
      </div>
      <div style={S.section}>
        <div style={S.heading}>STREAK BONUS 🔥</div>
        <div style={S.body}>
          Submit a find on 3 or more consecutive days to build a streak.
          Your first submission each day on a streak earns a +2 point bonus.
          Miss a day and your streak resets!
        </div>
      </div>
      <div style={S.section}>
        <div style={S.heading}>DUPLICATE RULE</div>
        <div style={S.body}>
          You may submit multiple finds per day, but you cannot reuse the
          exact same combination of matched words. For example, matching
          "Red + Round" twice is not allowed — but "Red + Round" and
          "Red + Broken" are both fine since the combos are different.
        </div>
      </div>
      <div style={S.section}>
        <div style={S.heading}>WORD TYPES</div>
        <div style={S.body}>
          Each day's words are drawn from three types: Descriptors
          (colors, textures, sizes), Nouns (objects, animals, things),
          and Verbs/States (actions or conditions). Every day has a
          different mix!
        </div>
      </div>
      <div style={S.section}>
        <div style={S.heading}>LEADERBOARD</div>
        <div style={S.body}>
          Scores reset every Monday at 4:00 AM CST. The weekly champion
          is crowned for Top Score 🏆 and Most Finds 📸.
        </div>
      </div>
      <button onClick={onSuggestWord}
        style={{ width:"100%", marginTop:8, background:"transparent",
          border:`1px solid ${GV.bg2}`, borderRadius:12, padding:"11px",
          color:GV.fg3, cursor:"pointer", fontFamily:"inherit", fontSize:12 }}>
        💡 Suggest a Word for the Bank
      </button>
    </div>
  );
}

// ─── PROFILE SHEET ────────────────────────────────────────────────────────────
function ProfileSheet({ player, submissions, games, activeGame, onClose,
  onEdit, onLogout, onThemeToggle, onSwitchGame, onJoinGame, onCreateGame }) {
  const GV = useContext(ThemeContext);
  const subs = submissions.filter(s => s.playerId === player.id);
  const total = subs.reduce((a,s) => a + s.score, 0);
  const best  = subs.length ? Math.max(...subs.map(s => s.score)) : 0;
  const fullMatches = subs.filter(s =>
    s.scoreDetail?.matchedCount === s.scoreDetail?.totalWords && s.scoreDetail?.totalWords > 0
  ).length;

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)",
      zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:GV.bg1, border:`1px solid ${player.color}55`,
        borderRadius:"16px 16px 0 0", width:"100%", maxWidth:480,
        padding:"24px 20px 40px", maxHeight:"85vh", overflowY:"auto",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
          <div style={{ width:52, height:52, borderRadius:"50%", background:player.color+"33",
            border:`3px solid ${player.color}`, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:26 }}>{player.emoji}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:900, fontSize:20, color:GV.fg }}>{player.name}</div>
            <div style={{ color:player.color, fontSize:12, marginTop:2 }}>{subs.length} finds total</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none",
            color:GV.fg3, fontSize:22, cursor:"pointer", padding:4 }}>✕</button>
        </div>

        <div style={{ display:"flex", gap:10, marginBottom:20 }}>
          {[["TOTAL PTS", total], ["BEST FIND", `+${best}`], ["FULL MATCH", fullMatches]].map(([label,val]) => (
            <div key={label} style={{ flex:1, background:"rgba(0,0,0,0.2)", borderRadius:10,
              padding:"10px 12px", textAlign:"center" }}>
              <div style={{ color:player.color, fontWeight:900, fontSize:20,
                fontFamily:"'Courier Prime',monospace" }}>{val}</div>
              <div style={{ color:GV.fg3, fontSize:9, letterSpacing:1, marginTop:2 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:20 }}>
          <div style={{ color:GV.fg3, fontSize:10, letterSpacing:2, marginBottom:10 }}>MY GAMES</div>
          {games.map(g => (
            <div key={g.id} style={{ display:"flex", alignItems:"center", gap:10,
              padding:"10px 14px", borderRadius:10, marginBottom:6,
              background: g.id===activeGame?.id ? `${GV.orangeB}18` : GV.bg0,
              border:`1px solid ${g.id===activeGame?.id ? GV.orangeB+"66" : GV.bg2}` }}>
              <span style={{ color:GV.fg, flex:1, fontSize:13 }}>👁️ {g.name}</span>
              {g.id===activeGame?.id
                ? <span style={{ color:GV.orangeB, fontSize:11, letterSpacing:1 }}>ACTIVE</span>
                : <button onClick={() => { onSwitchGame(g); onClose(); }}
                    style={{ padding:"5px 10px", background:"transparent",
                      border:`1px solid ${GV.bg2}`, borderRadius:8,
                      color:GV.fg3, fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>
                    Switch
                  </button>
              }
            </div>
          ))}
          <div style={{ display:"flex", gap:8, marginTop:8 }}>
            <button onClick={() => { onJoinGame(); onClose(); }} style={{
              flex:1, padding:"9px", background:"transparent",
              border:`1px solid ${GV.blueB}`, borderRadius:10, color:GV.blueB,
              fontSize:12, cursor:"pointer", fontFamily:"inherit",
            }}>Join a Game</button>
            <button onClick={() => { onCreateGame(); onClose(); }} style={{
              flex:1, padding:"9px", background:"transparent",
              border:`1px solid ${GV.orangeB}`, borderRadius:10, color:GV.orangeB,
              fontSize:12, cursor:"pointer", fontFamily:"inherit",
            }}>+ Create Game</button>
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <button onClick={onEdit} style={{ padding:"12px", background:"transparent",
            border:`1px solid ${GV.bg2}`, borderRadius:12, color:GV.fg,
            fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
            ✏️ Edit Profile
          </button>
          <button onClick={onThemeToggle} style={{ padding:"12px", background:"transparent",
            border:`1px solid ${GV.bg2}`, borderRadius:12, color:GV.fg,
            fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
            {player.theme === "light" ? "🌙 Switch to Dark Mode" : "☀️ Switch to Light Mode"}
          </button>
          <button onClick={onLogout} style={{ padding:"12px", background:"transparent",
            border:`1px solid ${GV.red}`, borderRadius:12, color:GV.redB,
            fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
            Switch Player
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── EDIT GAME CODE MODAL ─────────────────────────────────────────────────────
function EditGameCodeModal({ game, onSave, onClose, inputStyle }) {
  const [code, setCode] = useState(game.joinCode || "");
  const [saving, setSaving] = useState(false);
  async function handleSave() {
    if (!code.trim()) return;
    setSaving(true);
    await onSave(game.id, code.trim().toUpperCase());
    setSaving(false);
    onClose();
  }
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)",
      zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:GV_DARK.bg1,
        border:`1px solid ${GV_DARK.bg2}`, borderRadius:16, padding:24, width:"100%", maxWidth:360 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <span style={{ color:GV_DARK.fg, fontWeight:700, fontSize:16 }}>Edit Join Code</span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:GV_DARK.fg3, fontSize:20, cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ color:GV_DARK.fg3, fontSize:11, marginBottom:16 }}>
          Share this code with family and friends so they can join <strong style={{ color:GV_DARK.fg }}>{game.name}</strong>.
        </div>
        <input value={code}
          onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,12))}
          style={{ ...inputStyle, width:"100%", boxSizing:"border-box",
            letterSpacing:4, fontSize:22, textAlign:"center", fontWeight:900,
            marginBottom:16, display:"block" }} />
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={handleSave} disabled={saving || !code.trim()}
            style={{ flex:1, background:GV_DARK.orange, border:"none", borderRadius:10,
              padding:"12px", color:GV_DARK.bg0, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            {saving ? "Saving…" : "Save Code"}
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

  // Community word bank
  const [communityWords, setCommunityWords] = useState([]);
  const [pendingWords, setPendingWords] = useState([]);

  // UI state
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showCreateGame, setShowCreateGame] = useState(false);
  const [showJoinGame, setShowJoinGame] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [editingCurrentPlayer, setEditingCurrentPlayer] = useState(false);
  const [editingGameCode, setEditingGameCode] = useState(null);
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const [showSuggestWord, setShowSuggestWord] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [profilePlayer, setProfilePlayer] = useState(null);
  const [adminPinUnlocked, setAdminPinUnlocked] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState("");
  const [adminPinError, setAdminPinError] = useState("");
  const [adminSection, setAdminSection] = useState("players");
  const [editingPlayer, setEditingPlayer] = useState(null);

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
        const fullBank = [
          ...WORD_BANK,
          ...communityWords.map(w => ({ id: w.id, type: w.type, word: w.word }))
        ];
        const words = generateDailyWordsFromBank(fullBank, key);
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
    const q = query(collection(db, "submissions"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, snap => {
      const now = Date.now();
      const updates = [];
      const data = snap.docs.map(d => {
        const sub = { id: d.id, ...d.data() };
        if (sub.hasImage && sub.imageData &&
            now - new Date(sub.timestamp).getTime() > IMAGE_TTL_MS) {
          updates.push(updateDoc(doc(db, "submissions", d.id), { imageData: null }));
          sub.imageData = null;
        }
        return sub;
      });
      if (updates.length > 0) Promise.all(updates).catch(console.error);
      setSubmissions(data);
    });
    return unsub;
  }, []);

  // ── Champions subscription ──
  useEffect(() => {
    if (!activeGame) return;
    const q = query(collection(db, "champions"), where("gameId", "==", activeGame.id));
    const unsub = onSnapshot(q, snap => {
      setChampions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [activeGame?.id]);

  // ── Community word bank (approved player suggestions) ──
  useEffect(() => {
    const q = query(collection(db, "wordBank"), where("approved", "==", true));
    const unsub = onSnapshot(q, snap => {
      setCommunityWords(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  // ── Pending word suggestions (admin only) ──
  useEffect(() => {
    if (!currentPlayer?.isAdmin) return;
    const q = query(collection(db, "wordBank"), where("approved", "==", false));
    const unsub = onSnapshot(q, snap => {
      setPendingWords(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [currentPlayer?.isAdmin]);

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
    const isFirstPlayer = players.length === 0;
    await setDoc(doc(db, "players", id), {
      id, name, emoji, color,
      isAdmin: isFirstPlayer,
      theme: "dark"
    });
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
    setShowProfileSheet(false);
    setAdminPinUnlocked(false);
    setAdminPinInput("");
    setAdminPinError("");
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
  async function handleEditGameCode(gameId, newCode) {
    await updateDoc(doc(db, "games", gameId), { joinCode: newCode });
  }
  async function handleToggleAdmin(playerId, current) {
    await updateDoc(doc(db, "players", playerId), { isAdmin: !current });
  }
  function handleSelectGame(game) {
    setActiveGame(game);
    localStorage.setItem("esp_active_game", game.id);
    setTab("today");
  }

  // ── Submit ──
  async function handleSubmit() {
    setSubmitError("");
    if (selectedWords.length === 0) {
      setSubmitError("Tag at least one word you matched.");
      return;
    }
    if (!imageFile) {
      setSubmitError("Attach a proof photo — pic or it didn't happen! 📷");
      return;
    }
    const matchedIds = selectedWords.map(w => w.id);
    if (hasDuplicateMatchToday(submissions, currentPlayer.id, matchedIds, todayKey)) {
      setSubmitError("You already submitted this exact combination today! Try a different find.");
      return;
    }
    setSubmitting(true);
    try {
      const bonus = getStreakBonus(submissions, currentPlayer.id);
      const scoreResult = scoreSubmission(selectedWords.length, dailyWords.length, bonus);
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
        hasImage: true,
        imageData,
        reactions: {},
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
      const streak = getStreakLength(submissions, p.id);
      return {
        ...p,
        total: subs.reduce((a,s) => a + s.score, 0),
        count: subs.length,
        best: subs.length ? Math.max(...subs.map(s => s.score)) : 0,
        streak,
        hasStreak: streak >= 3,
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
      <WelcomeModal
        isFirstTime={isFirstTimeUser}
        onAccept={handleAcceptTerms}
        onTitleClick={() => setShowAbout(true)}
      />
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
      <GameSelectScreen
        player={currentPlayer} games={games} gamesLoaded={gamesLoaded}
        onSelect={handleSelectGame}
        onCreateGame={() => setShowCreateGame(true)}
        onJoinGame={() => setShowJoinGame(true)}
        onSwitchPlayer={handleLogout}
        onEditGameCode={(g) => setEditingGameCode(g)}
      />
      {showCreateGame && (
        <CreateGameModal onSave={handleCreateGame} onClose={() => setShowCreateGame(false)} inputStyle={darkInput} />
      )}
      {showJoinGame && (
        <JoinGameModal onJoin={handleJoinGame} onClose={() => setShowJoinGame(false)} inputStyle={darkInput} />
      )}
      {editingGameCode && (
        <EditGameCodeModal
          game={editingGameCode}
          onSave={handleEditGameCode}
          onClose={() => setEditingGameCode(null)}
          inputStyle={darkInput}
        />
      )}
    </ThemeContext.Provider>
  );

  const NAV = [
    ["today",   "👁️ Today"],
    ["submit",  "➕ Submit"],
    ["board",   "🏆 Board"],
    ["feed",    "📋 Feed"],
    ["rules",   "📖 Rules"],
    ["champs",  "🥇 Champs"],
    ...(currentPlayer.isAdmin ? [["admin", "⚙️ Admin"]] : []),
  ];

  return (
    <ThemeContext.Provider value={GV}>
      <div style={{ background:GV.bg0, minHeight:"100vh", fontFamily:"'Courier Prime',monospace",
        color:GV.fg, maxWidth:480, width:"100%", margin:"0 auto", paddingBottom:24,
        boxSizing:"border-box" }}>

        <Confetti active={showConfetti} />

        {showProfileSheet && (
          <ProfileSheet
            player={currentPlayer}
            submissions={submissions}
            games={games}
            activeGame={activeGame}
            onClose={() => setShowProfileSheet(false)}
            onEdit={() => { setEditingCurrentPlayer(true); setShowProfileSheet(false); }}
            onLogout={handleLogout}
            onThemeToggle={handleThemeToggle}
            onSwitchGame={handleSelectGame}
            onJoinGame={() => { setShowJoinGame(true); setActiveGame(null); }}
            onCreateGame={() => { setShowCreateGame(true); setActiveGame(null); }}
          />
        )}
        {editingPlayer && (
          <PlayerModal
            player={editingPlayer}
            onSave={changes => handleEditPlayer(editingPlayer.id, changes)}
            onRemove={() => handleRemovePlayer(editingPlayer.id)}
            onClose={() => setEditingPlayer(null)}
            inputStyle={inputStyle}
            isEdit={true}
          />
        )}

        {pendingWinner && (
          <WinnerBanner winner={pendingWinner} periodLabel={pendingWinner.periodLabel}
            onDismiss={() => setPendingWinner(null)} />
        )}

        {/* HEADER + NAV */}
        <div style={{ background:GV.bg1, borderBottom:`1px solid ${GV.bg2}`, position:"sticky", top:0, zIndex:10 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"12px 20px" }}>
            <button onClick={() => setShowAbout(true)}
              style={{ background:"none", border:"none", cursor:"pointer",
                display:"flex", alignItems:"baseline", gap:6, padding:0,
                fontFamily:"inherit" }}>
              <span style={{ fontSize:20, fontWeight:900, color:GV.orangeB,
                letterSpacing:1 }}>EYESPY</span>
              <span style={{ fontSize:16 }}>👁️</span>
            </button>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ color:GV.fg3, fontSize:11 }}>{activeGame.name}</span>
              <button onClick={() => setShowProfileSheet(true)}
                style={{ background:"transparent", border:"none", cursor:"pointer", padding:4 }}>
                <div style={{ width:30, height:30, borderRadius:"50%", background:currentPlayer.color,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
                  {currentPlayer.emoji}
                </div>
              </button>
            </div>
          </div>
          <div style={{ display:"flex", borderTop:`1px solid ${GV.bg2}`,
            overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
            {NAV.map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                style={{ flex:"0 0 auto", minWidth:60, background:"transparent", border:"none",
                  padding:"8px 6px", color: tab===key ? GV.orangeB : GV.fg3,
                  fontWeight: tab===key ? 900 : 400, cursor:"pointer",
                  fontFamily:"inherit", fontSize:10, whiteSpace:"nowrap",
                  borderBottom: tab===key ? `2px solid ${GV.orangeB}` : "2px solid transparent" }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB CONTENT */}
        <div style={{ padding:"16px", boxSizing:"border-box", width:"100%" }}>

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
              <button onClick={() => setShowSuggestWord(true)}
                style={{ width:"100%", marginTop:12, background:"transparent",
                  border:`1px solid ${GV.bg2}`, borderRadius:12, padding:"11px",
                  color:GV.fg3, cursor:"pointer", fontFamily:"inherit", fontSize:12 }}>
                💡 Suggest a Word
              </button>
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
              {selectedWords.length > 0 && (() => {
                const bonus = getStreakBonus(submissions, currentPlayer.id);
                const preview = scoreSubmission(selectedWords.length, dailyWords.length, bonus);
                return (
                  <div style={{ background:GV.bg1, borderRadius:10, padding:"10px 14px",
                    marginBottom:16 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ color:GV.fg2, fontSize:12 }}>
                        {selectedWords.length} of {dailyWords.length} matched
                      </span>
                      <span style={{ color:GV.yellowB, fontWeight:900 }}>
                        {preview.total} pts
                      </span>
                    </div>
                    {bonus > 0 && (
                      <div style={{ color:GV.orangeB, fontSize:11, marginTop:4 }}>
                        🔥 +{bonus} streak bonus included!
                      </div>
                    )}
                  </div>
                );
              })()}
              <div style={{ marginBottom:16 }}>
                <label style={{ color:GV.fg3, fontSize:11, letterSpacing:2, display:"block", marginBottom:8 }}>
                  PROOF PHOTO *
                </label>
                <input type="file" accept="image/*"
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
                <div key={p.id} onClick={() => setProfilePlayer(p)}
                  style={{ cursor:"pointer", background: i===0 ? GV.bg1 : GV.bg1,
                  border:`1px solid ${i===0 ? GV.yellowB : GV.bg2}`,
                  borderRadius:12, padding:"12px 16px", marginBottom:8,
                  display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ color: i===0 ? GV.yellowB : GV.fg3,
                    fontWeight:900, fontSize:18, width:24, textAlign:"center" }}>
                    {i===0 ? "🏆" : i+1}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <PlayerBadge player={p} />
                      {p.hasStreak && (
                        <span title={`${p.streak} day streak!`} style={{ fontSize:14 }}>🔥</span>
                      )}
                    </div>
                    {p.streak >= 3 && (
                      <div style={{ color:GV.orangeB, fontSize:10, marginTop:2 }}>
                        🔥 {p.streak} day streak
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign:"right" }}>
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
          {tab === "rules" && <RulesTab onSuggestWord={() => setShowSuggestWord(true)} />}

          {/* CHAMPS TAB */}
          {tab === "champs" && <ChampionsTab champions={champions} players={players} />}

          {/* ADMIN TAB */}
          {tab === "admin" && currentPlayer.isAdmin && (
            <div>
              {!adminPinUnlocked ? (
                <div style={{ maxWidth:300, margin:"40px auto 0", textAlign:"center" }}>
                  <div style={{ fontSize:32, marginBottom:12 }}>🔒</div>
                  <div style={{ color:GV.fg3, fontSize:11, letterSpacing:3, marginBottom:20 }}>
                    ADMIN ACCESS
                  </div>
                  <input
                    value={adminPinInput}
                    onChange={e => { setAdminPinInput(e.target.value.toUpperCase()); setAdminPinError(""); }}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        if (adminPinInput === "GPJ") { setAdminPinUnlocked(true); setAdminPinInput(""); }
                        else { setAdminPinError("Incorrect PIN."); setAdminPinInput(""); }
                      }
                    }}
                    placeholder="PIN"
                    style={{ ...inputStyle, width:"100%", boxSizing:"border-box",
                      letterSpacing:8, textAlign:"center", fontSize:20, marginBottom:10 }}
                  />
                  {adminPinError && (
                    <div style={{ color:GV.redB, fontSize:12, marginBottom:10 }}>{adminPinError}</div>
                  )}
                  <button onClick={() => {
                    if (adminPinInput === "GPJ") {
                      setAdminPinUnlocked(true); setAdminPinInput(""); setAdminPinError("");
                    } else {
                      setAdminPinError("Incorrect PIN."); setAdminPinInput("");
                    }
                  }} style={{ width:"100%", padding:"13px",
                    background:`linear-gradient(135deg,${GV.orange},${GV.orangeB})`,
                    border:"none", borderRadius:12, color:GV.bg0, fontSize:14,
                    fontWeight:900, letterSpacing:2, cursor:"pointer", fontFamily:"inherit" }}>
                    UNLOCK
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ color:GV.fg3, fontSize:11, letterSpacing:3, marginBottom:16 }}>
                    ADMIN PANEL
                  </div>
                  <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
                    {[["players","👥 Players"],["words","💡 Words"],["games","🎮 Games"],["danger","⚠️ Danger"]].map(([id,label]) => (
                      <button key={id} onClick={() => setAdminSection(id)} style={{
                        padding:"7px 14px", borderRadius:20,
                        border:`1px solid ${adminSection===id ? GV.orangeB : GV.bg2}`,
                        background: adminSection===id ? `${GV.orangeB}18` : "transparent",
                        color: adminSection===id ? GV.orangeB : GV.fg3,
                        fontSize:12, cursor:"pointer", fontFamily:"inherit",
                      }}>{label}</button>
                    ))}
                  </div>

                  {adminSection === "players" && (
                    <div>
                      {players.map(p => (
                        <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10,
                          padding:"10px 14px", borderRadius:10, marginBottom:8,
                          background:GV.bg0, border:`1px solid ${GV.bg2}` }}>
                          <div style={{ width:32, height:32, borderRadius:"50%", background:p.color,
                            display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
                            {p.emoji}
                          </div>
                          <span style={{ flex:1, color:GV.fg, fontSize:13, fontWeight:700 }}>{p.name}</span>
                          <span style={{ color: p.isAdmin ? GV.yellowB : GV.bg3, fontSize:10, marginRight:4 }}>
                            {p.isAdmin ? "admin" : ""}
                          </span>
                          <button onClick={() => handleToggleAdmin(p.id, p.isAdmin)} style={{
                            padding:"4px 8px", background:"transparent",
                            border:`1px solid ${p.isAdmin ? GV.yellowB+"66" : GV.bg2}`,
                            borderRadius:8, color: p.isAdmin ? GV.yellowB : GV.bg3,
                            fontSize:10, cursor:"pointer", fontFamily:"inherit",
                          }}>{p.isAdmin ? "★ Admin" : "☆"}</button>
                          <button onClick={() => setEditingPlayer(p)} style={{
                            padding:"5px 10px", background:"transparent",
                            border:`1px solid ${GV.bg2}`, borderRadius:8,
                            color:GV.fg3, fontSize:11, cursor:"pointer", fontFamily:"inherit",
                          }}>Edit</button>
                        </div>
                      ))}
                      <button onClick={() => setShowAddPlayer(true)} style={{
                        width:"100%", marginTop:12, padding:"12px", background:"transparent",
                        border:`2px dashed ${GV.bg2}`, borderRadius:10, color:GV.fg3,
                        fontSize:13, cursor:"pointer", fontFamily:"inherit",
                      }}>+ Add Player</button>
                    </div>
                  )}

                  {adminSection === "words" && (
                    <div>
                      <div style={{ color:GV.fg3, fontSize:11, letterSpacing:2, marginBottom:12 }}>
                        PENDING SUGGESTIONS
                      </div>
                      {pendingWords.length === 0 ? (
                        <div style={{ color:GV.fg3, textAlign:"center", padding:"30px 0", fontSize:13 }}>
                          No pending suggestions!
                        </div>
                      ) : pendingWords.map(w => (
                        <div key={w.id} style={{ background:GV.bg0,
                          border:`1px solid ${GV.bg2}`, borderRadius:12,
                          padding:"12px 14px", marginBottom:8 }}>
                          <div style={{ display:"flex", alignItems:"center",
                            justifyContent:"space-between", marginBottom:4 }}>
                            <span style={{ color:GV.fg, fontWeight:700, fontSize:15 }}>{w.word}</span>
                            <span style={{ color:GV.fg3, fontSize:10, background:GV.bg1,
                              padding:"2px 8px", borderRadius:10 }}>{w.type}</span>
                          </div>
                          <div style={{ color:GV.fg3, fontSize:11, marginBottom:10 }}>
                            Suggested by {w.suggestedBy}
                          </div>
                          <div style={{ display:"flex", gap:8 }}>
                            <button onClick={async () => {
                              await updateDoc(doc(db, "wordBank", w.id), { approved: true });
                            }} style={{ flex:1, padding:"8px",
                              background:`linear-gradient(135deg,${GV.green},${GV.greenB})`,
                              border:"none", borderRadius:8, color:GV.bg0,
                              fontWeight:700, cursor:"pointer", fontFamily:"inherit", fontSize:12 }}>
                              ✓ Approve
                            </button>
                            <button onClick={async () => {
                              await deleteDoc(doc(db, "wordBank", w.id));
                            }} style={{ flex:1, padding:"8px", background:"transparent",
                              border:`1px solid ${GV.red}`, borderRadius:8, color:GV.redB,
                              cursor:"pointer", fontFamily:"inherit", fontSize:12 }}>
                              ✕ Reject
                            </button>
                          </div>
                        </div>
                      ))}
                      <div style={{ marginTop:20, color:GV.fg3, fontSize:11,
                        letterSpacing:2, marginBottom:12 }}>
                        APPROVED WORDS ({communityWords.length})
                      </div>
                      {communityWords.length === 0 ? (
                        <div style={{ color:GV.fg3, fontSize:12 }}>No approved community words yet.</div>
                      ) : communityWords.map(w => (
                        <div key={w.id} style={{ display:"flex", alignItems:"center", gap:10,
                          padding:"8px 12px", borderRadius:8, marginBottom:6,
                          background:GV.bg0, border:`1px solid ${GV.bg2}` }}>
                          <span style={{ flex:1, color:GV.fg, fontSize:13 }}>{w.word}</span>
                          <span style={{ color:GV.fg3, fontSize:10 }}>{w.type}</span>
                          <button onClick={async () => {
                            await deleteDoc(doc(db, "wordBank", w.id));
                          }} style={{ background:"transparent", border:`1px solid ${GV.red}44`,
                            borderRadius:6, padding:"3px 8px", color:GV.redB,
                            fontSize:10, cursor:"pointer", fontFamily:"inherit" }}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {adminSection === "games" && (
                    <div>
                      {games.map(g => (
                        <div key={g.id} style={{ background:GV.bg0,
                          border:`1px solid ${g.id===activeGame?.id ? GV.orangeB+"44" : GV.bg2}`,
                          borderRadius:12, padding:"14px 16px", marginBottom:10 }}>
                          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                            <div style={{ color:GV.fg, fontWeight:700 }}>👁️ {g.name}</div>
                            {g.id===activeGame?.id && (
                              <span style={{ color:GV.orangeB, fontSize:10, letterSpacing:1 }}>ACTIVE</span>
                            )}
                          </div>
                          <div style={{ color:GV.fg3, fontSize:11, marginBottom:8 }}>
                            {g.members?.length || 0} members · {g.periodMode || "weekly"} · code:
                            <span style={{ color:GV.yellowB, fontWeight:700, letterSpacing:2, marginLeft:4 }}>
                              {g.joinCode}
                            </span>
                          </div>
                          <div style={{ color:GV.fg3, fontSize:10 }}>
                            Members: {g.members?.map(id => players.find(p=>p.id===id)?.name || id).join(", ")}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {adminSection === "danger" && (
                    <div>
                      <div style={{ background:GV.bg0, border:`1px solid ${GV.red}44`,
                        borderRadius:12, padding:"16px", marginBottom:12 }}>
                        <div style={{ color:GV.redB, fontWeight:700, marginBottom:8 }}>
                          ⚠️ Reset All Submissions
                        </div>
                        <div style={{ color:GV.fg3, fontSize:12, marginBottom:12 }}>
                          Permanently deletes ALL submissions across all games and players.
                          Players, games, and champions are kept. Cannot be undone.
                        </div>
                        <button onClick={async () => {
                          if (!window.confirm("Delete ALL submissions? This cannot be undone.")) return;
                          const snap = await getDocs(collection(db, "submissions"));
                          const batch = writeBatch(db);
                          snap.docs.forEach(d => batch.delete(d.ref));
                          await batch.commit();
                        }} style={{ padding:"11px 20px",
                          background:"transparent", border:`1px solid ${GV.red}`,
                          borderRadius:10, color:GV.redB, fontSize:13,
                          cursor:"pointer", fontFamily:"inherit" }}>
                          Delete All Submissions
                        </button>
                      </div>
                      <div style={{ background:GV.bg0, border:`1px solid ${GV.red}44`,
                        borderRadius:12, padding:"16px" }}>
                        <div style={{ color:GV.redB, fontWeight:700, marginBottom:8 }}>
                          ⚠️ Reset Champions
                        </div>
                        <div style={{ color:GV.fg3, fontSize:12, marginBottom:12 }}>
                          Deletes all champion records. The leaderboard history will be cleared.
                        </div>
                        <button onClick={async () => {
                          if (!window.confirm("Delete ALL champion records? Cannot be undone.")) return;
                          const snap = await getDocs(collection(db, "champions"));
                          const batch = writeBatch(db);
                          snap.docs.forEach(d => batch.delete(d.ref));
                          await batch.commit();
                        }} style={{ padding:"11px 20px",
                          background:"transparent", border:`1px solid ${GV.red}`,
                          borderRadius:10, color:GV.redB, fontSize:13,
                          cursor:"pointer", fontFamily:"inherit" }}>
                          Delete All Champions
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>


{/* PROFILE / EDIT MODAL */}
        {editingCurrentPlayer && (
          <PlayerModal player={currentPlayer} onSave={changes => handleEditPlayer(currentPlayer.id, changes)}
            onRemove={() => handleRemovePlayer(currentPlayer.id)}
            onClose={() => setEditingCurrentPlayer(false)} inputStyle={darkInput} isEdit={true} />
        )}

        {showSuggestWord && (
          <SuggestWordModal
            onClose={() => setShowSuggestWord(false)}
            playerId={currentPlayer.id}
            playerName={currentPlayer.name}
            inputStyle={inputStyle}
          />
        )}
        {showAbout && (
          <AboutSheet onClose={() => setShowAbout(false)} />
        )}
        {profilePlayer && (
          <PlayerProfileSheet
            player={profilePlayer}
            submissions={submissions}
            onClose={() => setProfilePlayer(null)}
          />
        )}

      </div>
    </ThemeContext.Provider>
  );
}
