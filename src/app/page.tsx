import Image from "next/image";
import { GlyphGrid } from "@/components/GlyphGrid";
import { MobileNav } from "@/components/MobileNav";

/* ─── Symbol strip data (inspired by Obelisk2 glyphs) ─── */
const GLYPHS = ["[◇]", "◎", "⊕", "⟐", "✕", "◉", "⌘", "⊛", "◈", "⟡", "⊞", "⌬"];

const PILLARS = [
  {
    title: "Monument",
    glyph: "⊕",
    tagline: "Architecture that outlives its builders",
    desc: "Every system in Obelisk is designed the way ancient monuments were — to stand without maintenance, without a team propping it up, without a single person who can pull the plug.",
    features: [
      { label: "Immutable Contracts", detail: "Once deployed, the code cannot be changed, paused, or rugged. The monument stands as built." },
      { label: "No Admin Keys", detail: "No multisig, no team wallet with special powers. The protocol runs itself." },
      { label: "On-Chain Forever", detail: "Every transaction, every state change, every proof — permanently recorded on Solana." },
    ],
  },
  {
    title: "Cipher",
    glyph: "◈",
    tagline: "Cryptography that secures value across time",
    desc: "The glyphs are not decoration — they represent real cryptographic functions. Obelisk uses the same math that secures billions in value, applied to a system built for permanence.",
    features: [
      { label: "Trustless Verification", detail: "Every claim is provable on-chain. No trust required — only math." },
      { label: "Zero-Knowledge Foundations", detail: "Built with privacy-first principles. What you reveal is your choice." },
      { label: "Hardened Security", detail: "Battle-tested cryptographic primitives. No shortcuts, no weak links." },
    ],
  },
  {
    title: "Network",
    glyph: "⊛",
    tagline: "Decentralized infrastructure with no center",
    desc: "Obelisk doesn't rely on a single server, a single team, or a single point of failure. The network is the monument — distributed, redundant, and unstoppable.",
    features: [
      { label: "Solana-Native", detail: "Built on Solana for sub-second finality and near-zero fees. Speed without compromise." },
      { label: "Community-Governed", detail: "No boardroom. Decisions are made by those who hold stake in the monument." },
      { label: "Open Protocol", detail: "Anyone can build on top of Obelisk. The monument grows through its builders." },
    ],
  },
];

