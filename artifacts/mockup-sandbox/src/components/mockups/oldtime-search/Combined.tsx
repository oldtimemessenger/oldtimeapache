import { useState } from "react";
import "./_group.css";

type Place = {
  name: string;
  detail: string;
  category: string;
  tone: string;
};

const trends = [
  { name: "Street portraits", note: "People & places", tone: "apricot" },
  { name: "Sunday cooking", note: "Food & culture", tone: "sage" },
  { name: "Small town sounds", note: "Music", tone: "lilac" },
  { name: "Everyday rituals", note: "Life & people", tone: "blue" },
  { name: "A walk after rain", note: "Places", tone: "rose" },
];

const feeds = [
  { name: "Field notes", by: "Public community feed", description: "Local stories, small discoveries, and the people behind them." },
  { name: "Kitchen table", by: "Public community feed", description: "Recipes and food traditions shared from home kitchens." },
  { name: "Side streets", by: "Public community feed", description: "A slower look at the places just beyond the main road." },
];

const places: Place[] = [
  { name: "Harbor Steps", detail: "A quiet place to watch the water turn gold.", category: "Waterfront · North Shore", tone: "harbor" },
  { name: "Juniper Market", detail: "Produce stalls, paper lanterns, and good conversation.", category: "Market · Old Quarter", tone: "market" },
  { name: "Cedar Loop", detail: "A shaded path that opens onto a wide view.", category: "Trail · West Ridge", tone: "trail" },
];

const previewVideos = [
  { title: "A morning at the flower stand", creator: "Mara Ellison", tone: "flowers", length: "0:38" },
  { title: "The last ferry of the day", creator: "Drew Park", tone: "ferry", length: "0:52" },
  { title: "How my aunt folds dumplings", creator: "Nina Chen", tone: "kitchen", length: "1:14" },
];

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.6" /><path d="m16 16 4.4 4.4" /></svg>;
}

function MapPinIcon() {
  return (
    <svg className="ot-map-icon" viewBox="0 0 64 64" role="img" aria-label="Folded map with location pin">
      <path d="m7 17 15-6 20 6 15-6v36l-15 6-20-6-15 6V17Z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M22 11v36M42 17v36" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
      <path d="M32 15c-6.2 0-11.2 5-11.2 11.2 0 8.2 11.2 20.3 11.2 20.3s11.2-12.1 11.2-20.3C43.2 20 38.2 15 32 15Z" fill="#f4e8da" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="32" cy="26.2" r="3.8" fill="currentColor" />
    </svg>
  );
}

