import { Link } from "react-router-dom";
import { useState, useMemo, useEffect, useRef } from "react";
import data from "../data/Tutorials.json";

// ─── Keyframes ────────────────────────────────────────────────────────────────
const STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .anim-fade-up { animation: fadeUp 0.5s cubic-bezier(.22,.68,0,1.2) both; }
  .anim-fade-in { animation: fadeIn 0.4s ease both; }
  .d0 { animation-delay: 0s;    }
  .d1 { animation-delay: 0.06s; }
  .d2 { animation-delay: 0.12s; }
  .d3 { animation-delay: 0.18s; }
  .d4 { animation-delay: 0.24s; }
  .d5 { animation-delay: 0.30s; }
`;

const PER_PAGE = 6;

// ─── Type icon ────────────────────────────────────────────────────────────────
const typeIcon = { Article: "📄", Video: "▶️", Project: "🔨" };

// ─── Tutorial card — same structure as CourseCard ─────────────────────────────
function TutorialCard({ tutorial, index }) {
  return (
    <div className={`group flex flex-col rounded-2xl overflow-hidden
            bg-white dark:bg-slate-900
            border border-gray-200 dark:border-slate-800
            hover:border-green-400/50 dark:hover:border-[#00FF41]/30
            hover:-translate-y-1.5 hover:shadow-2xl
            transition-all duration-300
            anim-fade-up d${index}`}
    >
      {/* Card header */}
      <div className={`relative h-32 bg-gradient-to-br ${tutorial.grad}
                flex items-center justify-center flex-shrink-0`}>
        <span className="text-5xl select-none">{tutorial.emoji}</span>

        {/* Tag — difficulty */}
        <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full
                    text-[10px] font-black tracking-wide ${tutorial.tagColor}`}>
          {tutorial.difficulty}
        </span>

        {/* Type badge */}
        <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full
                    text-[10px] font-semibold
                    bg-white/70 dark:bg-slate-900/70 text-gray-600 dark:text-gray-400
                    backdrop-blur-sm">
          {typeIcon[tutorial.type]} {tutorial.type}
        </span>

        {/* Category pill */}
        <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md
                    text-[10px] font-bold
                    bg-black/20 dark:bg-black/40 text-white backdrop-blur-sm">
          {tutorial.category}
        </span>

        {/* XP badge */}
        <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md
                    text-[10px] font-black
                    bg-yellow-400/90 text-yellow-900">
          ⚡ +{tutorial.xp}
        </span>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5">

        <h3 className="font-black text-sm mb-1.5 leading-snug
                    group-hover:text-green-600 dark:group-hover:text-[#00FF41]
                    transition-colors duration-200 line-clamp-2">
          {tutorial.title}
        </h3>

        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2 flex-1">
          {tutorial.desc}
        </p>

        {/* Author */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-5 h-5 rounded-full flex-shrink-0
                        bg-green-100 dark:bg-[#00FF41]/10
                        border border-green-400/40 dark:border-[#00FF41]/30
                        flex items-center justify-center
                        text-[9px] font-black text-green-700 dark:text-[#00FF41]">
            {tutorial.author.charAt(0)}
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
            {tutorial.author}
          </span>
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tutorial.tags.slice(0, 3).map((tag) => (
            <span key={tag}
              className="px-2 py-0.5 rounded-md text-[10px] font-semibold
                                bg-gray-100 dark:bg-slate-800
                                text-gray-500 dark:text-gray-400">
              {tag}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-gray-500 mb-4
                    pb-3 border-b border-gray-100 dark:border-slate-800">
          <span>⏱ {tutorial.readTime}</span>
          <span className="w-px h-3 bg-gray-200 dark:bg-slate-700" />
          <span>{tutorial.date}</span>
        </div>

        {/* Bottom row — XP + Read button */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-yellow-600 dark:text-yellow-400">
              ⚡ +{tutorial.xp} XP
            </span>
            <span className="text-gray-300 dark:text-slate-700">|</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              Free
            </span>
          </div>

          <Link
            to={tutorial.path}
            className="px-4 py-1.5 text-[10px] font-black tracking-widest uppercase
                            rounded-lg no-underline transition-all duration-200 flex-shrink-0
                            bg-gray-100 dark:bg-slate-800
                            text-gray-600 dark:text-gray-400
                            group-hover:bg-green-600 dark:group-hover:bg-[#00FF41]
                            group-hover:text-white dark:group-hover:text-gray-900
                            border border-gray-200 dark:border-slate-700
                            group-hover:border-transparent"
          >
            Read →
          </Link>
        </div>

      </div>
    </div>
  );
}

// ─── Pagination — identical to Courses ───────────────────────────────────────
function Pagination({ current, total, onPrev, onNext }) {
  return (
    <div className="flex items-center justify-between mt-12">

      <button
        onClick={onPrev}
        disabled={current === 1}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold
                    border transition-all duration-200
                    ${current === 1
            ? "border-gray-200 dark:border-slate-800 text-gray-300 dark:text-slate-700 cursor-not-allowed"
            : "border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-green-500 dark:hover:border-[#00FF41] hover:text-green-600 dark:hover:text-[#00FF41] hover:-translate-x-0.5"
          }`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Previous
      </button>

      <div className="flex items-center gap-2">
        <span className="text-2xl font-black text-green-600 dark:text-[#00FF41] tabular-nums">
          {current}
        </span>
        <span className="text-gray-300 dark:text-slate-700 font-light text-lg">/</span>
        <span className="text-2xl font-black text-gray-300 dark:text-slate-700 tabular-nums">
          {total}
        </span>
      </div>

      <button
        onClick={onNext}
        disabled={current === total}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold
                    border transition-all duration-200
                    ${current === total
            ? "border-gray-200 dark:border-slate-800 text-gray-300 dark:text-slate-700 cursor-not-allowed"
            : "border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-green-500 dark:hover:border-[#00FF41] hover:text-green-600 dark:hover:text-[#00FF41] hover:translate-x-0.5"
          }`}
      >
        Next
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

    </div>
  );
}

// ─── TUTORIALS PAGE ───────────────────────────────────────────────────────────
function Tutorials() {

  const { page, filters, tutorials } = data;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All Types");
  const [current, setCurrent] = useState(1);

  const topRef = useRef(null);

  // Filter + search
  const filtered = useMemo(() => {
    return tutorials.filter((t) => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.desc.toLowerCase().includes(search.toLowerCase()) ||
        t.author.toLowerCase().includes(search.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      const matchCategory = category === "All" || t.category === category;
      const matchType = type === "All Types" || t.type === type;
      return matchSearch && matchCategory && matchType;
    });
  }, [tutorials, search, category, type]);

  // Reset page on filter change
  useEffect(() => { setCurrent(1); }, [search, category, type]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  useEffect(() => {
    if (current > totalPages) setCurrent(totalPages);
  }, [totalPages, current]);

  const paginated = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const goNext = () => {
    if (current < totalPages) {
      setCurrent(c => c + 1);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const goPrev = () => {
    if (current > 1) {
      setCurrent(c => c - 1);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100">
      <style>{STYLES}</style>

      {/* ── Page header ── */}
      <div className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-14 text-center">

          <span className="inline-block text-[10px] font-black tracking-[0.25em] uppercase
                        text-green-600 dark:text-[#00FF41] mb-4 px-3 py-1 rounded-full
                        border border-green-500/25 dark:border-[#00FF41]/20
                        bg-green-50 dark:bg-[#00FF41]/5 anim-fade-in">
            {page.tag}
          </span>

          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4 anim-fade-in"
            style={{ animationDelay: "0.05s" }}>
            {page.title}{" "}
            <span className="text-green-600 dark:text-[#00FF41]">{page.highlight}</span>
          </h1>

          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-8 anim-fade-in"
            style={{ animationDelay: "0.1s" }}>
            {page.sub}
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto anim-fade-in"
            style={{ animationDelay: "0.15s" }}>
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4
                            text-gray-400 dark:text-gray-500 pointer-events-none"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={page.searchPlaceholder}
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm
                                bg-white dark:bg-slate-950
                                border border-gray-200 dark:border-slate-700
                                focus:outline-none focus:border-green-500 dark:focus:border-[#00FF41]
                                text-gray-700 dark:text-gray-300
                                placeholder-gray-400 dark:placeholder-gray-600
                                transition-colors duration-200"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2
                                    text-gray-400 dark:text-gray-500
                                    hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                ✕
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ── Filters + grid ── */}
      <div ref={topRef} className="max-w-6xl mx-auto px-6 py-10">

        {/* Filter bar — same layout as Courses */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {filters.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-200
                                    ${category === cat
                    ? "bg-green-600 dark:bg-[#00FF41] text-white dark:text-gray-900 border-transparent shadow-[0_0_12px_rgba(0,180,60,0.3)] dark:shadow-[0_0_12px_rgba(0,255,65,0.25)]"
                    : "bg-transparent border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:border-green-400 dark:hover:border-[#00FF41]/50 hover:text-green-600 dark:hover:text-[#00FF41]"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Type dropdown — same as level select in Courses */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-4 py-1.5 rounded-xl text-xs font-bold
                            bg-white dark:bg-slate-900
                            border border-gray-200 dark:border-slate-700
                            text-gray-600 dark:text-gray-400
                            focus:outline-none focus:border-green-500 dark:focus:border-[#00FF41]
                            cursor-pointer transition-colors duration-200"
          >
            {filters.types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

        </div>

        {/* Result count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Showing{" "}
            <span className="font-bold text-gray-700 dark:text-gray-300">
              {Math.min((current - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(current * PER_PAGE, filtered.length)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-green-600 dark:text-[#00FF41]">{filtered.length}</span>{" "}
            tutorials
          </p>

          {(search || category !== "All" || type !== "All Types") && (
            <button
              onClick={() => { setSearch(""); setCategory("All"); setType("All Types"); }}
              className="text-xs text-gray-400 dark:text-gray-500
                                hover:text-green-600 dark:hover:text-[#00FF41]
                                transition-colors underline underline-offset-2"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Tutorial grid */}
        {paginated.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((tutorial, i) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-black text-lg mb-2">No tutorials found</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
              Try a different search term or reset the filters.
            </p>
            <button
              onClick={() => { setSearch(""); setCategory("All"); setType("All Types"); }}
              className="px-6 py-2.5 rounded-xl text-sm font-bold
                                bg-green-600 dark:bg-[#00FF41]
                                text-white dark:text-gray-900
                                hover:bg-green-700 dark:hover:bg-[#1aff55]
                                transition-colors duration-200"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > PER_PAGE && (
          <Pagination
            current={current}
            total={totalPages}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}

      </div>
    </div>
  );
}

export default Tutorials;