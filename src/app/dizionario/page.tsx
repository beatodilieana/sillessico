import Link from "next/link";

export default function Dizionario() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", background: "var(--cream)" }}>
      <nav style={{ position: "fixed", top: "20px", right: "24px", display: "flex", gap: "24px", fontFamily: "Georgia, serif", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", zIndex: 10 }}>
        <Link href="/dizionario" style={{ color: "var(--ink)", textDecoration: "none", borderBottom: "1px solid var(--ink)" }}>Dizionario</Link>
        <Link href="/esplora" style={{ color: "var(--muted)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}>Esplora</Link>
        <Link href="/album" style={{ color: "var(--muted)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}>Album</Link>
      </nav>

      <article style={{ maxWidth: "560px", width: "100%" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(20px, 4vw, 28px)", fontWeight: "normal", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--ink)", marginBottom: "6px" }}>
          Sillessico
        </h1>
        <p style={{ fontFamily: "Georgia, serif", fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "48px" }}>
          Dizionario delle cose non dette
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <p style={bodyStyle}>
            Esiste uno spazio tra le cose e le parole che le nominano. Un territorio senza mappe, popolato di sensazioni precise, momenti esatti, verità sottili che la lingua comune non ha ancora raggiunto.
          </p>

          <p style={{ ...bodyStyle, fontWeight: "bold", color: "var(--ink)" }}>
            Sillessico nasce lì.
          </p>

          <p style={bodyStyle}>
            Perché lo spazio della tua lingua è lo spazio del tuo pensiero. Ogni concetto senza nome è un pensiero che non riesci a finire, un'emozione che non riesci a difendere, un'esperienza che non riesci a condividere.
          </p>

          <p style={{ ...bodyStyle, fontStyle: "italic", fontSize: "17px" }}>
            Nominare è un atto di libertà.
          </p>

          <p style={bodyStyle}>
            Questo dizionario non descrive il mondo come è — lo espande. Una parola alla volta, una lacuna colmata, uno spazio conquistato.
          </p>

          <p style={{ ...bodyStyle, fontWeight: "bold", color: "var(--ink)" }}>
            Entra. Porta qualcosa che non sa ancora come si chiama.
          </p>
        </div>

        <div style={{ marginTop: "56px" }}>
          <Link href="/" style={{ fontFamily: "Georgia, serif", fontSize: "13px", letterSpacing: "0.1em", color: "var(--ink)", textDecoration: "none", borderBottom: "1px solid var(--ink)", paddingBottom: "2px" }}>
            Inventa una parola →
          </Link>
        </div>
      </article>
    </main>
  );
}

const bodyStyle: React.CSSProperties = {
  fontFamily: "Georgia, serif",
  fontSize: "15px",
  lineHeight: 1.85,
  color: "var(--ink)",
};
