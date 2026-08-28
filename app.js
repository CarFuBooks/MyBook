/* ====================== KONSTANTEN ====================== */
const STATUS_META = {
  ungelesen:  { label: "Ungelesen" },
  am_lesen:   { label: "Am Lesen" },
  gelesen:    { label: "Gelesen" },
  abgebrochen:{ label: "Abgebrochen" },
};
const ART_META = { hoerbuch: "Hörbuch", hardcover: "Hardcover", ebook: "E-Book", taschenbuch: "Taschenbuch" };
const ERHALTEN_META = { geschenk: "Geschenk", tausch: "Tausch", leihe: "Leihe", kauf: "Kauf" };
const TABS = [
  { key: "ungelesen", label: "Ungelesen" },
  { key: "am_lesen", label: "Am Lesen" },
  { key: "gelesen", label: "Gelesen" },
  { key: "abgebrochen", label: "Abgebrochen" },
];
const VIEW_TABS = [{ key: "alle", label: "Alle" }, ...TABS];
const MONTH_NAMES = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];

const ICONS = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22.5V4.5Z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></svg>`,
  more: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>`,
  filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5h16M7 12h10M10 19h4"/></svg>`,
  chevL: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>`,
  chevR: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,
  star: (filled) => `<svg viewBox="0 0 24 24" fill="${filled ? '#C99A4B' : 'none'}" stroke="#C99A4B" stroke-width="1.8"><path d="M12 2.5l3 6.4 6.9.9-5 5 1.2 6.9L12 18.3 5.9 21.7 7.1 14.8l-5-5 6.9-.9L12 2.5Z"/></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V4M6 10l6-6 6 6"/><path d="M4 20h16"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 8h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="14" r="3.5"/></svg>`,
  cloud: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6.5 19a4.5 4.5 0 0 1-.5-9 6 6 0 0 1 11.6-1.8A4.5 4.5 0 0 1 17 19H6.5Z"/></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.7l7.4-4.1M8.3 13.3l7.4 4.1"/></svg>`,
};

/* ====================== STORAGE (lokal, Cloud folgt) ====================== */
const Storage = {
  async getBooks() {
    try { const raw = localStorage.getItem("books"); if (raw) return JSON.parse(raw); } catch {}
    return null;
  },
  async setBooks(books) {
    try { localStorage.setItem("books", JSON.stringify(books)); } catch {}
  },
  async getGoal() {
    try { const raw = localStorage.getItem("goal"); if (raw) return JSON.parse(raw); } catch {}
    return 450;
  },
  async setGoal(g) {
    try { localStorage.setItem("goal", JSON.stringify(g)); } catch {}
  },
};

/* ====================== STATE ====================== */
const state = {
  books: null,
  goal: 450,
  view: "home",
  selectedId: null,
  isNew: false,
  draft: null,
  tab: "gelesen",
  query: "",
  filters: { jahr: "", monat: "", art: "", erhaltenAls: "", genre: "", kategorie: "" },
  showFilterSheet: false,
  statsMode: "jahr",
  statsYear: new Date().getFullYear(),
  monthCursor: { y: new Date().getFullYear(), m: new Date().getMonth() },
};

function emptyBook() {
  return {
    id: "b" + Date.now() + Math.random().toString(16).slice(2),
    titel: "", autor: "", isbn: "", asin: "", jahr: "", genre: "",
    seiten: 0, dauerStunden: 0, dauerMinuten: 0, art: "taschenbuch",
    preis: 0, erhaltenAls: "kauf", status: "ungelesen",
    lesebeginn: null, leseende: null, bewertung: 0, kategorie: "",
    notizen: "", erhaltenAm: null, cover: null,
  };
}

/* ====================== HELFER ====================== */
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}
function fmtNum(n) { return (n || 0).toLocaleString("de-DE"); }
function fmt1(n) { return (n || 0).toFixed(1).replace(".", ","); }
function readDays(book) {
  if (!book.lesebeginn || !book.leseende) return null;
  const a = new Date(book.lesebeginn), b = new Date(book.leseende);
  const diff = Math.round((b - a) / 86400000);
  return diff >= 0 ? diff : null;
}
function hoursOf(book) { return (book.dauerStunden || 0) + (book.dauerMinuten || 0) / 60; }
function initials(name) {
  return (name || "?").trim().split(/\s+/).slice(0, 2).map(s => s[0]).join("").toUpperCase();
}
function hueOf(str) {
  let h = 0;
  for (const c of (str || "?")) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

/* ====================== COVER LOOKUP (Google Books) ====================== */
const coverCache = new Map();
let inFlightCovers = 0;
const MAX_INFLIGHT_COVERS = 5;
const coverQueue = [];
function pumpCoverQueue() {
  while (inFlightCovers < MAX_INFLIGHT_COVERS && coverQueue.length) {
    const job = coverQueue.shift();
    inFlightCovers++;
    job().finally(() => { inFlightCovers--; pumpCoverQueue(); });
  }
}
async function fetchGoogleCover(book) {
  const q = book.isbn
    ? `isbn:${book.isbn}`
    : `intitle:${encodeURIComponent((book.titel || "").split(":")[0])}${book.autor ? "+inauthor:" + encodeURIComponent(book.autor.split(" ")[0]) : ""}`;
  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1`);
    const data = await res.json();
    const links = data.items?.[0]?.volumeInfo?.imageLinks;
    const img = links?.thumbnail || links?.smallThumbnail;
    return img ? img.replace("http://", "https://").replace("&edge=curl", "") : null;
  } catch { return null; }
}
function requestCover(book, imgEl, placeholderEl) {
  if (coverCache.has(book.id)) {
    const url = coverCache.get(book.id);
    if (url) { imgEl.src = url; imgEl.style.display = "block"; placeholderEl.style.display = "none"; }
    return;
  }
  if (!book.titel) return;
  coverQueue.push(async () => {
    const url = await fetchGoogleCover(book);
    coverCache.set(book.id, url);
    if (url && document.body.contains(imgEl)) {
      imgEl.src = url; imgEl.style.display = "block"; placeholderEl.style.display = "none";
    }
  });
  pumpCoverQueue();
}