export function Combined() {
  const [activeTab, setActiveTab] = useState<"videos" | "places">("videos");
  const [showExplore, setShowExplore] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState("For You");
  const [savedFeeds, setSavedFeeds] = useState<string[]>([]);

  const backToLanding = () => {
    setSelectedTrend(null);
    setShowExplore(false);
  };

  const visibleVideos = previewVideos.filter((video) => {
    const text = `${video.title} ${video.creator}`.toLowerCase();
    return !query.trim() || text.includes(query.trim().toLowerCase());
  });

  return (
    <main className="oldtime-search-preview oldtime-combined">
      <style>{`
        .oldtime-combined {
          --ot-ink:#20242b; --ot-muted:#727985; --ot-line:#e7e8e8; --ot-paper:#fbfaf7;
          --ot-blue:#2458bd; --ot-blue-soft:#eaf0fb; --ot-red:#c94d45;
          width:100%; max-width:390px; min-height:100dvh; margin:0 auto; overflow:hidden;
          background:var(--ot-paper); color:var(--ot-ink);
          font-family:"Avenir Next", "Trebuchet MS", ui-sans-serif, system-ui, sans-serif;
          position:relative; box-shadow:0 0 0 1px rgba(41,48,59,.06);
        }
        .oldtime-combined button { cursor:pointer; -webkit-tap-highlight-color:transparent; }
        .oldtime-combined button:focus-visible { outline:2px solid var(--ot-blue); outline-offset:2px; }
        .oldtime-combined .ot-header {
          min-height:62px; padding:0 17px; border-bottom:1px solid var(--ot-line); background:rgba(251,250,247,.96);
        }
        .oldtime-combined .ot-header h1 { color:var(--ot-ink); font-size:20px; font-weight:750; letter-spacing:-.035em; }
        .oldtime-combined .ot-header-actions { gap:5px; }
        .oldtime-combined .ot-layout-toggle {
          min-height:34px; padding:0 12px; border-color:#d8dfeb; background:#f0f3f8; color:#334d79;
          font-size:12px; font-weight:700; transition:background .16s, transform .16s;
        }
        .oldtime-combined .ot-layout-toggle:active { transform:scale(.97); background:#e6ebf4; }
        .oldtime-combined .ot-search-toggle { width:38px; height:38px; border-radius:50%; color:var(--ot-ink); }
        .oldtime-combined .ot-search-toggle svg { width:21px; height:21px; }
        .oldtime-combined .ot-close-mark { font-size:27px; font-weight:300; line-height:1; }
        .oldtime-combined .ot-back {
          display:flex; align-items:center; gap:8px; padding:0; border:0; background:none;
          color:var(--ot-blue); font-size:14px; font-weight:700;
        }
        .oldtime-combined .ot-back span:first-child { font-family:system-ui,sans-serif; font-size:29px; font-weight:300; line-height:1; }
        .oldtime-combined .ot-hub-tabs {
          margin:10px 16px 8px; padding:4px; border:1px solid #eceae5; background:#f0efeb;
        }
        .oldtime-combined .ot-hub-tabs button {
          display:flex; align-items:center; justify-content:center; gap:7px; min-height:42px;
          color:#787d83; font-size:13px; font-weight:700;
        }
        .oldtime-combined .ot-hub-tabs button[aria-selected="true"] { background:#fff; color:var(--ot-ink); box-shadow:0 1px 4px rgba(27,34,44,.1); }
        .oldtime-combined .ot-map-icon { width:23px; height:23px; color:#405a87; flex:0 0 auto; }
        .oldtime-combined .ot-search-field {
          display:flex; min-height:42px; align-items:center; gap:9px; margin:8px 17px 14px; padding:0 12px;
          border:1px solid #e5e8ed; border-radius:12px; background:#f1f2f2; color:#707985;
        }
        .oldtime-combined .ot-search-field svg { width:17px; height:17px; fill:none; stroke:currentColor; stroke-width:2; flex:0 0 auto; }
        .oldtime-combined .ot-search-field input { width:100%; min-width:0; min-height:40px; padding:0; border:0; outline:0; background:transparent; color:var(--ot-ink); font-size:14px; }
        .oldtime-combined .ot-search-field input::placeholder { color:#818791; }
        .oldtime-combined .ot-eyebrow {
          display:block; color:#80848a; font-size:9px; font-weight:800; letter-spacing:.14em; line-height:1.25;
        }
        .oldtime-combined .ot-topic-label-row {
          display:flex; align-items:flex-end; justify-content:space-between; gap:8px; padding:16px 18px 9px;
        }
        .oldtime-combined .ot-topic-label-row h2, .oldtime-combined .ot-section-head h2 {
          margin:4px 0 0; color:var(--ot-ink); font-size:18px; line-height:1.15; letter-spacing:-.04em; font-weight:750;
        }
        .oldtime-combined .ot-topic-label-row button, .oldtime-combined .ot-section-head > button {
          display:inline-flex; align-items:center; gap:5px; flex:0 0 auto; padding:4px 0; border:0; background:none;
          color:var(--ot-blue); font-size:12px; font-weight:700;
        }
        .oldtime-combined .ot-topic-label-row button span, .oldtime-combined .ot-section-head > button span { font-size:15px; }
        .oldtime-combined .ot-topic-row {
          display:flex; flex-wrap:wrap; gap:7px 8px; overflow-x:hidden; padding:3px 17px 13px; border:0;
        }
        .oldtime-combined .ot-topic-row button {
          min-height:31px; padding:0 11px; border:1px solid #e6e6e2; border-radius:999px; background:#fff;
          color:#666d77; font-size:11px; font-weight:650; transition:background .15s, color .15s;
        }
        .oldtime-combined .ot-topic-row button.is-active { border-color:#d4deef; background:var(--ot-blue-soft); color:#294f90; }
        .oldtime-combined .ot-trend-section { margin-top:2px; padding:17px 0 13px; border-top:1px solid var(--ot-line); border-bottom:1px solid var(--ot-line); background:#f6f5f1; }
        .oldtime-combined .ot-section-head { display:flex; align-items:flex-end; justify-content:space-between; gap:10px; padding:0 18px 12px; }
        .oldtime-combined .ot-section-head h2 { font-size:18px; }
        .oldtime-combined .ot-trend-rail {
          display:flex; width:100%; gap:10px; overflow-x:auto; overscroll-behavior-x:contain; padding:1px 18px 6px;
          scrollbar-width:none; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;
        }
        .oldtime-combined .ot-trend-rail::-webkit-scrollbar { display:none; }
        .oldtime-combined .ot-trend-card {
          position:relative; display:flex; width:146px; min-width:146px; height:140px; flex:0 0 146px; flex-direction:column;
          justify-content:flex-end; overflow:hidden; padding:13px; border:1px solid rgba(34,44,54,.08); border-radius:14px;
          color:#263039; text-align:left; scroll-snap-align:start; transition:transform .18s;
        }
        .oldtime-combined .ot-trend-card:active { transform:scale(.97); }
        .oldtime-combined .tone-apricot { background:#f1ddd0; }
        .oldtime-combined .tone-sage { background:#dfe7d8; }
        .oldtime-combined .tone-lilac { background:#e5e1eb; }
        .oldtime-combined .tone-blue { background:#dce5ed; }
        .oldtime-combined .tone-rose { background:#eedfe0; }
        .oldtime-combined .ot-trend-index { position:absolute; top:12px; left:13px; color:rgba(39,48,57,.55); font:700 10px/1 ui-monospace,monospace; letter-spacing:.08em; }
        .oldtime-combined .ot-trend-orbit {
          position:absolute; top:5px; right:4px; width:74px; height:74px; border:1px solid rgba(59,72,81,.17); border-radius:50%;
        }
        .oldtime-combined .ot-trend-orbit::before, .oldtime-combined .ot-trend-orbit::after {
          position:absolute; content:""; border:1px solid rgba(59,72,81,.14); border-radius:50%;
        }
        .oldtime-combined .ot-trend-orbit::before { inset:10px -8px; transform:rotate(32deg); }
        .oldtime-combined .ot-trend-orbit::after { inset:-8px 10px; transform:rotate(-28deg); }
        .oldtime-combined .ot-trend-orbit i { position:absolute; right:13px; bottom:14px; width:8px; height:8px; border-radius:50%; background:rgba(52,71,94,.55); }
        .oldtime-combined .ot-trend-card strong { position:relative; z-index:1; max-width:112px; font-size:14px; line-height:1.16; letter-spacing:-.03em; }
        .oldtime-combined .ot-trend-card small { position:relative; z-index:1; margin-top:5px; color:#5d646b; font-size:10px; }
        .oldtime-combined .ot-card-arrow { position:absolute; right:12px; bottom:12px; color:#4d5963; font-size:14px; }
        .oldtime-combined .ot-rail-hint { margin:5px 18px 0; color:#909296; font-size:10px; }
        .oldtime-combined .ot-videos-section { padding:19px 0 25px; }
        .oldtime-combined .ot-video-section-head { padding-bottom:5px; }
        .oldtime-combined .ot-video-section-head > button { padding-bottom:1px; }
        .oldtime-combined .ot-video-section-head > button svg { width:15px; height:15px; fill:none; stroke:currentColor; stroke-width:2; }
        .oldtime-combined .ot-preview-label { margin:0; padding:0 18px 8px; color:#9a9a97; font-size:9px; font-weight:600; letter-spacing:.02em; }
        .oldtime-combined .ot-video-list { padding:0 16px; }
        .oldtime-combined .ot-video-item { display:flex; min-width:0; align-items:center; gap:11px; padding:9px 0; border-bottom:1px solid #ecebe7; }
        .oldtime-combined .ot-video-thumb {
          position:relative; display:grid; width:104px; height:67px; flex:0 0 104px; place-items:center; overflow:hidden; border-radius:9px;
          background:#d9c9b7;
        }
        .oldtime-combined .ot-video-thumb::before, .oldtime-combined .ot-video-thumb::after { position:absolute; content:""; }
        .oldtime-combined .thumb-flowers { background:linear-gradient(145deg,#e8d8bf 0 43%,#a7aa85 44% 65%,#d7a1a2 66%); }
        .oldtime-combined .thumb-flowers::before { inset:14px 50px -12px 15px; border-radius:50% 50% 12% 12%; background:#d6b994; transform:rotate(17deg); }
        .oldtime-combined .thumb-ferry { background:linear-gradient(155deg,#a8c2cc 0 44%,#819eaa 45% 62%,#e3c9a4 63%); }
        .oldtime-combined .thumb-ferry::before { left:15px; right:11px; bottom:17px; height:13px; background:#f3eee3; clip-path:polygon(10% 0,88% 0,100% 100%,0 100%); }
        .oldtime-combined .thumb-ferry::after { left:0; right:0; bottom:0; height:14px; background:rgba(50,86,103,.24); }
        .oldtime-combined .thumb-kitchen { background:linear-gradient(140deg,#d2b093,#e5d5bd 50%,#85917d); }
        .oldtime-combined .thumb-kitchen::before { width:37px; height:37px; border:5px solid rgba(255,248,231,.78); border-radius:50%; background:#c1a273; }
        .oldtime-combined .ot-play-icon { position:relative; z-index:1; display:grid; width:25px; height:25px; place-items:center; border-radius:50%; background:rgba(28,35,43,.72); }
        .oldtime-combined .ot-play-icon i { width:0; height:0; margin-left:2px; border-top:4px solid transparent; border-bottom:4px solid transparent; border-left:6px solid white; }
        .oldtime-combined .ot-video-thumb small { position:absolute; right:5px; bottom:4px; padding:2px 4px; border-radius:3px; background:rgba(27,31,34,.7); color:white; font-size:8px; }
        .oldtime-combined .ot-video-copy { min-width:0; flex:1; }
        .oldtime-combined .ot-video-copy h3 { margin:0; color:#30343a; font-size:12px; line-height:1.35; font-weight:700; }
        .oldtime-combined .ot-video-copy p { margin:4px 0 0; color:#85888c; font-size:10px; }
        .oldtime-combined .ot-video-more { display:grid; width:30px; height:34px; flex:0 0 30px; place-items:center; border:0; background:transparent; color:#76808b; font-size:19px; font-weight:400; }
        .oldtime-combined .ot-video-more.is-saved { color:var(--ot-blue); font-weight:700; }
        .oldtime-combined .ot-places-page { padding-bottom:24px; }
        .oldtime-combined .ot-places-intro {
          position:relative; overflow:hidden; padding:26px 19px 23px; border-bottom:1px solid var(--ot-line);
          background:linear-gradient(112deg,#eff2ef,#e9eef1 62%,#e3e9ee);
        }
        .oldtime-combined .ot-map-art {
          position:absolute; top:16px; right:10px; display:grid; width:96px; height:96px; place-items:center;
          color:#49627f; transform:rotate(7deg); opacity:.88;
        }
        .oldtime-combined .ot-map-art .ot-map-icon { width:88px; height:88px; }
        .oldtime-combined .ot-places-intro h2, .oldtime-combined .ot-explore-intro h2 {
          position:relative; z-index:1; margin:11px 0 8px; color:#26323a; font-size:25px; line-height:1.07; letter-spacing:-.055em;
        }
        .oldtime-combined .ot-places-intro p, .oldtime-combined .ot-explore-intro p {
          position:relative; z-index:1; max-width:263px; margin:0; color:#647079; font-size:12px; line-height:1.5;
        }
        .oldtime-combined .ot-places-head { padding-top:21px; }
        .oldtime-combined .ot-place-list { padding:0 16px; }
        .oldtime-combined .ot-place-card { display:flex; align-items:center; gap:11px; padding:11px 0; border-bottom:1px solid var(--ot-line); }
        .oldtime-combined .ot-place-art {
          position:relative; width:75px; height:76px; flex:0 0 75px; overflow:hidden; border-radius:11px; background:#b9c6c1;
        }
        .oldtime-combined .ot-place-art::before, .oldtime-combined .ot-place-art::after, .oldtime-combined .ot-place-art span, .oldtime-combined .ot-place-art i { position:absolute; content:""; }
        .oldtime-combined .place-harbor { background:linear-gradient(160deg,#a9c4cf 0 48%,#708d9b 49% 66%,#dfc9a7 67%); }
        .oldtime-combined .place-harbor::before { right:-5px; bottom:5px; left:10px; height:28px; background:rgba(243,229,203,.7); clip-path:polygon(20% 35%,100% 0,87% 100%,0 78%); }
        .oldtime-combined .place-market { background:linear-gradient(140deg,#e1c3a0,#b4a783 56%,#8d9a78); }
        .oldtime-combined .place-market::before { inset:13px 7px 10px; border-top:8px solid #cc725a; background:repeating-linear-gradient(90deg,#d9c9a6 0 12px,#a4a382 12px 23px); }
        .oldtime-combined .place-market::after { left:7px; right:7px; top:14px; height:10px; background:#d8896d; clip-path:polygon(0 0,100% 0,85% 100%,15% 100%); }
        .oldtime-combined .place-trail { background:linear-gradient(145deg,#a9b999,#d4d1b7 52%,#8c9f91); }
        .oldtime-combined .place-trail::before { left:32px; bottom:-7px; width:14px; height:75px; background:#e4ddc7; transform:rotate(25deg); }
        .oldtime-combined .ot-place-info { min-width:0; flex:1; }
        .oldtime-combined .ot-place-info > span { color:#747d80; font-size:9px; font-weight:650; }
        .oldtime-combined .ot-place-info h3 { margin:4px 0 3px; font-size:13px; line-height:1.2; }
        .oldtime-combined .ot-place-info p { margin:0; color:#7a8083; font-size:10px; line-height:1.35; }
        .oldtime-combined .ot-place-card > button { width:28px; height:32px; flex:0 0 28px; border:0; background:none; color:#718092; font-size:23px; font-weight:300; }
        .oldtime-combined .ot-explore-intro { padding:23px 19px 22px; border-bottom:1px solid var(--ot-line); background:#f0f1ed; }
        .oldtime-combined .ot-explore-intro h2 { margin-top:9px; font-size:29px; }
        .oldtime-combined .ot-full-section-head { padding:20px 18px 11px; }
        .oldtime-combined .ot-full-section-head h2 { font-size:19px; }
        .oldtime-combined .ot-full-trends { margin:0 16px; border-top:1px solid var(--ot-line); }
        .oldtime-combined .ot-full-trend {
          display:grid; width:100%; grid-template-columns:29px 1fr 16px; align-items:center; gap:9px; min-height:59px;
          padding:8px 3px; border:0; border-bottom:1px solid var(--ot-line); background:none; color:var(--ot-ink); text-align:left;
        }
        .oldtime-combined .ot-full-rank { color:#8b9192; font:700 10px/1 ui-monospace,monospace; }
        .oldtime-combined .ot-full-trend strong { display:block; font-size:13px; }
        .oldtime-combined .ot-full-trend small { display:block; margin-top:3px; color:#858a8d; font-size:10px; }
        .oldtime-combined .ot-chevron { color:#7e8994; font-size:20px; }
        .oldtime-combined .ot-feeds { padding:0 16px; }
        .oldtime-combined .ot-feed-card { display:flex; align-items:flex-start; gap:10px; padding:13px 0; border-bottom:1px solid var(--ot-line); }
        .oldtime-combined .ot-feed-avatar { display:grid; width:34px; height:34px; flex:0 0 34px; place-items:center; border-radius:11px; background:#e5eaf1; color:#3e587e; font-size:14px; font-weight:750; }
        .oldtime-combined .ot-feed-copy { min-width:0; flex:1; }
        .oldtime-combined .ot-feed-copy h3 { margin:0; font-size:13px; line-height:1.25; }
        .oldtime-combined .ot-feed-copy small { display:block; margin-top:2px; color:#858a91; font-size:9px; }
        .oldtime-combined .ot-feed-copy p { margin:6px 0 0; color:#5f6872; font-size:11px; line-height:1.4; }
        .oldtime-combined .ot-pin-feed { min-width:56px; min-height:30px; padding:0 9px; border:1px solid #d8deea; border-radius:99px; background:#fff; color:#35558d; font-size:10px; font-weight:700; }
        .oldtime-combined .ot-pin-feed.saved { border-color:#dce3ed; background:#edf1f6; color:#5d6b7d; }
        .oldtime-combined .ot-feed-preview-label { padding-top:9px; }
        .oldtime-combined .ot-topic-results { padding:22px 0 25px; }
        .oldtime-combined .ot-topic-heading { padding:0 19px 17px; }
        .oldtime-combined .ot-topic-heading h2 { margin:8px 0 5px; color:#28323b; font-size:26px; line-height:1.1; letter-spacing:-.045em; }
        .oldtime-combined .ot-topic-heading p { margin:0; color:#6c737c; font-size:12px; line-height:1.45; }
        .oldtime-combined .ot-topic-results .ot-preview-label { padding-top:3px; }
        .oldtime-combined .ot-empty-state { display:grid; min-height:150px; place-content:center; justify-items:center; padding:20px; color:#747d85; text-align:center; }
        .oldtime-combined .ot-empty-state > svg { width:25px; height:25px; margin-bottom:9px; fill:none; stroke:currentColor; stroke-width:1.8; }
        .oldtime-combined .ot-empty-state strong { color:#3b434a; font-size:13px; }
        .oldtime-combined .ot-empty-state p { margin:5px 0 0; font-size:11px; }
        .oldtime-combined .ot-bottom-nav {
          position:sticky; z-index:5; bottom:0; display:grid; grid-template-columns:repeat(5,1fr); gap:0;
          margin-top:auto; padding:8px 5px max(8px, env(safe-area-inset-bottom)); border-top:1px solid #e5e5e2;
          background:rgba(251,250,247,.97); color:#777d84; backdrop-filter:blur(10px);
        }
        .oldtime-combined .ot-bottom-nav > span { display:grid; min-width:0; justify-items:center; gap:3px; padding:1px 0; color:#777d84; }
        .oldtime-combined .ot-bottom-nav > span > svg { width:19px; height:19px; fill:none; stroke:currentColor; stroke-width:1.65; stroke-linecap:round; stroke-linejoin:round; }
        .oldtime-combined .ot-bottom-nav > span > span { font-size:9px; line-height:1.2; }
        .oldtime-combined .ot-bottom-nav > span.is-active { color:var(--ot-blue); }
        .oldtime-combined .ot-bottom-nav > span.is-active > span { font-weight:750; }
        @media (max-width:360px) {
          .oldtime-combined .ot-header { padding-right:12px; padding-left:13px; }
          .oldtime-combined .ot-trend-card { width:137px; min-width:137px; flex-basis:137px; }
          .oldtime-combined .ot-video-thumb { width:90px; flex-basis:90px; }
        }
      `}</style>
      <header className="search-app-header ot-header">
        {selectedTrend ? (
          <button className="ot-back" type="button" onClick={() => setSelectedTrend(null)} aria-label="Back to trends">
            <span aria-hidden="true">‹</span><span>Trending</span>
          </button>
        ) : (
          <h1>{showExplore ? "Explore" : "Search"}</h1>
        )}
        <div className="header-actions ot-header-actions">
          <button className="search-layout-toggle ot-layout-toggle" type="button" onClick={() => {
            setSelectedTrend(null);
            setShowExplore((current) => !current);
          }}>
            {showExplore ? "Videos & Places" : "Explore"}
          </button>
          {!showExplore && !selectedTrend && (
            <button className={`discovery-search-toggle ot-search-toggle ${searchOpen ? "is-on" : ""}`} type="button"
              aria-label={searchOpen ? "Close search" : "Search videos"} aria-expanded={searchOpen}
              onClick={() => { setSearchOpen((open) => !open); setQuery(""); }}>
              {searchOpen ? <span className="ot-close-mark" aria-hidden="true">×</span> : <SearchIcon />}
            </button>
          )}
        </div>
      </header>

      {selectedTrend ? (
        <section className="ot-topic-results" aria-label={`Videos about ${selectedTrend}`}>
          <div className="ot-topic-heading">
            <span className="ot-eyebrow">PUBLIC VIDEOS</span>
            <h2>#{selectedTrend}</h2>
            <p>Recent videos shared by people in the community.</p>
          </div>
          <p className="ot-preview-label">Illustrative preview content</p>
          <VideoList videos={previewVideos} />
        </section>
      ) : showExplore ? (
        <section className="ot-explore-page" aria-label="Trends and public Discover feeds">
          <div className="ot-explore-intro">
            <span className="ot-eyebrow">PUBLIC DISCOVERY</span>
            <h2>Find what people<br />are sharing.</h2>
            <p>Trends and public feeds, without the noise.</p>
          </div>
          <SectionHeading title="Trending" detail="Topics from across Oldtime" />
          <div className="ot-full-trends">
            {trends.map((trend, index) => (
              <button className="ot-full-trend" type="button" key={trend.name} onClick={() => setSelectedTrend(trend.name)}>
                <span className="ot-full-rank">{String(index + 1).padStart(2, "0")}</span>
                <span><strong>{trend.name}</strong><small>{trend.note}</small></span>
                <span className="ot-chevron" aria-hidden="true">›</span>
              </button>
            ))}
          </div>
          <SectionHeading title="Discover feeds" detail="Public posts from community lists" />
          <div className="ot-feeds">
            {feeds.map((feed) => (
              <article className="ot-feed-card" key={feed.name}>
                <div className="ot-feed-avatar" aria-hidden="true">{feed.name.slice(0, 1)}</div>
                <div className="ot-feed-copy">
                  <h3>{feed.name}</h3><small>{feed.by}</small><p>{feed.description}</p>
                </div>
                <button className={`ot-pin-feed ${savedFeeds.includes(feed.name) ? "saved" : ""}`} type="button"
                  aria-pressed={savedFeeds.includes(feed.name)}
                  onClick={() => setSavedFeeds((current) => current.includes(feed.name) ? current.filter((name) => name !== feed.name) : [...current, feed.name])}>
                  {savedFeeds.includes(feed.name) ? "Pinned" : "Pin"}
                </button>
              </article>
            ))}
          </div>
          <p className="ot-preview-label ot-feed-preview-label">Illustrative preview content</p>
        </section>
      ) : (
        <>
          <nav className="search-hub-tabs ot-hub-tabs" aria-label="Search sections" role="tablist">
            <button type="button" role="tab" aria-selected={activeTab === "videos"} onClick={() => setActiveTab("videos")}>Videos</button>
            <button type="button" role="tab" aria-selected={activeTab === "places"} onClick={() => setActiveTab("places")}>
              <MapPinIcon /><span>Places</span>
            </button>
          </nav>
          {searchOpen && (
            <label className="ot-search-field">
              <SearchIcon />
              <input value={query} onChange={(event) => setQuery(event.target.value)}
                placeholder={activeTab === "places" ? "Search places" : "Search videos"} aria-label={`Search ${activeTab}`} />
            </label>
          )}
          {activeTab === "videos" ? (
            <>
              <div className="ot-topic-label-row">
                <div><span className="ot-eyebrow">A GOOD PLACE TO START</span><h2>Explore by interest</h2></div>
                <button type="button" onClick={() => setShowExplore(true)}>See all <span aria-hidden="true">↗</span></button>
              </div>
              <nav className="topic-row ot-topic-row" aria-label="Discover topics">
                {["For You", "Interests", "Around the World", "Culture", "Comedy", "Music"].map((topic) => (
                  <button type="button" key={topic} aria-pressed={activeTopic === topic}
                    className={activeTopic === topic ? "is-active" : ""}
                    onClick={() => setActiveTopic(topic)}>{topic}</button>
                ))}
              </nav>
              <section className="ot-trend-section" aria-label="Trending topics">
                <div className="ot-section-head">
                  <div><span className="ot-eyebrow">PUBLIC CONVERSATION</span><h2>Trending now</h2></div>
                  <button type="button" onClick={() => setShowExplore(true)}>See all <span aria-hidden="true">↗</span></button>
                </div>
                <div className="ot-trend-rail">
                  {trends.map((trend, index) => (
                    <button type="button" className={`ot-trend-card tone-${trend.tone}`} key={trend.name}
                      onClick={() => setSelectedTrend(trend.name)}>
                      <span className="ot-trend-index">{String(index + 1).padStart(2, "0")}</span>
                      <span className="ot-trend-orbit" aria-hidden="true"><i /></span>
                      <strong>{trend.name}</strong><small>{trend.note}</small>
                      <span className="ot-card-arrow" aria-hidden="true">↗</span>
                    </button>
                  ))}
                </div>
                <p className="ot-rail-hint">Swipe to explore topics</p>
              </section>
              <section className="ot-videos-section" aria-label="Videos to explore">
                <div className="ot-section-head ot-video-section-head">
                  <div><span className="ot-eyebrow">FROM THE COMMUNITY</span><h2>Videos to explore</h2></div>
                  <button type="button" onClick={() => { setSearchOpen(true); setQuery(""); }}>Search <SearchIcon /></button>
                </div>
                <p className="ot-preview-label">Illustrative preview content</p>
                <VideoList videos={visibleVideos} />
              </section>
            </>
          ) : (
            <section className="ot-places-page" aria-label="Places to explore">
              <div className="ot-places-intro">
                <div className="ot-map-art"><MapPinIcon /></div>
                <span className="ot-eyebrow">PLACES, SHARED BY PEOPLE</span>
                <h2>Somewhere worth<br />taking the long way.</h2>
                <p>Find local corners, familiar landmarks, and places seen through someone else’s eyes.</p>
              </div>
              <div className="ot-section-head ot-places-head">
                <div><span className="ot-eyebrow">COMMUNITY PICKS</span><h2>Places to explore</h2></div>
                <button type="button" onClick={() => { setSearchOpen(true); setQuery(""); }}>Search <SearchIcon /></button>
              </div>
              <div className="ot-place-list">
                {places.filter((place) => !query || `${place.name} ${place.category}`.toLowerCase().includes(query.toLowerCase())).map((place) => (
                  <article className="ot-place-card" key={place.name}>
                    <div className={`ot-place-art place-${place.tone}`} aria-hidden="true"><span /><i /></div>
                    <div className="ot-place-info"><span>{place.category}</span><h3>{place.name}</h3><p>{place.detail}</p></div>
                    <button type="button" aria-label={`View ${place.name}`} onClick={() => setQuery(place.name)}>›</button>
                  </article>
                ))}
                {!places.some((place) => !query || `${place.name} ${place.category}`.toLowerCase().includes(query.toLowerCase())) &&
                  <div className="ot-empty-state"><MapPinIcon /><strong>No places found</strong><p>Try another name or neighborhood.</p></div>}
              </div>
              <p className="ot-preview-label">Illustrative preview content</p>
            </section>
          )}
        </>
      )}

      <nav className="bottom-nav ot-bottom-nav" aria-label="Main navigation">
        {["Home", "Community", "Create", "Messages", "Search"].map((item) => (
          <span className={item === "Search" ? "is-active" : ""} key={item}>
            <NavIcon name={item} /><span>{item}</span>
          </span>
        ))}
      </nav>
    </main>
  );
}

