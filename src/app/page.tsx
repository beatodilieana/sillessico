"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

type Mode = "text" | "image" | "reverse";
type ImageFocus = "object" | "feeling";
type OutputLanguage = "it" | "en";

interface NewWordResult {
  exists: false;
  language: string;
  word: string;
  pronunciation: string;
  grammatical_category: string;
  etymology: string;
  definition: string;
  example: string;
}

interface ExistsResult {
  exists: true;
  language: string;
  known_word: string;
  known_category: string;
  known_definition: string;
}

type Result = NewWordResult | ExistsResult;

export default function WordInventor() {
  const [mode, setMode] = useState<Mode>("text");
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>("it");
  const [textInput, setTextInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFocus, setImageFocus] = useState<ImageFocus>("object");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [reverseInput, setReverseInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const previousResultsMap = useRef<Map<string, { word: string; definition: string; etymology: string }[]>>(new Map());

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError(outputLanguage === "it" ? "Carica un file immagine valido." : "Please upload a valid image file.");
      return;
    }
    setImageFile(file);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res((reader.result as string).split(",")[1]);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

  const handleSubmit = useCallback(async () => {
    if (mode === "text" && !textInput.trim()) return;
    if (mode === "image" && !imageFile) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const inputKey = mode === "text" ? textInput.trim() : (imageFile?.name ?? "image");
      const previousResults = previousResultsMap.current.get(inputKey) ?? [];

      const body: Record<string, unknown> = { outputLanguage, previousResults };
      if (mode === "reverse") body.mode = "reverse";
      if (textInput.trim()) body.text = textInput.trim();
      if (imageFile) {
        body.imageBase64 = await toBase64(imageFile);
        body.mimeType = imageFile.type;
        body.imageFocus = imageFocus;
      }
      const res = await fetch("/api/invent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || (outputLanguage === "it" ? "Errore del server." : "Server error."));
      const typed = data as Result;
      if (!typed.exists) {
        const r = typed as NewWordResult;
        const updated = [...previousResults, { word: r.word, definition: r.definition, etymology: r.etymology }];
        previousResultsMap.current.set(inputKey, updated);
      }
      setResult(typed);

      if (mode === "image" && !typed.exists && imageFile) {
        const imageBase64 = await toBase64(imageFile);
        const word = (typed as NewWordResult).word;
        await fetch("/api/album", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageData: `data:${imageFile.type};base64,${imageBase64}`, word }),
        }).catch(() => {});
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : (outputLanguage === "it" ? "Qualcosa è andato storto." : "Something went wrong."));
    } finally {
      setLoading(false);
    }
  }, [mode, textInput, imageFile, imageFocus, outputLanguage]);

  const handleReverseSubmit = useCallback(async () => {
    if (!reverseInput.trim()) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const res = await fetch("/api/invent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "reverse", text: reverseInput.trim(), outputLanguage, previousWords: [] }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Errore del server.");
      setResult(data as Result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Qualcosa è andato storto.");
    } finally {
      setLoading(false);
    }
  }, [reverseInput, outputLanguage]);

  const canSubmit = mode === "image" ? !!imageFile : (mode === "text" && !!textInput.trim());
  const isIt = outputLanguage === "it";

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 16px 80px" }}>
      <nav style={{ position: "fixed", top: "20px", right: "24px", display: "flex", gap: "24px", fontFamily: "Georgia, serif", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", zIndex: 10 }}>
        <Link href="/dizionario" style={{ color: "var(--muted)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}>Progetto</Link>
        <Link href="/consulta" style={{ color: "var(--muted)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}>Consulta</Link>
        <Link href="/album" style={{ color: "var(--muted)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}>Album</Link>
      </nav>
      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: "normal", fontStyle: "italic", color: "var(--ink)", lineHeight: 1.1 }}>
          Sillessico
        </h1>
        <p style={{ marginTop: "10px", color: "var(--muted)", fontSize: "15px", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          Dizionario delle parole mai dette
        </p>
      </header>

      {/* Input card */}
      <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "4px", padding: "32px", width: "100%", maxWidth: "560px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>

        {/* Top row: mode tabs + language toggle */}
        <div style={{ display: "flex", alignItems: "flex-end", borderBottom: "1px solid var(--border)", marginBottom: "24px" }}>
          {/* Mode tabs */}
          <div style={{ display: "flex", flex: 1 }}>
            {(["text", "image"] as Mode[]).map((m) => (
              <button type="button" key={m} onClick={() => { setMode(m); setError(null); setResult(null); }}
                style={{ flex: 1, padding: "8px 0", border: "none", background: "none", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: "13px", letterSpacing: "0.08em", color: mode === m ? "var(--ink)" : "var(--muted)", borderBottom: mode === m ? "2px solid var(--ink)" : "2px solid transparent", marginBottom: "-1px", transition: "color 0.15s" }}>
                {m === "text" ? (isIt ? "✦ Descrizione" : "✦ Description") : (isIt ? "⊞ Immagine" : "⊞ Image")}
              </button>
            ))}
          </div>

          {/* Language toggle */}
          <div style={{ display: "flex", gap: "2px", paddingBottom: "9px", marginLeft: "12px" }}>
            {(["it", "en"] as OutputLanguage[]).map((lang) => {
              const active = outputLanguage === lang;
              return (
                <button type="button" key={lang} onClick={() => setOutputLanguage(lang)}
                  style={{ padding: "3px 9px", border: `1px solid ${active ? "var(--ink)" : "var(--border)"}`, borderRadius: "2px", background: active ? "var(--ink)" : "white", color: active ? "white" : "var(--muted)", fontFamily: "Georgia, serif", fontSize: "11px", letterSpacing: "0.12em", cursor: "pointer", transition: "all 0.15s", textTransform: "uppercase" }}>
                  {lang}
                </button>
              );
            })}
          </div>
        </div>

        {/* Text input */}
        {mode === "text" && (
          <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
            placeholder={isIt
              ? "Es. «la sensazione di leggere un libro così bello da rallentare apposta per non finirlo»\n\nOppure: «the urge to buy a book you know you won't read»"
              : "E.g. «the feeling of reading a book so good you slow down on purpose to avoid finishing it»\n\nOr in Italian: «la malinconia del sole che tramonta d'estate»"}
            rows={5} autoFocus
            style={{ width: "100%", border: "1px solid var(--border)", borderRadius: "2px", padding: "14px", fontFamily: "Georgia, serif", fontSize: "14px", lineHeight: 1.7, color: "var(--ink)", background: "var(--cream)", resize: "vertical", outline: "none" }} />
        )}

        {/* Image input */}
        {mode === "image" && (
          <>
            <div onClick={() => fileRef.current?.click()}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleImageFile(f); }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              style={{ border: `2px dashed ${isDragging ? "var(--ink)" : "var(--border)"}`, borderRadius: "2px", padding: "32px 16px", textAlign: "center", cursor: "pointer", background: isDragging ? "#f5f3ee" : "var(--cream)", transition: "all 0.15s" }}>
              {imagePreview ? (
                <div>
                  <img src={imagePreview} alt={isIt ? "Anteprima" : "Preview"} style={{ maxHeight: "160px", maxWidth: "100%", borderRadius: "2px", objectFit: "cover" }} />
                  <p style={{ marginTop: "10px", fontSize: "12px", color: "var(--muted)", fontFamily: "Georgia, serif" }}>
                    {isIt ? "Clicca per cambiare immagine" : "Click to change image"}
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>⊞</div>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: "14px", color: "var(--muted)" }}>
                    {isIt ? "Trascina o clicca per caricare" : "Drag or click to upload"}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>PNG, JPG, WEBP, GIF</p>
                </>
              )}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} />
            </div>

            {/* Focus choice */}
            <div style={{ marginTop: "16px" }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "10px" }}>
                {isIt ? "Vuoi nominare…" : "You want to name…"}
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                {(["object", "feeling"] as ImageFocus[]).map((focusOption) => {
                  const active = imageFocus === focusOption;
                  return (
                    <button type="button" key={focusOption} onClick={() => setImageFocus(focusOption)}
                      style={{ flex: 1, padding: "11px 12px", border: `1px solid ${active ? "var(--ink)" : "var(--border)"}`, borderRadius: "2px", background: active ? "var(--ink)" : "white", color: active ? "white" : "var(--muted)", fontFamily: "Georgia, serif", fontSize: "13px", cursor: "pointer", transition: "all 0.15s", textAlign: "left", lineHeight: 1.4 }}>
                      <span style={{ display: "block", fontSize: "16px", marginBottom: "2px" }}>{focusOption === "object" ? "◻" : "◡"}</span>
                      {focusOption === "object"
                        ? (isIt ? "L'oggetto / la scena" : "The object / scene")
                        : (isIt ? "Il sentimento che suscita" : "The feeling it evokes")}
                    </button>
                  );
                })}
              </div>
            </div>

            {imageFile && (
              <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)}
                placeholder={isIt ? "Aggiungi una nota (opzionale)" : "Add a note (optional)"}
                rows={2}
                style={{ marginTop: "12px", width: "100%", border: "1px solid var(--border)", borderRadius: "2px", padding: "10px 14px", fontFamily: "Georgia, serif", fontSize: "13px", color: "var(--ink)", background: "var(--cream)", resize: "none", outline: "none" }} />
            )}
          </>
        )}

        {error && mode !== "reverse" && (
          <p style={{ marginTop: "12px", padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "2px", fontFamily: "Georgia, serif", fontSize: "13px", color: "#b91c1c" }}>
            {error}
          </p>
        )}

        <button type="button" onClick={handleSubmit} disabled={loading || !canSubmit}
          style={{ marginTop: "20px", width: "100%", padding: "13px", background: loading || !canSubmit ? "#d6d3d1" : "var(--ink)", color: "white", border: "none", borderRadius: "2px", fontFamily: "Georgia, serif", fontSize: "14px", letterSpacing: "0.06em", cursor: loading || !canSubmit ? "not-allowed" : "pointer", transition: "background 0.15s" }}>
          {loading ? (isIt ? "Crea…" : "Inventing…") : (isIt ? "Dai un nome" : "Coin a name")}
        </button>
      </div>

      {/* Parola box */}
      <div style={{ padding: "28px 32px", width: "100%", maxWidth: "560px", marginTop: "16px" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: "13px", color: "var(--muted)", fontStyle: "italic", marginBottom: "14px", lineHeight: 1.6 }}>
          {isIt ? "Scrivi un nome" : "Write a name"}
        </p>
        <input
          value={reverseInput}
          onChange={(e) => { setReverseInput(e.target.value); setError(null); setResult(null); }}
          onKeyDown={(e) => { if (e.key === "Enter") handleReverseSubmit(); }}
          placeholder={isIt ? "es. flogastro, tremulice, polvenna…" : "e.g. flombris, quernate, solvane…"}
          style={{ width: "100%", border: "1px solid var(--border)", borderRadius: "2px", padding: "14px", fontFamily: "Georgia, serif", fontSize: "18px", fontStyle: "italic", color: "var(--ink)", background: "var(--cream)", outline: "none", boxSizing: "border-box", letterSpacing: "0.03em" }}
        />
        <button type="button" onClick={handleReverseSubmit}
          disabled={loading || !reverseInput.trim()}
          style={{ marginTop: "16px", width: "100%", padding: "13px", background: loading || !reverseInput.trim() ? "#d6d3d1" : "var(--ink)", color: "white", border: "none", borderRadius: "2px", fontFamily: "Georgia, serif", fontSize: "14px", letterSpacing: "0.06em", cursor: loading || !reverseInput.trim() ? "not-allowed" : "pointer", transition: "background 0.15s" }}>
          {loading && mode === "reverse" ? (isIt ? "Inventando…" : "Inventing…") : (isIt ? "Significato" : "Meaning")}
        </button>
      </div>

      {loading && (
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: "var(--muted)", fontSize: "14px" }}>
            {isIt ? "Consultando il lessico immaginario…" : "Consulting the imaginary lexicon…"}
          </p>
        </div>
      )}

      {!loading && result && (
        <div style={{ marginTop: "40px", width: "100%", maxWidth: "560px", animation: "fadeUp 0.4s ease" }}>
          {result.exists ? <ExistsCard result={result} /> : <NewWordCard result={result} />}
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

function NewWordCard({ result }: { result: NewWordResult }) {
  const isIt = result.language === "it";
  return (
    <div style={{ background: "white", border: "1px solid var(--border)", borderTop: "3px solid var(--ink)", padding: "36px 40px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", flexWrap: "wrap" }}>
          <h2 style={{ fontSize: "clamp(28px, 6vw, 40px)", fontWeight: "normal", fontStyle: "italic", color: "var(--ink)", lineHeight: 1 }}>{result.word}</h2>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "14px", color: "var(--muted)" }}>{result.pronunciation}</span>
        </div>
        <p style={{ marginTop: "6px", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "13px", color: "var(--accent)", letterSpacing: "0.04em" }}>{result.grammatical_category}</p>
      </div>
      <Divider />
      <Section label={isIt ? "Etimologia" : "Etymology"}>
        <p style={textStyle}>{result.etymology}</p>
      </Section>
      <Divider />
      <Section label={isIt ? "Definizione" : "Definition"}>
        <p style={textStyle}>{result.definition}</p>
      </Section>
      <Divider />
      <Section label={isIt ? "Esempio" : "Example"}>
        <p style={{ ...textStyle, fontStyle: "italic", color: "var(--muted)" }}>&ldquo;{result.example}&rdquo;</p>
      </Section>
      <p style={{ marginTop: "28px", fontSize: "10px", color: "#c4bfb8", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Georgia, serif", textAlign: "right" }}>
        Sillessico · Lessico Inventato
      </p>
    </div>
  );
}

function ExistsCard({ result }: { result: ExistsResult }) {
  const isIt = result.language === "it";
  return (
    <div style={{ background: "white", border: "1px solid var(--border)", borderTop: "3px solid #6b7280", padding: "36px 40px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
      <p style={{ fontFamily: "Georgia, serif", fontSize: "13px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}>
        {isIt ? "⚠ Questa cosa ha già un nome" : "⚠ This thing already has a name"}
      </p>
      <div style={{ display: "flex", alignItems: "baseline", gap: "14px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "clamp(26px, 5vw, 36px)", fontStyle: "italic", color: "var(--ink)" }}>{result.known_word}</span>
        <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "13px", color: "var(--accent)" }}>{result.known_category}</span>
      </div>
      <Divider />
      <p style={{ ...textStyle }}>{result.known_definition}</p>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <p style={{ fontFamily: "Georgia, serif", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "6px" }}>{label}</p>
      {children}
    </div>
  );
}

function Divider() {
  return <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "20px 0" }} />;
}

const textStyle: React.CSSProperties = {
  fontFamily: "Georgia, serif",
  fontSize: "15px",
  lineHeight: 1.75,
  color: "var(--ink)",
};
// Vercel test: forcing rebuild