function coverHTML(book, sizePx) {
  const w = sizePx, h = Math.round(sizePx * 1.4);
  const hue = hueOf(book.titel);
  const bg = `linear-gradient(155deg, hsl(${hue} 32% 26%), hsl(${hue} 28% 14%))`;
  if (book.cover) {
    return `<div class="cover" style="width:${w}px;height:${h}px;background:${bg};" data-cover-id="${esc(book.id)}">
      <span style="display:none;font-size:${Math.round(sizePx*0.24)}px;">${esc(initials(book.autor))}</span>
      <img src="${esc(book.cover)}" style="display:block;" alt="" loading="lazy" />
    </div>`;
  }
  return `<div class="cover" style="width:${w}px;height:${h}px;background:${bg};" data-cover-id="${esc(book.id)}">
    <span style="font-size:${Math.round(sizePx*0.24)}px;">${esc(initials(book.autor))}</span>
    <img style="display:none;" alt="" loading="lazy" />
  </div>`;
}
function mountCovers(container) {
  container.querySelectorAll("[data-cover-id]").forEach(el => {
    const id = el.getAttribute("data-cover-id");
    const book = state.books.find(b => b.id === id) || (state.draft && state.draft.id === id ? state.draft : null);
    if (!book || book.cover) return; // manual cover already rendered directly, or book not found
    const img = el.querySelector("img");
    const span = el.querySelector("span");
    requestCover(book, img, span);
  });
}

/* ====================== RENDER: ROOT ====================== */
const appEl = document.getElementById("app");

async function boot() {
  const savedBooks = await Storage.getBooks();
  state.books = savedBooks || SEED_BOOKS;
  if (!savedBooks) await Storage.setBooks(state.books);
  state.goal = await Storage.getGoal();
  render();
}

function setView(v) { state.view = v; pushHistory(); render(); }
function openBook(id) { state.selectedId = id; state.isNew = false; state.draft = { ...state.books.find(b => b.id === id) }; state.view = "detail"; pushHistory(); render(); }
function addBook() { state.selectedId = null; state.isNew = true; state.draft = emptyBook(); state.view = "detail"; pushHistory(); render(); }
async function saveBook() {
  const b = state.draft;
  if (state.isNew) state.books = [b, ...state.books];
  else state.books = state.books.map(x => x.id === b.id ? b : x);
  await Storage.setBooks(state.books);
  state.view = "list";
  render();
}
async function deleteBook(id) {
  state.books = state.books.filter(b => b.id !== id);
  await Storage.setBooks(state.books);
  state.view = "list";
  render();
}
async function setGoal(g) {
  state.goal = g;
  await Storage.setGoal(g);
}
async function importBooks(list) {
  state.books = [...state.books, ...list];
  await Storage.setBooks(state.books);
  render();
}

function render() {
  if (!state.books) { appEl.innerHTML = `<div class="view pad"><p class="serif muted">Bibliothek wird geladen …</p></div>`; return; }
  let html = "";
  if (state.view === "home") html = renderHome();
  else if (state.view === "list") html = renderList();
  else if (state.view === "stats") html = renderStats();
  else if (state.view === "settings") html = renderSettings();
  else if (state.view === "detail") html = renderDetail();

  const showNav = state.view !== "detail";
  appEl.innerHTML = html + (showNav ? renderBottomNav() : "");
  attachHandlers();
  mountCovers(appEl);
}

/* ====================== BOTTOM NAV ====================== */
function renderBottomNav() {
  const items = [
    { key: "home", icon: ICONS.home, label: "Start" },
    { key: "list", icon: ICONS.book, label: "Bibliothek" },
    { key: "__add__", icon: ICONS.plus, label: "Hinzufügen", fab: true },
    { key: "stats", icon: ICONS.chart, label: "Statistik" },
    { key: "settings", icon: ICONS.more, label: "Mehr" },
  ];
  return `<div class="bottomnav">${items.map(it => {
    if (it.fab) return `<button class="fab" data-action="add">${it.icon}</button>`;
    const active = state.view === it.key;
    return `<button class="navbtn ${active ? "active" : ""}" data-action="nav" data-view="${it.key}">${it.icon}<span>${it.label}</span></button>`;
  }).join("")}</div>`;
}

