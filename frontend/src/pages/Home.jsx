import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import data from "../data/Home.json";

// ─── Keyframes ────────────────────────────────────────────────────────────────
const STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  @keyframes grid-move {
    from { transform: translateY(0); }
    to   { transform: translateY(48px); }
  }
  @keyframes float-slow {
    0%, 100% { transform: translateY(0px);  }
    50%       { transform: translateY(-8px); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .anim-fade-up   { animation: fadeUp 0.65s cubic-bezier(.22,.68,0,1.2) forwards; }
  .anim-blink     { animation: blink 1s step-end infinite; }
  .anim-float     { animation: float-slow 4s ease-in-out infinite; }
  .anim-spin-slow { animation: spin-slow 20s linear infinite; }
  .d0 { animation-delay: 0s; }
  .d1 { animation-delay: 0.08s; }
  .d2 { animation-delay: 0.16s; }
  .d3 { animation-delay: 0.24s; }
  .d4 { animation-delay: 0.32s; }
  .d5 { animation-delay: 0.40s; }
  .d6 { animation-delay: 0.52s; }
  .opacity-init { opacity: 0; }
`;

// ─── useInView ────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Typing hook ──────────────────────────────────────────────────────────────
function useTyping(words, speed = 75, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const word = words[wi];
    const t = setTimeout(() => {
      if (!del) {
        setDisplay(word.slice(0, ci + 1));
        if (ci + 1 === word.length) setTimeout(() => setDel(true), pause);
        else setCi(c => c + 1);
      } else {
        setDisplay(word.slice(0, ci - 1));
        if (ci - 1 === 0) { setDel(false); setWi(w => (w + 1) % words.length); setCi(0); }
        else setCi(c => c - 1);
      }
    }, del ? speed / 2 : speed);
    return () => clearTimeout(t);
  }, [ci, del, wi, words, speed, pause]);

  return display;
}

// ─── Counter ──────────────────────────────────────────────────────────────────
function Counter({ target, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    let n = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      n += step;
      if (n >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(n));
    }, 16);
    return () => clearInterval(t);
  }, [inView, target, duration]);
  return <span ref={ref} className="tabular-nums">{count.toLocaleString()}{suffix}</span>;
}

// ─── Section Heading ──────────────────────────────────────────────────────────
function SectionHeading({ tag, title, highlight, sub, inView }) {
  return (
    <div className={`text-center mb-16 opacity-init ${inView ? "anim-fade-up d0" : ""}`}>
      <span className="inline-block text-[10px] font-black tracking-[0.25em] uppercase
                text-green-600 dark:text-[#00FF41] mb-4 px-3 py-1 rounded-full
                border border-green-500/25 dark:border-[#00FF41]/20
                bg-green-50 dark:bg-[#00FF41]/5">
        {tag}
      </span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
        {title}{" "}
        {highlight && <span className="text-green-600 dark:text-[#00FF41]">{highlight}</span>}
      </h2>
      {sub && (
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
          {sub}
        </p>
      )}
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function Home() {

  // ── pull sections from JSON ──
  const { hero, features, howItWorks, courses, gamification, statsBar, testimonials, cta } = data;

  const typed = useTyping(hero.typingWords);

  const [heroRef, heroIn] = useInView(0.05);
  const [statsRef, statsIn] = useInView(0.2);
  const [featRef, featIn] = useInView(0.08);
  const [howRef, howIn] = useInView(0.05);
  const [coursesRef, coursesIn] = useInView(0.08);
  const [xpRef, xpIn] = useInView(0.08);
  const [testiRef, testiIn] = useInView(0.08);
  const [ctaRef, ctaIn] = useInView(0.2);

  return (
    <div className="bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 overflow-x-hidden">
      <style>{STYLES}</style>

      {/* ══════════════════════════════════════════════════
                HERO
            ══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-10"
      >
        {/* Animated grid */}
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(0,200,65,0.6) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,200,65,0.6) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            animation: "grid-move 10s linear infinite",
          }}
        />

        {/* Glow blobs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
                    w-[700px] h-[500px] rounded-full pointer-events-none
                    bg-green-300/8 dark:bg-[#00FF41]/6 blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full pointer-events-none
                    bg-blue-400/5 dark:bg-blue-500/5 blur-[80px]" />

        {/* Spinning rings */}
        <div className="absolute top-24 right-24 w-48 h-48 opacity-10 dark:opacity-[0.06] pointer-events-none hidden lg:block">
          <div className="w-full h-full rounded-full border border-green-500 dark:border-[#00FF41] anim-spin-slow" />
          <div className="absolute inset-4 rounded-full border border-dashed border-green-400 dark:border-[#00FF41]/60" />
        </div>
        <div className="absolute bottom-32 left-16 w-32 h-32 opacity-10 dark:opacity-[0.06] pointer-events-none hidden lg:block">
          <div className="w-full h-full rounded-full border border-green-500 dark:border-[#00FF41]"
            style={{ animation: "spin-slow 15s linear infinite reverse" }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">

          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 mb-8
                        border border-green-500/30 dark:border-[#00FF41]/25
                        bg-green-50 dark:bg-[#00FF41]/5 rounded-full
                        text-[10px] font-black tracking-[0.2em] uppercase
                        text-green-700 dark:text-[#00FF41]
                        opacity-init ${heroIn ? "anim-fade-up d0" : ""}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-[#00FF41] animate-pulse" />
            {hero.badge}
          </div>

          {/* Headline */}
          <h1 className={`font-black leading-[1.08] tracking-tight mb-6
                        text-5xl sm:text-6xl md:text-7xl lg:text-8xl
                        opacity-init ${heroIn ? "anim-fade-up d1" : ""}`}>
            <span className="block text-gray-900 dark:text-white">{hero.headline}</span>
            <span className="block text-green-600 dark:text-[#00FF41] min-h-[1.1em]">
              {typed}<span className="anim-blink">|</span>
            </span>
            <span className="block text-gray-300 dark:text-slate-700 text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-1">
              {hero.subHeadline}
            </span>
          </h1>

          {/* Description */}
          <p className={`text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed
                        opacity-init ${heroIn ? "anim-fade-up d2" : ""}`}>
            {hero.description.split(hero.descriptionHighlight).map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="text-green-600 dark:text-[#00FF41] font-semibold">
                    {hero.descriptionHighlight}
                  </span>
                )}
              </span>
            ))}
          </p>

          {/* CTA buttons */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-20
                        opacity-init ${heroIn ? "anim-fade-up d3" : ""}`}>
            <Link
              to={hero.ctaPrimary.path}
              className="w-full sm:w-auto px-10 py-4
                                bg-green-600 dark:bg-[#00FF41]
                                hover:bg-green-700 dark:hover:bg-[#1aff55]
                                text-white dark:text-gray-900
                                font-black text-sm tracking-[0.15em] uppercase
                                rounded-xl no-underline transition-all duration-200
                                shadow-[0_0_24px_rgba(0,180,60,0.35)] hover:shadow-[0_0_40px_rgba(0,255,65,0.5)]
                                hover:-translate-y-1"
            >
              {hero.ctaPrimary.label}
            </Link>
            <Link
              to={hero.ctaSecondary.path}
              className="w-full sm:w-auto px-10 py-4
                                border-2 border-gray-200 dark:border-slate-700
                                hover:border-green-500 dark:hover:border-[#00FF41]
                                text-gray-600 dark:text-gray-400
                                hover:text-green-600 dark:hover:text-[#00FF41]
                                font-bold text-sm rounded-xl no-underline
                                transition-all duration-200 hover:-translate-y-1"
            >
              {hero.ctaSecondary.label}
            </Link>
          </div>

          {/* Stat cards */}
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto
                        opacity-init ${heroIn ? "anim-fade-up d4" : ""}`}>
            {hero.stats.map((s, i) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-1 px-6 py-5
                                    bg-gray-50 dark:bg-slate-900/80
                                    border border-gray-200 dark:border-slate-800
                                    rounded-2xl anim-float"
                style={{ animationDelay: `${i * 0.4}s` }}
              >
                <span className="text-2xl mb-1">{s.icon}</span>
                <span className="text-2xl font-black text-green-600 dark:text-[#00FF41]">
                  {heroIn ? <Counter target={s.value} suffix={s.suffix} duration={1600} /> : "0"}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium text-center">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.2em] uppercase text-gray-300 dark:text-slate-700">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-green-400/40 dark:from-[#00FF41]/30 to-transparent" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
                FEATURES
            ══════════════════════════════════════════════════ */}
      <section ref={featRef} className="py-28 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading
            tag={features.tag}
            title={features.title}
            highlight={features.highlight}
            sub={features.sub}
            inView={featIn}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.items.map((f, i) => (
              <div
                key={f.title}
                className={`group relative p-7 rounded-2xl cursor-default
                                    bg-white dark:bg-slate-950
                                    border border-gray-200 dark:border-slate-800
                                    hover:border-green-400/60 dark:hover:border-[#00FF41]/40
                                    hover:shadow-[0_8px_40px_rgba(0,180,60,0.08)] dark:hover:shadow-[0_8px_40px_rgba(0,255,65,0.05)]
                                    hover:-translate-y-1 transition-all duration-300
                                    opacity-init ${featIn ? `anim-fade-up d${i}` : ""}`}
              >
                <div className="w-12 h-12 rounded-xl mb-5 flex items-center justify-center text-2xl
                                    bg-gray-50 dark:bg-slate-900
                                    border border-gray-200 dark:border-slate-800
                                    group-hover:border-green-400/40 dark:group-hover:border-[#00FF41]/30
                                    transition-colors duration-300">
                  {f.icon}
                </div>
                <h3 className="font-bold text-base mb-2
                                    group-hover:text-green-600 dark:group-hover:text-[#00FF41]
                                    transition-colors duration-200">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden rounded-b-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400 dark:via-[#00FF41] to-transparent
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
                HOW IT WORKS
            ══════════════════════════════════════════════════ */}
      <section ref={howRef} className="py-28 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading
            tag={howItWorks.tag}
            title={howItWorks.title}
            highlight={howItWorks.highlight}
            sub={howItWorks.sub}
            inView={howIn}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {howItWorks.steps.map((s, i) => (
              <div
                key={s.step}
                className={`relative flex flex-col p-7 rounded-2xl
                                    bg-gradient-to-br ${s.color}
                                    border ${s.border}
                                    hover:-translate-y-2 hover:shadow-xl transition-all duration-300
                                    opacity-init ${howIn ? `anim-fade-up d${i}` : ""}`}
              >
                <div className={`text-6xl font-black leading-none mb-3 ${s.accent} opacity-20 select-none`}>
                  {s.step}
                </div>
                <div className={`text-3xl mb-4 ${s.accent}`}>{s.icon}</div>
                <h3 className="font-black text-base mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5">{s.desc}</p>
                <ul className="mt-auto space-y-1.5">
                  {s.detail.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
                      {d}
                    </li>
                  ))}
                </ul>
                {i < howItWorks.steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10
                                        w-8 h-8 items-center justify-center
                                        bg-white dark:bg-slate-950
                                        border border-gray-200 dark:border-slate-800
                                        rounded-full text-gray-400 dark:text-gray-600 text-sm font-bold shadow-sm">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA strip */}
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-4
                        px-8 py-5 rounded-2xl
                        bg-gray-50 dark:bg-slate-900
                        border border-gray-200 dark:border-slate-800
                        opacity-init ${howIn ? "anim-fade-up d4" : ""}`}>
            <div>
              <p className="font-bold text-sm mb-0.5">{howItWorks.ctaStrip.heading}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{howItWorks.ctaStrip.sub}</p>
            </div>
            <Link
              to={howItWorks.ctaStrip.path}
              className="flex-shrink-0 px-7 py-3
                                bg-green-600 dark:bg-[#00FF41]
                                hover:bg-green-700 dark:hover:bg-[#1aff55]
                                text-white dark:text-gray-900
                                font-black text-xs tracking-widest uppercase
                                rounded-xl no-underline transition-all duration-200
                                shadow-[0_0_16px_rgba(0,180,60,0.3)] hover:shadow-[0_0_28px_rgba(0,255,65,0.4)]
                                hover:-translate-y-0.5"
            >
              {howItWorks.ctaStrip.label}
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
                COURSES PREVIEW
            ══════════════════════════════════════════════════ */}
      <section ref={coursesRef} className="py-28 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`flex items-end justify-between mb-14 opacity-init ${coursesIn ? "anim-fade-up d0" : ""}`}>
            <div>
              <span className="text-[10px] font-black tracking-[0.25em] uppercase
                                text-green-600 dark:text-[#00FF41] mb-3 block">
                {courses.tag}
              </span>
              <h2 className="text-3xl md:text-4xl font-black">{courses.title}</h2>
            </div>
            <Link
              to={courses.viewAllPath}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-bold
                                text-green-600 dark:text-[#00FF41] no-underline
                                hover:gap-2 transition-all duration-200">
              {courses.viewAllLabel}
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.items.map((c, i) => (
              <div
                key={c.title}
                className={`group rounded-2xl overflow-hidden
                                    bg-white dark:bg-slate-950
                                    border border-gray-200 dark:border-slate-800
                                    hover:border-green-400/50 dark:hover:border-[#00FF41]/30
                                    hover:-translate-y-2 hover:shadow-2xl transition-all duration-300
                                    opacity-init ${coursesIn ? `anim-fade-up d${i}` : ""}`}
              >
                <div className={`relative h-36 bg-gradient-to-br ${c.grad} flex items-center justify-center`}>
                  <span className="text-5xl anim-float" style={{ animationDelay: `${i * 0.5}s` }}>
                    {c.emoji}
                  </span>
                  <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-bold
                                        bg-white/80 dark:bg-slate-900/80
                                        text-gray-700 dark:text-gray-300 border border-white/60 dark:border-slate-700/60">
                    {c.tag}
                  </span>
                  <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-medium
                                        bg-white/60 dark:bg-slate-900/60 text-gray-500 dark:text-gray-400">
                    {c.level}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-black text-sm mb-4
                                        group-hover:text-green-600 dark:group-hover:text-[#00FF41]
                                        transition-colors duration-200 leading-snug">
                    {c.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 mb-5">
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-500">⚡</span> +{c.xp.toLocaleString()} XP
                    </span>
                    <span className="w-px h-3 bg-gray-200 dark:bg-slate-700" />
                    <span className="flex items-center gap-1">
                      <span>🪙</span> {c.coins} coins
                    </span>
                  </div>
                  <Link
                    to={c.path}
                    className="block w-full py-2.5 text-center text-xs font-black tracking-widest uppercase
                                            rounded-xl no-underline transition-all duration-200
                                            bg-gray-100 dark:bg-slate-800
                                            text-gray-600 dark:text-gray-400
                                            group-hover:bg-green-600 dark:group-hover:bg-[#00FF41]
                                            group-hover:text-white dark:group-hover:text-gray-900
                                            border border-gray-200 dark:border-slate-700
                                            group-hover:border-transparent"
                  >
                    Enroll Now →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
                XP / GAMIFICATION BANNER
            ══════════════════════════════════════════════════ */}
      <section ref={xpRef} className="py-28 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left */}
            <div className={`flex-1 opacity-init ${xpIn ? "anim-fade-up d0" : ""}`}>
              <span className="text-[10px] font-black tracking-[0.25em] uppercase
                                text-green-600 dark:text-[#00FF41] mb-4 block">
                {gamification.tag}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-5 leading-tight">
                {gamification.title}{" "}
                <span className="text-green-600 dark:text-[#00FF41]">{gamification.highlight}</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed text-lg">
                {gamification.desc}
              </p>
              <div className="flex flex-wrap gap-3">
                {gamification.tags.map((tag) => (
                  <span key={tag}
                    className="px-4 py-2 text-xs font-bold rounded-full
                                            border border-green-500/25 dark:border-[#00FF41]/20
                                            bg-green-50 dark:bg-[#00FF41]/5
                                            text-green-700 dark:text-[#00FF41]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — XP widget */}
            <div className={`flex-1 w-full max-w-sm mx-auto opacity-init ${xpIn ? "anim-fade-up d2" : ""}`}>
              <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5">

                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black tracking-widest uppercase text-gray-400 dark:text-gray-500">
                    {gamification.widget.progressLabel}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full
                                        bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400
                                        border border-purple-200 dark:border-purple-500/20">
                    {gamification.widget.rank}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full flex-shrink-0
                                        bg-green-100 dark:bg-[#00FF41]/10
                                        border-2 border-green-500 dark:border-[#00FF41]
                                        flex items-center justify-center
                                        text-sm font-black text-green-700 dark:text-[#00FF41]">
                    {gamification.widget.playerInitial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm">{gamification.widget.playerName}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {gamification.widget.xpCurrent.toLocaleString()} / {gamification.widget.xpTotal.toLocaleString()} XP
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-gray-400 dark:text-gray-500">Next rank</div>
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {gamification.widget.nextRank}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="h-3 w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full
                                                bg-gradient-to-r from-green-500 to-emerald-400
                                                dark:from-[#00FF41] dark:to-[#00cc33]
                                                shadow-[0_0_10px_rgba(0,200,60,0.4)] dark:shadow-[0_0_10px_rgba(0,255,65,0.4)]
                                                transition-all duration-1000"
                      style={{ width: `${gamification.widget.xpPercent}%` }}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-slate-800" />

                <div className="space-y-3">
                  <div className="text-[10px] font-black tracking-widest uppercase text-gray-400 dark:text-gray-500">
                    {gamification.widget.missionsLabel}
                  </div>
                  {gamification.widget.missions.map((m) => (
                    <div key={m.label} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0
                                                flex items-center justify-center text-[10px]
                                                ${m.done
                          ? "border-green-500 dark:border-[#00FF41] bg-green-500 dark:bg-[#00FF41] text-white dark:text-gray-900"
                          : "border-gray-300 dark:border-slate-600"
                        }`}>
                        {m.done ? "✓" : ""}
                      </div>
                      <span className={`text-xs flex-1 ${m.done ? "line-through text-gray-400 dark:text-gray-600" : "font-medium"}`}>
                        {m.label}
                      </span>
                      <span className={`text-xs font-bold ${m.done ? "text-gray-400 dark:text-gray-500" : "text-green-600 dark:text-[#00FF41]"}`}>
                        {m.xp}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
                STATS BAR
            ══════════════════════════════════════════════════ */}
      <section ref={statsRef} className="py-16 bg-gray-50 dark:bg-slate-900 border-y border-gray-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {statsBar.items.map((s, i) => (
              <div key={s.label} className={`opacity-init ${statsIn ? `anim-fade-up d${i}` : ""}`}>
                <div className="text-3xl md:text-4xl font-black text-green-600 dark:text-[#00FF41] mb-1">
                  {statsIn ? <Counter target={s.value} suffix={s.suffix} /> : "0"}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 font-semibold tracking-wide uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
                TESTIMONIALS
            ══════════════════════════════════════════════════ */}
      <section ref={testiRef} className="py-28 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading
            tag={testimonials.tag}
            title={testimonials.title}
            highlight={testimonials.highlight}
            sub={testimonials.sub}
            inView={testiIn}
          />
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.items.map((t, i) => (
              <div
                key={t.name}
                className={`relative p-7 rounded-2xl
                                    bg-gray-50 dark:bg-slate-900
                                    border border-gray-200 dark:border-slate-800
                                    hover:border-green-400/40 dark:hover:border-[#00FF41]/30
                                    hover:-translate-y-1 hover:shadow-lg transition-all duration-300
                                    opacity-init ${testiIn ? `anim-fade-up d${i}` : ""}`}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array(t.stars).fill(0).map((_, j) => (
                    <span key={j} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex-shrink-0
                                        bg-green-100 dark:bg-[#00FF41]/10
                                        border-2 border-green-400 dark:border-[#00FF41]/40
                                        flex items-center justify-center
                                        text-xs font-black text-green-700 dark:text-[#00FF41]">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-black">{t.name}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{t.role}</div>
                  </div>
                </div>
                <div className="absolute top-5 right-6 text-5xl font-black leading-none
                                    text-green-500/10 dark:text-[#00FF41]/8 select-none pointer-events-none">
                  "
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
                CTA
            ══════════════════════════════════════════════════ */}
      <section ref={ctaRef} className="py-28 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
        <div className={`max-w-3xl mx-auto px-6 text-center opacity-init ${ctaIn ? "anim-fade-up d0" : ""}`}>
          <div className="absolute left-1/2 -translate-x-1/2 w-96 h-40 -translate-y-8
                        bg-green-400/10 dark:bg-[#00FF41]/6 blur-3xl pointer-events-none rounded-full" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8
                            border border-green-500/30 dark:border-[#00FF41]/25
                            bg-green-50 dark:bg-[#00FF41]/5
                            rounded-full text-[10px] font-black tracking-[0.2em] uppercase
                            text-green-700 dark:text-[#00FF41]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-[#00FF41] animate-pulse" />
              {cta.badge}
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-5">
              {cta.title}{" "}
              <span className="text-green-600 dark:text-[#00FF41]">{cta.highlight}</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-10 text-lg leading-relaxed">
              {cta.sub}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={cta.primary.path}
                className="w-full sm:w-auto px-12 py-4
                                    bg-green-600 dark:bg-[#00FF41]
                                    hover:bg-green-700 dark:hover:bg-[#1aff55]
                                    text-white dark:text-gray-900
                                    font-black text-sm tracking-[0.15em] uppercase
                                    rounded-xl no-underline transition-all duration-200
                                    shadow-[0_0_24px_rgba(0,180,60,0.35)] hover:shadow-[0_0_40px_rgba(0,255,65,0.5)]
                                    hover:-translate-y-1"
              >
                {cta.primary.label}
              </Link>
              <Link
                to={cta.secondary.path}
                className="w-full sm:w-auto px-12 py-4
                                    border-2 border-gray-200 dark:border-slate-700
                                    hover:border-green-500 dark:hover:border-[#00FF41]
                                    text-gray-600 dark:text-gray-400
                                    hover:text-green-600 dark:hover:text-[#00FF41]
                                    font-bold text-sm rounded-xl no-underline
                                    transition-all duration-200 hover:-translate-y-1"
              >
                {cta.secondary.label}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;