const df = "font-[family-name:var(--font-display)]";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] relative scanline overflow-hidden">
      {/* ═══════ BACKGROUND ═══════ */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(/images/Obelisk3.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.25,
          zIndex: 0,
        }}
      />

      {/* ═══════ HEADER ═══════ */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <a href="/" className="flex items-center gap-3 transition hover:opacity-80">
          <Image
            src="/images/Obelisk1.png"
            alt="Obelisk"
            width={36}
            height={36}
            className="pulse-glow"
          />
          <span className={`${df} text-sm font-bold tracking-[0.2em] uppercase text-[var(--neon)]`}>
            Obelisk
          </span>
        </a>
        <nav className="hidden sm:flex items-center gap-6 text-xs font-mono uppercase tracking-[0.15em] text-[var(--ink-soft)]">
          <a href="https://dexscreener.com/solana/hfrefa2jczxntgn7negisjz84yqjzs64zsgdezwwynpd" target="_blank" rel="noopener noreferrer" className="text-[var(--neon)] font-bold transition hover:opacity-80">$PRELODE</a>
          <a href="/monument" className="transition hover:text-[var(--neon)]">Monument</a>
          <a href="#pillars" className="transition hover:text-[var(--neon)]">Protocol</a>
          <a href="#vision" className="transition hover:text-[var(--neon)]">Vision</a>
          <a href="#symbols" className="transition hover:text-[var(--neon)]">Symbols</a>
          <a href="https://x.com/monolith774" target="_blank" rel="noopener noreferrer" className="text-[var(--neon)] font-bold transition hover:opacity-80">𝕏</a>
        </nav>
        <MobileNav />
      </header>

      {/* ═══════ SYMBOL STRIP (Obelisk2 inspired) ═══════ */}
      <div className="relative border-y border-[var(--hairline)] bg-[var(--bg-elevated)] overflow-hidden py-3">
        <div className="flex marquee gap-8 whitespace-nowrap">
          {[...GLYPHS, ...GLYPHS, ...GLYPHS].map((g, i) => (
            <span
              key={i}
              className="font-mono text-lg text-[var(--neon)] opacity-40 select-none"
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════ HERO ═══════ */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pt-20 pb-16 sm:px-10 sm:pt-32 sm:pb-24 text-center">
        <h1 className={`fade-up fade-up-1 ${df} text-5xl font-black tracking-[-0.02em] uppercase sm:text-7xl md:text-8xl text-glow`}>
          <span className="text-[var(--neon)]">OBELISK</span>
        </h1>

        <p className={`fade-up fade-up-2 mt-4 ${df} text-xs uppercase tracking-[0.3em] text-[var(--ink-soft)]`}>
          Monument Designs & Crypto
        </p>

        <p className="fade-up fade-up-3 mx-auto mt-8 max-w-2xl text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">
          Ancient structures encoded knowledge in stone that survived millennia.
          Obelisk encodes value in cryptography that will outlast them all.
        </p>

        <div className="fade-up fade-up-4 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/monument" className={`btn-neon ${df}`}>
            Enter the monument
          </a>
          <a href="#vision" className={`btn-outline ${df}`}>
            Read the inscription
          </a>
        </div>
      </section>


      {/* ═══════ PROTOCOL ═══════ */}
      <section id="pillars" className="mx-auto max-w-5xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="text-center mb-16">
          <p className={`${df} text-xs uppercase tracking-[0.3em] text-[var(--neon)] mb-3`}>
            The protocol
          </p>
          <h2 className={`${df} text-3xl font-bold tracking-tight sm:text-5xl mb-4`}>
            Three pillars. Zero weak points.
          </h2>
          <p className="mx-auto max-w-2xl text-base text-[var(--ink-soft)] leading-relaxed sm:text-lg">
            Every monument stands on a foundation. Obelisk is built on three
            principles that make it impossible to take down, impossible to corrupt,
            and impossible to forget.
          </p>
        </div>

        <div className="space-y-6">
          {PILLARS.map((p, idx) => (
            <div
              key={p.title}
              className="rounded-2xl border border-[var(--hairline)] bg-[var(--bg-card)] overflow-hidden transition hover:border-[var(--hairline-strong)]"
            >
              {/* Pillar header */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-6 sm:p-8 border-b border-[var(--hairline)]">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--neon-dim)] font-mono text-2xl text-[var(--neon)]">
                    {p.glyph}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className={`${df} text-xl font-bold text-[var(--ink)]`}>{p.title}</h3>
                      <span className="font-mono text-[10px] text-[var(--ink-faint)] uppercase tracking-wider">
                        Pillar {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className={`${df} text-xs text-[var(--neon-deep)] mt-0.5`}>{p.tagline}</p>
                  </div>
                </div>
              </div>

              {/* Pillar body */}
              <div className="p-6 sm:p-8">
                <p className="text-sm sm:text-base leading-relaxed text-[var(--ink-soft)] mb-6">
                  {p.desc}
                </p>

                {/* Feature grid */}
                <div className="grid gap-4 sm:grid-cols-3">
                  {p.features.map((f) => (
                    <div
                      key={f.label}
                      className="rounded-xl border border-[var(--hairline)] bg-[var(--bg-elevated)] p-4 sm:p-5"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon)]" />
                        <h4 className={`${df} text-xs font-bold uppercase tracking-wide text-[var(--ink)]`}>
                          {f.label}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed text-[var(--ink-soft)]">
                        {f.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Protocol summary bar */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { value: "0", label: "Admin keys" },
            { value: "100%", label: "On-chain" },
            { value: "∞", label: "Uptime target" },
            { value: "<1s", label: "Finality" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-[var(--hairline)] bg-[var(--bg-card)] p-4 text-center">
              <p className={`${df} text-xl sm:text-2xl font-bold text-[var(--neon)]`}>{s.value}</p>
              <p className="text-[10px] sm:text-xs text-[var(--ink-faint)] font-mono uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ SYMBOL STRIP 2 ═══════ */}
      <div className="border-y border-[var(--hairline)] bg-[var(--bg-elevated)]">
        <div className="relative overflow-hidden">
          <Image
            src="/images/Obelisk2.png"
            alt="Obelisk symbols"
            width={1200}
            height={100}
            className="w-full h-auto opacity-60"
          />
        </div>
      </div>

      {/* ═══════ VISION ═══════ */}
      <section id="vision" className="mx-auto max-w-3xl px-6 py-20 sm:px-10 sm:py-28 text-center">
        <p className={`${df} text-xs uppercase tracking-[0.3em] text-[var(--neon)] mb-3`}>
          The inscription
        </p>
        <h2 className={`${df} text-3xl font-bold tracking-tight sm:text-5xl mb-8`}>
          What is Obelisk?
        </h2>
        <div className="space-y-6 text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">
          <p>
            Obelisks were the original monuments — stone pillars carved with
            knowledge, raised to mark power and permanence. They stood for
            thousands of years while empires around them crumbled.
          </p>
          <p>
            <span className="text-[var(--neon)] font-semibold">Obelisk</span> takes
            that principle on-chain. We build at the intersection of monument
            design and cryptographic infrastructure — systems that are meant to
            stand, not to be patched.
          </p>
          <p>
            The symbols you see are not decoration. They are a language. Each
            glyph maps to a function in the protocol — a cipher for those who
            know how to read it.
          </p>
        </div>
      </section>

      {/* ═══════ SYMBOLS ═══════ */}
      <section id="symbols" className="mx-auto max-w-5xl px-6 pb-20 sm:px-10 sm:pb-28">
        <div className="text-center mb-14">
          <p className={`${df} text-xs uppercase tracking-[0.3em] text-[var(--neon)] mb-3`}>
            The glyphs
          </p>
          <h2 className={`${df} text-3xl font-bold tracking-tight sm:text-5xl`}>
            Decode the monument
          </h2>
        </div>

        <GlyphGrid />
      </section>

      {/* ═══════ $PRELODE ═══════ */}
      <section id="prelode" className="border-t border-[var(--hairline)] bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:px-10 sm:py-28 text-center">
          <p className={`${df} text-xs uppercase tracking-[0.3em] text-[var(--neon)] mb-3`}>
            The power source
          </p>
          <h2 className={`${df} text-3xl font-bold tracking-tight sm:text-5xl mb-8`}>
            $PRELODE
          </h2>
          <div className="space-y-6 text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">
            <p>
              Every monument needs energy before the first stone is placed.
              <span className="text-[var(--neon)] font-semibold"> $PRELODE</span> is that energy —
              the token that powers the Obelisk ecosystem.
            </p>
            <p>
              It was loaded before the monument was built, and it will remain
              long after. Early believers prelode the foundation. The monument rewards those who were here first.
            </p>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://dexscreener.com/solana/hfrefa2jczxntgn7negisjz84yqjzs64zsgdezwwynpd"
              target="_blank"
              rel="noopener noreferrer"
              className={`btn-neon ${df}`}
            >
              View on DexScreener
            </a>
            <a href="/monument" className={`btn-outline ${df}`}>
              Enter the monument
            </a>
          </div>
        </div>
      </section>

      {/* ═══════ HACKATHON ═══════ */}
      <section className="border-t border-[var(--hairline)]">
        <div className="mx-auto max-w-3xl px-6 py-16 sm:px-10 sm:py-20 text-center">
          <p className={`${df} text-xs uppercase tracking-[0.3em] text-[var(--neon)] mb-3`}>
            Building in public
          </p>
          <h2 className={`${df} text-2xl font-bold tracking-tight sm:text-4xl mb-4`}>
            Solana Frontier Hackathon
          </h2>
          <p className="mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-[var(--ink-soft)] mb-8">
            Obelisk is an active participant in the{" "}
            <a
              href="https://solana.com/hackathon"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--neon)] font-semibold underline underline-offset-2 transition hover:opacity-80"
            >
              Solana Frontier Hackathon 2026
            </a>
            . We&apos;re building the monument live — watch the stones rise in real time.
          </p>
          <a
            href="https://solana.com/hackathon"
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-outline ${df}`}
          >
            View the Hackathon
          </a>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="border-t border-[var(--hairline)]">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:px-10 sm:py-28 text-center">
          <div className="mx-auto mb-8 w-16 h-16 sm:w-20 sm:h-20 relative">
            <Image
              src="/images/Obelisk4.png"
              alt="Obelisk"
              fill
              className="object-contain pulse-glow"
            />
          </div>
          <h2 className={`${df} text-3xl font-bold tracking-tight sm:text-5xl mb-4 text-glow`}>
            <span className="text-[var(--neon)]">The monument rises.</span>
          </h2>
          <p className="text-sm text-[var(--ink-soft)] mb-8 sm:text-base">
            Follow the construction. Be there when the first stone is laid.
          </p>
          <a href="https://x.com/monolith774" target="_blank" rel="noopener noreferrer" className={`btn-neon ${df}`}>
            Follow on X
          </a>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t border-[var(--hairline)] px-6 py-8 sm:px-10">
        <div className="mx-auto max-w-5xl flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <Image
              src="/images/Obelisk4.png"
              alt="Obelisk"
              width={20}
              height={20}
              className="opacity-60"
            />
            <span className={`${df} text-xs tracking-[0.15em] uppercase text-[var(--ink-faint)]`}>
              obelisk.fund
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs font-mono uppercase tracking-[0.15em]">
            <a href="https://dexscreener.com/solana/hfrefa2jczxntgn7negisjz84yqjzs64zsgdezwwynpd" target="_blank" rel="noopener noreferrer" className="text-[var(--neon)] transition hover:opacity-80">$PRELODE</a>
            <a href="/monument" className="text-[var(--ink-faint)] transition hover:text-[var(--neon)]">Monument</a>
            <a href="https://x.com/monolith774" target="_blank" rel="noopener noreferrer" className="text-[var(--ink-faint)] transition hover:text-[var(--neon)]">𝕏</a>
          </div>
          <p className={`${df} text-[10px] tracking-[0.15em] uppercase text-[var(--ink-faint)]`}>
            Encoded in stone. Secured by math.
          </p>
        </div>
      </footer>
    </div>
  );
}