/* ====================== HOME ====================== */
function ringSVG(value, max, size, stroke) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  return `<svg width="${size}" height="${size}">
    <defs><radialGradient id="lampGlow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="rgba(201,154,75,0.18)"/><stop offset="100%" stop-color="rgba(201,154,75,0)"/>
    </radialGradient></defs>
    <circle cx="${size/2}" cy="${size/2}" r="${r+stroke}" fill="url(#lampGlow)"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="rgba(242,233,220,0.08)" stroke-width="${stroke}"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#C99A4B" stroke-width="${stroke}"
      stroke-dasharray="${c}" stroke-dashoffset="${c*(1-pct)}" stroke-linecap="round"
      transform="rotate(-90 ${size/2} ${size/2})"/>
    <text x="50%" y="46%" text-anchor="middle" font-family="Fraunces, serif" font-size="${size*0.19}" font-weight="600" fill="#F2E9DC">${value}</text>
    <text x="50%" y="58%" text-anchor="middle" font-family="Inter, sans-serif" font-size="${size*0.065}" fill="#A69C8C">/ ${max}</text>
  </svg>`;
}

function renderHome() {
  const b = state.books;
  const read = b.filter(x => x.status === "gelesen").length;
  const recent = [...b].filter(x => x.erhaltenAm || x.lesebeginn)
    .sort((x, y) => new Date(y.erhaltenAm || y.lesebeginn || 0) - new Date(x.erhaltenAm || x.lesebeginn || 0))
    .slice(0, 8);
  return `<div class="view">
    <div class="pad" style="padding-bottom:8px;">
      <div class="home-header">
        <h1 style="font-size:26px;">Deine Bibliothek</h1>
      </div>
      <p class="muted" style="font-size:13px;margin-top:4px;">${b.length} Bücher insgesamt</p>
      <div class="ring-wrap" id="ringWrap" style="cursor:pointer;">${ringSVG(read, state.goal, 220, 16)}</div>
      <p class="faint" style="text-align:center;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin-top:-6px;">Gelesene Bücher · Ziel antippen zum Ändern</p>
      <div id="goalEditor" style="display:none;gap:8px;justify-content:center;margin:10px 0;">
        <input type="number" id="goalInput" value="${state.goal}" style="width:90px;text-align:center;" class="field" />
        <button class="btn-primary" style="width:auto;padding:8px 14px;" data-action="saveGoal">✓</button>
      </div>
      <button class="btn-primary" style="margin-top:14px;letter-spacing:.3px;" data-action="nav" data-view="stats">ALLE STATISTIKEN ANSEHEN</button>
      <h2 class="muted" style="font-size:15px;letter-spacing:1px;text-transform:uppercase;margin-top:28px;margin-bottom:12px;">Zuletzt hinzugefügt</h2>
      <div class="recent-scroll">
        ${recent.map(bk => `<div data-action="open" data-id="${esc(bk.id)}">${coverHTML(bk, 64)}</div>`).join("")}
        ${recent.length === 0 ? `<p class="faint" style="font-size:13px;">Noch keine Bücher.</p>` : ""}
      </div>
    </div>
  </div>`;
}

/* ====================== LIST ====================== */
function getFilteredBooks() {
  const b = state.books;
  const f = state.filters;
  return b.filter(x => {
    if (state.tab !== "alle" && x.status !== state.tab) return false;
    if (state.query && !(`${x.titel} ${x.autor}`.toLowerCase().includes(state.query.toLowerCase()))) return false;
    if (f.jahr && x.leseende?.slice(0,4) !== f.jahr) return false;
    if (f.monat && x.leseende?.slice(5,7) !== f.monat) return false;
    if (f.art && x.art !== f.art) return false;
    if (f.erhaltenAls && x.erhaltenAls !== f.erhaltenAls) return false;
    if (f.genre && x.genre !== f.genre) return false;
    if (f.kategorie && x.kategorie !== f.kategorie) return false;
    return true;
  });
}

async function shareList() {
  const list = getFilteredBooks();
  const tabLabel = VIEW_TABS.find(t => t.key === state.tab)?.label || "Bücher";
  const today = new Date().toLocaleDateString("de-DE");
  const lines = list.map(b => `• ${b.titel} — ${b.autor || "Unbekannt"}`);
  const text = `${tabLabel} (${list.length} Bücher) — Stand ${today}\n\n${lines.join("\n")}`;
  if (navigator.share) {
    try { await navigator.share({ title: `Meine Bücher – ${tabLabel}`, text }); } catch {}
  } else {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Liste in Zwischenablage kopiert");
    } catch {
      showToast("Teilen wird von diesem Browser nicht unterstützt");
    }
  }
}

