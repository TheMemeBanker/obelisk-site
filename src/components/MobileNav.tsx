"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

const df = "font-[family-name:var(--font-display)]";

const LINKS = [
  {
    href: "https://dexscreener.com/solana/hfrefa2jczxntgn7negisjz84yqjzs64zsgdezwwynpd",
    label: "$PRELODE",
    external: true,
    highlight: true,
  },
  { href: "/monument", label: "Monument", external: false, highlight: false },
  { href: "#pillars", label: "Protocol", external: false, highlight: false },
  { href: "#vision", label: "Vision", external: false, highlight: false },
  { href: "#symbols", label: "Symbols", external: false, highlight: false },
  {
    href: "https://x.com/monolith774",
    label: "Follow on 𝕏",
    external: true,
    highlight: true,
  },
];

function MenuOverlay({ onClose }: { onClose: () => void }) {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        background: "#0a0a08",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px",
        }}
      >
        <a
          href="/"
          onClick={onClose}
          style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}
        >
          <Image src="/images/Obelisk1.png" alt="Obelisk" width={36} height={36} />
          <span
            className={df}
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#c8ff00",
            }}
          >
            Obelisk
          </span>
        </a>
        <button
          onClick={onClose}
          aria-label="Close menu"
          style={{
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#c8ff00",
            fontSize: 24,
          }}
        >
          ✕
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(200,255,0,0.08)" }} />

      {/* Links */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          padding: "0 24px",
        }}
      >
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            onClick={onClose}
            className={df}
            style={{
              fontSize: 20,
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              textDecoration: "none",
              fontWeight: link.highlight ? 700 : 400,
              color: link.highlight ? "#c8ff00" : "#e8e8e0",
              transition: "color 0.2s",
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid rgba(200,255,0,0.08)",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <p
          className={df}
          style={{
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#4a4a40",
          }}
        >
          Encoded in stone. Secured by math.
        </p>
      </div>
    </div>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="sm:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col items-center justify-center w-11 h-11 gap-1.5"
        aria-label="Menu"
      >
        <span className="block w-5 h-[2px] bg-[var(--neon)]" />
        <span className="block w-5 h-[2px] bg-[var(--neon)]" />
        <span className="block w-5 h-[2px] bg-[var(--neon)]" />
      </button>

      {/* Portal the overlay to document.body so it escapes all stacking contexts */}
      {mounted && open && createPortal(
        <MenuOverlay onClose={() => setOpen(false)} />,
        document.body,
      )}
    </div>
  );
}
