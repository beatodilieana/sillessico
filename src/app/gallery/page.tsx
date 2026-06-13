import Link from "next/link";
import words, { WordEntry } from "@/data/words";

export default function Gallery() {
  return (
    <main style={{ minHeight: "100vh", padding: "48px 24px 80px", background: "var(--cream)" }}>

      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: "52px" }}>
        <Link href="/" style={{ fontFamily: "Georgia, serif", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none", display: "inline-block", marginBottom: "20px" }}>
          ← Sillessico
        </Link>
        <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: "normal", fontStyle: "italic", color: "var(--ink)", lineHeight: 1.15, margin: 0 }}>
          Lessico Inventato
        </h1>
        <p style={{ marginTop: "10px", fontFamily: "Georgia, serif", fontSize: "14px", color: "var(--muted)", fontStyle: "italic" }}>
          {words.length} {words.length === 1 ? "parola" : "parole"}
        </p>
      </header>

      {/* Masonry grid */}
      {words.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: "40px" }}>
          <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: "var(--muted)", fontSize: "16px" }}>
            Il lessico è ancora vuoto. <Link href="/" style={{ color: "var(--ink)" }}>Inventa la prima parola →</Link>
          </p>
        </div>
      ) : (
        <div style={{
          columnCount: 3,
          columnGap: "20px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}>
          {words.map((entry) => (
            <WordCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .masonry { column-count: 2 !important; }
        }
        @media (max-width: 560px) {
          .masonry { column-count: 1 !important; }
        }
      `}</style>
    </main>
  );
}

function WordCard({ entry }: { entry: WordEntry }) {
  const isIt = entry.language === "it";
  return (
    <div style={{
      breakInside: "avoid",
      background: "white",
      border: "1px solid var(--border)",
      borderTop: "3px solid var(--ink)",
      padding: "28px 30px 24px",
      marginBottom: "20px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}>
      {/* Word + language badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "4px" }}>
        <h2 style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: "normal", fontStyle: "italic", color: "var(--ink)", lineHeight: 1.1, margin: 0 }}>
          {entry.word}
        </h2>
        <span style={{ fontFamily: "Georgia, serif", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", border: "1px solid var(--border)", borderRadius: "2px", padding: "2px 6px", whiteSpace: "nowrap", marginTop: "4px", flexShrink: 0 }}>
          {entry.language}
        </span>
      </div>

      {/* Pronunciation + category */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: "13px", color: "var(--muted)" }}>{entry.pronunciation}</span>
        <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "12px", color: "var(--accent)" }}>{entry.grammatical_category}</span>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "0 0 14px" }} />

      {/* Definition */}
      <p style={{ fontFamily: "Georgia, serif", fontSize: "14px", lineHeight: 1.75, color: "var(--ink)", marginBottom: "14px" }}>
        {entry.definition}
      </p>

      {/* Etymology */}
      <p style={{ fontFamily: "Georgia, serif", fontSize: "12px", lineHeight: 1.6, color: "var(--muted)", marginBottom: "14px" }}>
        <span style={{ letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "9px" }}>{isIt ? "etim." : "etym."}</span>{"  "}{entry.etymology}
      </p>

      {/* Example */}
      <p style={{ fontFamily: "Georgia, serif", fontSize: "13px", fontStyle: "italic", color: "var(--muted)", lineHeight: 1.65, borderLeft: "2px solid var(--border)", paddingLeft: "12px", margin: 0 }}>
        &ldquo;{entry.example}&rdquo;
      </p>

      {/* Date */}
      {entry.date && (
        <p style={{ marginTop: "16px", fontSize: "10px", color: "#c4bfb8", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "Georgia, serif", textAlign: "right" }}>
          {entry.date}
        </p>
      )}
    </div>
  );
}