function renderList() {
  const b = state.books;
  const counts = { alle: b.length, ungelesen:0, am_lesen:0, gelesen:0, abgebrochen:0 };
  b.forEach(x => { if (counts[x.status] !== undefined) counts[x.status]++; });
  const genres = [...new Set(b.map(x => x.genre).filter(Boolean))].sort();
  const kategorien = [...new Set(b.map(x => x.kategorie).filter(Boolean))].sort();
  const jahre = [...new Set(b.map(x => x.leseende?.slice(0,4)).filter(Boolean))].sort().reverse();
  const f = state.filters;
  const filtered = getFilteredBooks();
  const activeFilterCount = Object.values(f).filter(Boolean).length;

  const filterRow = (label, key, options) => `<div class="filterrow">
    <span class="muted" style="font-size:13px;">${label}</span>
    <select data-filter-key="${key}">
      <option value="">Alle</option>
      ${options.map(o => `<option value="${esc(o)}" ${f[key]===o?"selected":""}>${esc(o)}</option>`).join("")}
    </select>
  </div>`;

  return `<div class="view" style="display:flex;flex-direction:column;">
    <div class="pad" style="padding-bottom:0;">
      <h1 style="font-size:22px;margin-bottom:12px;">Bibliothek</h1>
      <div style="display:flex;gap:8px;align-items:center;">
        <div class="searchbar">${ICONS.search}<input id="searchInput" placeholder="Bücher durchsuchen …" value="${esc(state.query)}" /></div>
        <button class="filterbtn" data-action="toggleFilter">${ICONS.filter}${activeFilterCount>0?`<span class="filterbadge">${activeFilterCount}</span>`:""}</button>
        <button class="filterbtn" data-action="shareList" title="Liste teilen">${ICONS.share}</button>
      </div>
      <div class="tabs">
        ${VIEW_TABS.map(t => `<button class="tab ${state.tab===t.key?"active":""}" data-action="tab" data-tab="${t.key}">${t.label} (${counts[t.key]})</button>`).join("")}
      </div>
    </div>
    <div class="pad" style="padding-top:6px;flex:1;overflow-y:auto;">
      ${filtered.length===0 ? `<p class="faint" style="text-align:center;margin-top:40px;font-size:13px;">Keine Bücher gefunden.</p>` : ""}
      ${filtered.map(bk => `<div class="bookrow" data-action="open" data-id="${esc(bk.id)}">
        ${coverHTML(bk, 48)}
        <div class="bookrow-info">
          <span class="pill ${bk.status}">${STATUS_META[bk.status].label}</span>
          <p class="bookrow-author">${esc(bk.autor || "Unbekannt")}</p>
          <p class="bookrow-title">${esc(bk.titel)}</p>
        </div>
      </div>`).join("")}
    </div>
    ${state.showFilterSheet ? `<div class="sheet-overlay" data-action="closeFilter">
      <div class="sheet" onclick="event.stopPropagation()">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <h3 style="font-size:17px;">Filter</h3>
          <button data-action="resetFilters" style="background:none;border:none;color:var(--brass);font-size:13px;cursor:pointer;">Zurücksetzen</button>
        </div>
        ${filterRow("Gelesen im Jahr", "jahr", jahre)}
        ${filterRow("Gelesen im Monat", "monat", ["01","02","03","04","05","06","07","08","09","10","11","12"])}
        ${filterRow("Art des Buches", "art", Object.keys(ART_META))}
        ${filterRow("Erhalten als", "erhaltenAls", Object.keys(ERHALTEN_META))}
        ${filterRow("Genre", "genre", genres)}
        ${filterRow("Kategorie", "kategorie", kategorien)}
        <button class="btn-primary" style="margin-top:16px;" data-action="closeFilter">Anwenden</button>
      </div>
    </div>` : ""}
  </div>`;
}

/* ====================== STATS ====================== */
function computeAgg(list) {
  const finished = list.filter(b => b.status === "gelesen");
  // Seiten nur bei gedruckten Büchern/E-Books zählen (Hörbücher haben oft zusätzlich
  // eine "gedruckte Äquivalent"-Seitenzahl gespeichert, die sonst doppelt zählen würde)
  const seiten = finished.filter(b => b.art !== "hoerbuch").reduce((s, b) => s + (b.seiten || 0), 0);
  const stunden = finished.filter(b => b.art === "hoerbuch").reduce((s, b) => s + hoursOf(b), 0);
  const rated = finished.filter(b => b.bewertung > 0);
  const avgRating = rated.length ? rated.reduce((s, b) => s + b.bewertung, 0) / rated.length : 0;
  const durations = finished.map(readDays).filter(d => d !== null);
  const avgDuration = durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
  return { count: finished.length, seiten, stunden, avgRating, avgDuration };
}
function kpiHTML(label, value) {
  return `<div class="kpi"><span class="label">${label}</span><span class="value">${value}</span></div>`;
}
function lineChartSVG(data, width, height) {
  const max = Math.max(1, ...data.map(d => d.count));
  const padL = 26, padB = 22, padT = 16, padR = 8;
  const w = width - padL - padR, h = height - padT - padB;
  const stepX = w / (data.length - 1);
  const pts = data.map((d, i) => {
    const x = padL + i * stepX;
    const y = padT + h - (d.count / max) * h;
    return { x, y, ...d };
  });
  const path = pts.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ");
  const gridLines = [0, 0.5, 1].map(f => padT + h * f);
  return `<svg viewBox="0 0 ${width} ${height}" style="width:100%;height:${height}px;">
    ${gridLines.map(y => `<line x1="${padL}" y1="${y}" x2="${width-padR}" y2="${y}" stroke="rgba(242,233,220,0.06)"/>`).join("")}
    <path d="${path}" fill="none" stroke="#C99A4B" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${pts.map(p => `<circle cx="${p.x}" cy="${p.y}" r="3" fill="#C99A4B"/>
      <text x="${p.x}" y="${p.y-8}" text-anchor="middle" font-size="10" fill="#F2E9DC">${p.count}</text>
      <text x="${p.x}" y="${height-4}" text-anchor="middle" font-size="10" fill="#6E675C">${p.name}</text>`).join("")}
  </svg>`;
}

