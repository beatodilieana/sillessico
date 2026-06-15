"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface AlbumEntry {
  id: string;
  imageData: string;
  word: string;
}

export default function Album() {
  const [entries, setEntries] = useState<AlbumEntry[]>([]);

  useEffect(() => {
    fetch("/api/album")
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch(() => setEntries([]));
  }, []);
  return (
    <main style={{ minHeight: "100vh", padding: "48px 24px 100px", background: "var(--cream)" }}>
      <nav style={{ position: "fixed", top: "20px", right: "24px", display: "flex", gap: "24px", fontFamily: "Georgia, serif", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", zIndex: 10 }}>
        <Link href="/dizionario" style={{ color: "var(--muted)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}>Dizionario</Link>
        <Link href="/consulta" style={{ color: "var(--muted)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}>Consulta</Link>
        <Link href="/album" style={{ color: "var(--ink)", textDecoration: "none", borderBottom: "1px solid var(--ink)" }}>Album</Link>
      </nav>

      <header style={{ textAlign: "center", marginBottom: "52px", paddingTop: "12px" }}>
        <Link href="/" style={{ fontFamily: "Georgia, serif", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none", display: "inline-block", marginBottom: "20px" }}>
          ← Sillessico
        </Link>
        <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: "normal", fontStyle: "italic", color: "var(--ink)", lineHeight: 1.2, margin: 0 }}>
          Album
        </h1>
        <p style={{ marginTop: "10px", fontFamily: "Georgia, serif", fontSize: "14px", color: "var(--muted)", fontStyle: "italic" }}>
          Immagini che aspettavano un nome
        </p>
      </header>

      <div style={{ columns: "260px 3", columnGap: "20px", maxWidth: "1000px", margin: "0 auto" }}>
        {entries.map((entry) => (
          <div key={entry.id} style={{ breakInside: "avoid", marginBottom: "20px", background: "white", border: "1px solid var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={entry.imageData} alt={entry.word} style={{ width: "100%", display: "block", objectFit: "cover" }} />
            <div style={{ padding: "16px 20px 18px" }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(20px, 3vw, 26px)", fontStyle: "italic", fontWeight: "normal", color: "var(--ink)", margin: 0 }}>
                {entry.word}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
