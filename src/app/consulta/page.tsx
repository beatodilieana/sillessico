"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Word {
  id?: string;
  word: string;
  pronunciation: string;
  category: string;
  etymology: string;
  definition: string;
  example: string;
}

export default function Consulta() {
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    fetch("/api/consulta")
      .then((res) => res.json())
      .then((data) => setWords(data))
      .catch(() => setWords([]));
  }, []);

  return (
    <main style={{ minHeight: "100vh", padding: "48px 24px 100px", background: "var(--cream)" }}>
      <nav style={{ position: "fixed", top: "20px", right: "24px", display: "flex", gap: "24px", fontFamily: "Georgia, serif", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", zIndex: 10 }}>
        <Link href="/dizionario" style={{ color: "var(--muted)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}>Dizionario</Link>
        <Link href="/consulta" style={{ color: "var(--ink)", textDecoration: "none", borderBottom: "1px solid var(--ink)" }}>Consulta</Link>
        <Link href="/album" style={{ color: "var(--muted)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}>Album</Link>
      </nav>

      <header style={{ textAlign: "center", marginBottom: "64px", paddingTop: "12px" }}>
        <Link href="/" style={{ fontFamily: "Georgia, serif", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none", display: "inline-block", marginBottom: "20px" }}>
          ← Sillessico
        </Link>
        <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: "normal", fontStyle: "italic", color: "var(--ink)", lineHeight: 1.2, margin: 0 }}>
          Consulta il lessico
        </h1>
        <p style={{ marginTop: "10px", fontFamily: "Georgia, serif", fontSize: "14px", color: "var(--muted)", fontStyle: "italic" }}>
          {words.length} parole per altrettanti spazi senza nome
        </p>
      </header>

      <div style={{ columns: "320px 3", columnGap: "24px", maxWidth: "1100px", margin: "0 auto" }}>
        {words.map((w, i) => (
          <WordCard key={w.id ?? `${w.word}-${i}`} word={w} />
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "72px" }}>
        <Link href="/" style={{ fontFamily: "Georgia, serif", fontSize: "13px", letterSpacing: "0.1em", color: "var(--ink)", textDecoration: "none", borderBottom: "1px solid var(--ink)", paddingBottom: "2px" }}>
          Inventa la tua parola →
        </Link>
      </div>
    </main>
  );
}

function WordCard({ word: w }: { word: Word }) {
  return (
    <div style={{
      breakInside: "avoid",
      background: "white",
      border: "1px solid var(--border)",
      borderTop: "3px solid var(--ink)",
      padding: "28px 30px 24px",
      marginBottom: "24px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}>
      <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: "normal", fontStyle: "italic", color: "var(--ink)", lineHeight: 1.1, margin: "0 0 4px" }}>
        {w.word}
      </h2>
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: "13px", color: "var(--muted)" }}>{w.pronunciation}</span>
        <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "12px", color: "var(--accent)" }}>{w.category}</span>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "0 0 16px" }} />

      <p style={{ fontFamily: "Georgia, serif", fontSize: "14px", lineHeight: 1.8, color: "var(--ink)", marginBottom: "14px" }}>
        {w.definition}
      </p>

      <p style={{ fontFamily: "Georgia, serif", fontSize: "12px", lineHeight: 1.6, color: "var(--muted)", marginBottom: "14px" }}>
        <span style={{ letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "9px" }}>etim.</span>{"  "}{w.etymology}
      </p>

      <p style={{ fontFamily: "Georgia, serif", fontSize: "13px", fontStyle: "italic", color: "var(--muted)", lineHeight: 1.65, borderLeft: "2px solid var(--border)", paddingLeft: "12px", margin: 0 }}>
        &ldquo;{w.example}&rdquo;
      </p>
    </div>
  );
}