function renderStats() {
  const b = state.books;
  const overall = computeAgg(b);
  const yearBooks = b.filter(x => x.status === "gelesen" && x.leseende?.startsWith(String(state.statsYear)));
  const yearAgg = computeAgg(yearBooks);
  const counts = Array(12).fill(0);
  yearBooks.forEach(x => { const m = parseInt(x.leseende.slice(5,7), 10) - 1; counts[m]++; });
  const chartData = MONTH_NAMES.map((name, i) => ({ name, count: counts[i] }));

  const mk = state.monthCursor;
  const monthKey = `${mk.y}-${String(mk.m + 1).padStart(2,"0")}`;
  const monthBooks = b.filter(x => x.status === "gelesen" && x.leseende?.startsWith(monthKey));
  const monthAgg = computeAgg(monthBooks);

  let body = "";
  if (state.statsMode === "gesamt") {
    body = `<div class="ring-wrap" style="margin:8px 0 18px;">${ringSVG(overall.count, b.length, 180, 14)}</div>
      ${kpiHTML("Bücher gesamt", b.length)}
      ${kpiHTML("Beendet", overall.count)}
      ${kpiHTML("Gelesen", fmtNum(overall.seiten) + " Seiten")}
      ${kpiHTML("Gehört", fmt1(overall.stunden) + " Stunden")}
      ${kpiHTML("Ø Bewertung", fmt1(overall.avgRating) + " / 5 Sterne")}
      ${kpiHTML("Ø Lesedauer pro Buch", fmt1(overall.avgDuration) + " Tage")}`;
  } else if (state.statsMode === "jahr") {
    body = `<div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:4px;">
        <button class="iconbtn" data-action="yearPrev">${ICONS.chevL}</button>
        <span class="serif" style="font-size:20px;min-width:60px;text-align:center;">${state.statsYear}</span>
        <button class="iconbtn" data-action="yearNext">${ICONS.chevR}</button>
      </div>
      <p class="faint" style="text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Gelesene Bücher</p>
      <div style="margin-bottom:10px;">${lineChartSVG(chartData, 340, 200)}</div>
      ${kpiHTML("Beendet", yearAgg.count + " Bücher")}
      ${kpiHTML("Gelesen", fmtNum(yearAgg.seiten) + " Seiten")}
      ${kpiHTML("Gehört", fmt1(yearAgg.stunden) + " Stunden")}
      ${kpiHTML("Ø Bewertung", fmt1(yearAgg.avgRating) + " / 5 Sterne")}
      ${kpiHTML("Ø Lesedauer pro Buch", fmt1(yearAgg.avgDuration) + " Tage")}`;
  } else {
    body = `<div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:14px;">
        <button class="iconbtn" data-action="monthPrev">${ICONS.chevL}</button>
        <span class="serif" style="font-size:20px;min-width:140px;text-align:center;">${MONTH_NAMES[mk.m]} ${mk.y}</span>
        <button class="iconbtn" data-action="monthNext">${ICONS.chevR}</button>
      </div>
      ${kpiHTML("Beendet", monthAgg.count + " Bücher")}
      ${kpiHTML("Gelesen", fmtNum(monthAgg.seiten) + " Seiten")}
      ${kpiHTML("Gehört", fmt1(monthAgg.stunden) + " Stunden")}
      ${kpiHTML("Ø Bewertung", fmt1(monthAgg.avgRating) + " / 5 Sterne")}
      ${kpiHTML("Ø Lesedauer pro Buch", fmt1(monthAgg.avgDuration) + " Tage")}`;
  }

  return `<div class="view"><div class="pad">
    <h1 style="font-size:22px;margin-bottom:14px;">Statistik</h1>
    <div class="segmented">
      <button class="${state.statsMode==='gesamt'?'active':''}" data-action="statsMode" data-mode="gesamt">Gesamt</button>
      <button class="${state.statsMode==='monat'?'active':''}" data-action="statsMode" data-mode="monat">Monat</button>
      <button class="${state.statsMode==='jahr'?'active':''}" data-action="statsMode" data-mode="jahr">Jahr</button>
    </div>
    ${body}
  </div></div>`;
}

