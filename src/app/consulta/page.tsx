import Link from "next/link";

interface Word {
  word: string;
  pronunciation: string;
  category: string;
  etymology: string;
  definition: string;
  example: string;
}

const words: Word[] = [
  {
    word: "velunche",
    pronunciation: "/ve·ˈluŋ·ke/",
    category: "s.f.",
    etymology: "dal lat. velare, coprire + unche, desinenza inventata di luogo",
    definition: "La malinconia morbida che si prova nell'ultima ora passata in una stanza che si sa di non rivedere più.",
    example: "Rimase seduta sul pavimento vuoto, piena di velunche, a guardare i segni lasciati dai mobili sul parquet.",
  },
  {
    word: "tembrio",
    pronunciation: "/ˈtem·bri·o/",
    category: "s.m.",
    etymology: "dal gr. trepein, girare + brio, vita — l'energia che si volta su se stessa",
    definition: "Il disagio acuto di essere visti felici da qualcuno che non lo è.",
    example: "Abbassò il volume della risata senza capire perché: era solo tembrio.",
  },
  {
    word: "foralba",
    pronunciation: "/fo·ˈral·ba/",
    category: "s.f.",
    etymology: "dal lat. foras, fuori + alba — luce che sembra venire da altrove",
    definition: "La qualità della luce nei pomeriggi invernali quando il giorno sembra già finito anche se sono le tre.",
    example: "Aprì le persiane e trovò foralba: quella luce piatta che non promette niente.",
  },
  {
    word: "glacume",
    pronunciation: "/gla·ˈku·me/",
    category: "s.m.",
    etymology: "dal lat. glacies, ghiaccio — ciò che scivola via mentre lo tocchi",
    definition: "La sensazione fisica di un ricordo che stai quasi afferrando, e che svanisce nel momento esatto in cui ci provi.",
    example: "Ne aveva il nome sulla punta della lingua, poi glacume — e non rimase niente.",
  },
  {
    word: "sorniva",
    pronunciation: "/sor·ˈni·va/",
    category: "s.f.",
    etymology: "dal fr. ant. sornette, piccola cosa + iva, suffisso di passaggio",
    definition: "Il momento preciso e impercettibile in cui una conversazione ordinaria diventa qualcosa di importante.",
    example: "Non si accorsero della sorniva: continuarono a parlare di treni, ma stavano già dicendo altro.",
  },
  {
    word: "palòsco",
    pronunciation: "/pa·ˈlɔs·ko/",
    category: "s.m.",
    etymology: "dal lat. palpare, toccare + oscuro — impulso che non si spiega",
    definition: "L'impulso irrazionale e quasi fisico di toccare qualcosa di fragile o proibito, sapendo che non si dovrebbe.",
    example: "Tenne le mani in tasca per tutto il tempo: il vaso di porcellana gli causava un palòsco insopportabile.",
  },
  {
    word: "ferrugine",
    pronunciation: "/fer·ˈru·dʒi·ne/",
    category: "s.f.",
    etymology: "dal lat. ferrugo, ruggine — nostalgia per ciò che non è mai esistito",
    definition: "La nostalgia per una versione di sé che non si è mai stati: il rimpianto di una vita parallela mai vissuta.",
    example: "Guardava le fotografie di sua madre giovane e sentiva ferrugine per un'adolescenza che non era la sua.",
  },
  {
    word: "colvène",
    pronunciation: "/kol·ˈvɛ·ne/",
    category: "s.m.",
    etymology: "dal lat. colligere, raccogliere + vene — ciò che raccoglie il fiato",
    definition: "Il silenzio particolare che segue una risata collettiva troppo grande: quel secondo sospeso in cui tutti riprendono fiato e nessuno vuole che finisca.",
    example: "Dopo la battuta ci fu colvène, e in quel secondo capì che erano diventati amici.",
  },
  {
    word: "mirsola",
    pronunciation: "/ˈmir·so·la/",
    category: "s.f.",
    etymology: "dal gr. myron, profumo + sola — la dolcezza di ciò che si porta via",
    definition: "La capacità rara di trovare bellezza precisa nelle cose mentre stanno finendo, invece che dopo.",
    example: "Aveva mirsola: riusciva a godere dell'ultima fetta, dell'ultimo giorno, dell'ultima volta — mentre accadeva.",
  },
  {
    word: "oblènto",
    pronunciation: "/o·ˈblɛn·to/",
    category: "s.m.",
    etymology: "dal lat. oblivisci, dimenticare + lento — il peso di ciò che non si decide",
    definition: "Il peso specifico, quasi fisico, di una decisione importante che si rimanda: si accumula nelle spalle, si sente di notte.",
    example: "Non era stanchezza, era oblènto: quella decisione sul tavolo da sei mesi.",
  },
  {
    word: "scaltriva",
    pronunciation: "/skal·ˈtri·va/",
    category: "s.f.",
    etymology: "dall'it. scaltro + deriva — la furbizia che devia lo sguardo",
    definition: "L'arte inconscia di fingere di non accorgersi di qualcosa di bello, per proteggerlo — come se notarlo ad alta voce lo consumasse.",
    example: "Non disse niente del tramonto. Era scaltriva: sapeva che nominarlo lo avrebbe reso più piccolo.",
  },
];

export default function Consulta() {
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
          Undici parole per undici spazi senza nome
        </p>
      </header>

      <div style={{ columns: "320px 3", columnGap: "24px", maxWidth: "1100px", margin: "0 auto" }}>
        {words.map((w) => (
          <WordCard key={w.word} word={w} />
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