function SectionHeading({ title, detail }: { title: string; detail: string }) {
  return <div className="ot-section-head ot-full-section-head"><div><span className="ot-eyebrow">{detail}</span><h2>{title}</h2></div></div>;
}

function VideoList({ videos }: { videos: typeof previewVideos }) {
  if (!videos.length) {
    return <div className="ot-empty-state"><SearchIcon /><strong>No matching videos</strong><p>Try another word or topic.</p></div>;
  }
  return (
    <div className="ot-video-list">
      {videos.map((video) => (
        <article className="ot-video-item" key={video.title}>
          <div className={`ot-video-thumb thumb-${video.tone}`} aria-hidden="true">
            <span className="ot-play-icon"><i /></span><small>{video.length}</small>
          </div>
          <div className="ot-video-copy"><h3>{video.title}</h3><p>{video.creator}</p></div>
        </article>
      ))}
    </div>
  );
}

function NavIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    Home: "M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-9ZM9 21v-7h6v7",
    Community: "M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6M23 11h-6",
    Create: "M12 5v14M5 12h14",
    Messages: "M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z",
    Search: "M10.8 17.4a6.6 6.6 0 1 0 0-13.2 6.6 6.6 0 0 0 0 13.2ZM16 16l4.4 4.4",
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[name]} /></svg>;
}