/* ====================== DETAIL / EDIT ====================== */
function fieldHTML(label, inner) {
  return `<div class="field"><label>${label}</label>${inner}</div>`;
}
function renderDetail() {
  const b = state.draft;
  return `<div class="view">
    <div class="detailhead">
      <button class="backbtn" data-action="backFromDetail">${ICONS.back} Zurück</button>
      <span class="muted serif" style="font-size:15px;">${state.isNew ? "Neues Buch" : "Bearbeiten"}</span>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;padding:6px 0 6px;">
      <div id="coverPreviewWrap">${coverHTML(b, 110)}</div>
      <div style="display:flex;gap:14px;margin-top:8px;">
        <button type="button" style="background:none;border:none;color:var(--brass);font-size:12.5px;cursor:pointer;" data-action="pickCoverFile">Foto hochladen</button>
        <button type="button" style="background:none;border:none;color:var(--brass);font-size:12.5px;cursor:pointer;" data-action="pasteCoverUrl">Bild-URL einfügen</button>
        ${b.cover ? `<button type="button" style="background:none;border:none;color:var(--st-abbruch);font-size:12.5px;cursor:pointer;" data-action="removeCover">Entfernen</button>` : ""}
      </div>
      <input type="file" id="coverFileInput" accept="image/*" style="display:none;" />
    </div>
    <div class="pad" style="padding-top:0;padding-bottom:100px;">
      ${fieldHTML("Titel", `<input id="f_titel" value="${esc(b.titel)}" />`)}
      ${fieldHTML("Autor", `<input id="f_autor" value="${esc(b.autor)}" />`)}
      <div class="row2">
        ${fieldHTML("Genre", `<input id="f_genre" value="${esc(b.genre)}" />`)}
        ${fieldHTML("Erscheinungsjahr", `<input id="f_jahr" value="${esc(b.jahr)}" />`)}
      </div>
      ${fieldHTML("Art", `<select id="f_art">${Object.entries(ART_META).map(([k,v])=>`<option value="${k}" ${b.art===k?"selected":""}>${v}</option>`).join("")}</select>`)}
      <div id="durationFields">
        ${b.art === "hoerbuch"
          ? `<div class="row2">${fieldHTML("Stunden", `<input type="number" id="f_stunden" value="${b.dauerStunden}" />`)}${fieldHTML("Minuten", `<input type="number" id="f_minuten" value="${b.dauerMinuten}" />`)}</div>`
          : fieldHTML("Seitenanzahl", `<input type="number" id="f_seiten" value="${b.seiten}" />`)}
      </div>
      <div class="row2">
        ${fieldHTML("Erhalten als", `<select id="f_erhaltenAls">${Object.entries(ERHALTEN_META).map(([k,v])=>`<option value="${k}" ${b.erhaltenAls===k?"selected":""}>${v}</option>`).join("")}</select>`)}
        ${fieldHTML("Preis (€)", `<input type="number" step="0.01" id="f_preis" value="${b.preis}" />`)}
      </div>
      ${fieldHTML("Lesestatus", `<select id="f_status">${TABS.map(t=>`<option value="${t.key}" ${b.status===t.key?"selected":""}>${t.label}</option>`).join("")}</select>`)}
      <div class="row2">
        ${fieldHTML("Lesebeginn", `<input type="date" id="f_lesebeginn" value="${b.lesebeginn||''}" />`)}
        ${fieldHTML("Leseende", `<input type="date" id="f_leseende" value="${b.leseende||''}" />`)}
      </div>
      ${fieldHTML("Kategorie", `<input id="f_kategorie" value="${esc(b.kategorie)}" />`)}
      ${fieldHTML("Bewertung", `<div class="stars">${[1,2,3,4,5].map(n=>`<span data-action="star" data-n="${n}">${ICONS.star(n<=b.bewertung)}</span>`).join("")}</div>`)}
      ${fieldHTML("Notizen", `<textarea id="f_notizen">${esc(b.notizen)}</textarea>`)}
      <button class="btn-primary" style="margin-top:6px;" data-action="saveBook">Buch speichern</button>
      ${!state.isNew ? `<button class="btn-ghost" data-action="deleteBook" data-id="${esc(b.id)}">Buch löschen</button>` : ""}
    </div>
  </div>`;
}

/* ====================== SETTINGS / IMPORT ====================== */
function splitCsvLine(line, delim) {
  const out = []; let cur = ""; let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') inQ = !inQ;
    else if (c === delim && !inQ) { out.push(cur); cur = ""; }
    else cur += c;
  }
  out.push(cur);
  return out;
}
function handleCsvFile(file) {
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const text = reader.result;
      const delimiter = text.split("\n")[0].includes(";") ? ";" : ",";
      const lines = text.split(/\r?\n/).filter(l => l.trim().length);
      const header = splitCsvLine(lines[0], delimiter).map(h => h.replace(/^\uFEFF/, ""));
      const rows = lines.slice(1).map(l => splitCsvLine(l, delimiter));
      const idx = name => header.indexOf(name);
      const statusMap = { "Gelesen":"gelesen","Am lesen":"am_lesen","Ungelesen":"ungelesen","Abgebrochen":"abgebrochen" };
      const artMap = { "Hörbuch":"hoerbuch","Hardcover":"hardcover","E-Book":"ebook","Taschenbuch":"taschenbuch" };
      const erhMap = { "Geschenk":"geschenk","Tausch":"tausch","Leihe":"leihe","Kauf":"kauf" };
      const parseDate = s => { if (!s) return null; const [d,m,y] = s.split("."); return d && m && y ? `${y}-${m}-${d}` : null; };
      const imported = rows.filter(r => r.length > 1).map((r, i) => ({
        id: "imp" + Date.now() + i,
        titel: (r[idx("Titel")] || "").trim(), autor: (r[idx("Autor(en)")] || "").trim(),
        isbn: (r[idx("ISBN")] || "").trim(), asin: (r[idx("ASIN")] || "").trim(),
        jahr: (r[idx("Erscheinungsjahr")] || "").trim(), genre: (r[idx("Genre")] || "").trim(),
        seiten: parseInt(r[idx("Seitenanzahl")]) || 0,
        dauerStunden: parseInt(r[idx("Dauer (Stunden)")]) || 0, dauerMinuten: parseInt(r[idx("Dauer (Minuten)")]) || 0,
        art: artMap[(r[idx("Buchart")] || "").trim()] || "taschenbuch",
        preis: parseFloat((r[idx("Preis")] || "0").replace(",", ".")) || 0,
        erhaltenAls: erhMap[(r[idx("Erhalten als")] || "").trim()] || "kauf",
        status: statusMap[(r[idx("Lesestatus")] || "").trim()] || "ungelesen",
        lesebeginn: parseDate((r[idx("Lesebeginn")] || "").trim()), leseende: parseDate((r[idx("Leseende")] || "").trim()),
        bewertung: parseInt(r[idx("Bewertung")]) || 0, kategorie: (r[idx("Kategorie")] || "").trim(),
        notizen: (r[idx("Notizen")] || "").trim(), erhaltenAm: parseDate((r[idx("Erhalten am")] || "").trim()), cover: null,
      })).filter(bk => bk.titel);
      await importBooks(imported);
      showToast(`${imported.length} Bücher importiert.`);
    } catch (e) {
      showToast("Import fehlgeschlagen: Datei-Format prüfen.");
    }
  };
  reader.readAsText(file, "utf-8");
}

function renderSettings() {
  return `<div class="view"><div class="pad">
    <h1 style="font-size:22px;margin-bottom:18px;">Mehr</h1>
    <div class="card">
      <h3 style="font-size:15px;margin-bottom:6px;">Bücher importieren</h3>
      <p class="muted" style="font-size:12.5px;margin:0 0 12px;line-height:1.5;">CSV-Export (z. B. aus Bookstats) hochladen. Neue Bücher werden zur Bibliothek hinzugefügt.</p>
      <button class="btn-outline" data-action="pickCsv">${ICONS.upload} CSV-Datei auswählen</button>
      <input type="file" id="csvInput" accept=".csv" style="display:none;" />
    </div>
    <div class="card">
      <h3 style="font-size:15px;margin-bottom:6px;">Cloud-Speicher</h3>
      <p class="muted" style="font-size:12.5px;margin:0 0 12px;line-height:1.5;">Verbinde Google Drive oder OneDrive, um deine Bibliothek geräteübergreifend zu sichern.</p>
      <button class="btn-outline" disabled style="opacity:.5;">${ICONS.cloud} Noch nicht eingerichtet</button>
    </div>
    <div class="card">
      <h3 style="font-size:15px;margin-bottom:6px;">Über diese App</h3>
      <p class="muted" style="font-size:12.5px;margin:0;line-height:1.6;">Deine persönliche Lese-Bibliothek · ${state.books.length} Bücher gespeichert. Daten werden aktuell lokal auf diesem Gerät gespeichert.</p>
    </div>
  </div></div>`;
}

function showToast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

/* ====================== EVENT HANDLING ====================== */
function attachHandlers() {
  appEl.querySelectorAll("[data-action]").forEach(el => {
    const action = el.getAttribute("data-action");
    el.addEventListener("click", (e) => {
      if (action === "nav") { setView(el.getAttribute("data-view")); }
      else if (action === "add") { addBook(); }
      else if (action === "open") { openBook(el.getAttribute("data-id")); }
      else if (action === "tab") { state.tab = el.getAttribute("data-tab"); render(); }
      else if (action === "toggleFilter") { state.showFilterSheet = true; render(); }
      else if (action === "closeFilter") { state.showFilterSheet = false; render(); }
      else if (action === "resetFilters") { state.filters = { jahr:"",monat:"",art:"",erhaltenAls:"",genre:"",kategorie:"" }; render(); }
      else if (action === "statsMode") { state.statsMode = el.getAttribute("data-mode"); render(); }
      else if (action === "yearPrev") { state.statsYear--; render(); }
      else if (action === "yearNext") { state.statsYear++; render(); }
      else if (action === "monthPrev") { let m = state.monthCursor.m - 1; state.monthCursor = m < 0 ? { y: state.monthCursor.y-1, m:11 } : { y: state.monthCursor.y, m }; render(); }
      else if (action === "monthNext") { let m = state.monthCursor.m + 1; state.monthCursor = m > 11 ? { y: state.monthCursor.y+1, m:0 } : { y: state.monthCursor.y, m }; render(); }
      else if (action === "backFromDetail") { history.back(); }
      else if (action === "saveGoal") {} // handled below via input
      else if (action === "star") { state.draft.bewertung = state.draft.bewertung === Number(el.getAttribute("data-n")) ? 0 : Number(el.getAttribute("data-n")); render(); }
      else if (action === "saveBook") { collectDraftFromForm(); saveBook(); }
      else if (action === "deleteBook") { if (confirm("Dieses Buch wirklich löschen?")) deleteBook(el.getAttribute("data-id")); }
      else if (action === "pickCsv") { document.getElementById("csvInput").click(); }
      else if (action === "shareList") { shareList(); }
      else if (action === "pickCoverFile") { document.getElementById("coverFileInput").click(); }
      else if (action === "pasteCoverUrl") {
        const url = prompt("Bild-URL einfügen:");
        if (url) { state.draft.cover = url.trim(); render(); }
      }
      else if (action === "removeCover") { state.draft.cover = null; render(); }
    });
  });

  // Ring click to edit goal
  const ringWrap = document.getElementById("ringWrap");
  if (ringWrap) ringWrap.addEventListener("click", () => {
    const ed = document.getElementById("goalEditor");
    ed.style.display = ed.style.display === "none" ? "flex" : "none";
  });
  const saveGoalBtn = appEl.querySelector('[data-action="saveGoal"]');
  if (saveGoalBtn) saveGoalBtn.addEventListener("click", async () => {
    const v = Number(document.getElementById("goalInput").value) || state.goal;
    await setGoal(v);
    render();
  });

  // Search input
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => { state.query = e.target.value; render(); });
    // restore focus/cursor after re-render
    searchInput.focus();
    const val = searchInput.value; searchInput.value = ""; searchInput.value = val;
  }

  // Filter selects
  appEl.querySelectorAll("[data-filter-key]").forEach(sel => {
    sel.addEventListener("change", (e) => { state.filters[sel.getAttribute("data-filter-key")] = e.target.value; render(); });
  });

  // Art select toggling duration/pages fields in detail view
  const artSelect = document.getElementById("f_art");
  if (artSelect) artSelect.addEventListener("change", (e) => {
    state.draft.art = e.target.value;
    collectDraftFromForm(true);
    render();
  });

  // CSV file input
  const csvInput = document.getElementById("csvInput");
  if (csvInput) csvInput.addEventListener("change", (e) => {
    if (e.target.files[0]) handleCsvFile(e.target.files[0]);
  });

  // Cover file input (resize to keep storage small)
  const coverFileInput = document.getElementById("coverFileInput");
  if (coverFileInput) coverFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxW = 400;
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        state.draft.cover = canvas.toDataURL("image/jpeg", 0.85);
        render();
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function collectDraftFromForm(skipArt) {
  const d = state.draft;
  const get = id => document.getElementById(id);
  if (get("f_titel")) d.titel = get("f_titel").value;
  if (get("f_autor")) d.autor = get("f_autor").value;
  if (get("f_genre")) d.genre = get("f_genre").value;
  if (get("f_jahr")) d.jahr = get("f_jahr").value;
  if (!skipArt && get("f_art")) d.art = get("f_art").value;
  if (get("f_stunden")) d.dauerStunden = Number(get("f_stunden").value) || 0;
  if (get("f_minuten")) d.dauerMinuten = Number(get("f_minuten").value) || 0;
  if (get("f_seiten")) d.seiten = Number(get("f_seiten").value) || 0;
  if (get("f_erhaltenAls")) d.erhaltenAls = get("f_erhaltenAls").value;
  if (get("f_preis")) d.preis = Number(get("f_preis").value) || 0;
  if (get("f_status")) d.status = get("f_status").value;
  if (get("f_lesebeginn")) d.lesebeginn = get("f_lesebeginn").value || null;
  if (get("f_leseende")) d.leseende = get("f_leseende").value || null;
  if (get("f_kategorie")) d.kategorie = get("f_kategorie").value;
  if (get("f_notizen")) d.notizen = get("f_notizen").value;
}

/* ====================== BROWSER-VERLAUF (Zurück-Taste) ====================== */
function pushHistory() {
  history.pushState({ view: state.view, selectedId: state.selectedId, isNew: state.isNew }, "", "#" + state.view);
}
window.addEventListener("popstate", (e) => {
  if (e.state) {
    state.view = e.state.view;
    state.selectedId = e.state.selectedId;
    state.isNew = e.state.isNew;
    if (state.view === "detail") {
      state.draft = state.isNew ? emptyBook() : { ...state.books.find(b => b.id === state.selectedId) };
    }
  } else {
    state.view = "home";
  }
  render();
});

boot().then(() => {
  history.replaceState({ view: "home", selectedId: null, isNew: false }, "", "#home");
});
