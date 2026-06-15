# Contesto Grafica — Sillessico

## Palette Colori

| Nome CSS | Hex | RGB | Uso | Descrizione |
|----------|-----|-----|-----|-------------|
| `--cream` | `#faf8f3` | rgb(250, 248, 243) | Background main | Bianco sporco, carta invecchiata |
| `--ink` | `#1c1917` | rgb(28, 25, 23) | Testo principale | Nero caldo, inchiostro |
| `--muted` | `#78716c` | rgb(120, 113, 108) | Testo secondario | Grigio taupe, sottotitoli |
| `--border` | `#e7e5e0` | rgb(231, 229, 224) | Bordi, linee | Grigio chiaro, divisori |
| `--accent` | `#c2410c` | rgb(194, 65, 12) | CTA, highlight | Arancio-rosso caldo |

### Referenze Visive
```
CREAM (#faf8f3)      INK (#1c1917)       MUTED (#78716c)     BORDER (#e7e5e0)    ACCENT (#c2410c)
████████████████    ████████████████    ████████████████    ████████████████    ████████████████
```

**Ispirazione:** Tavolozza di una vecchia enciclopedia, documenti cartacei invecchiati, inchiostro su carta.

---

## Typography

### Font Principale
- **Nome:** Georgia
- **Famiglia:** Serif (fallback: Times New Roman)
- **Sorgente:** System font (Georgia è preinstallato su tutti i sistemi)
- **Peso:** 400 (regular), 400 italic (per titoli), small-caps (per label)

### Utilizzo Typography

| Elemento | Size | Style | Uso |
|----------|------|-------|-----|
| H1 (Titoli pagina) | clamp(28px, 5vw, 42px) | italic, normal weight | "Sillessico", titoli sezioni |
| H2 (Sottotitoli) | clamp(22px, 4vw, 32px) | italic, normal weight | "Consulta il lessico", "Album" |
| Corpo (Body text) | 15px | normal | Testo principale, definizioni |
| Label/Nav | 11px | uppercase, small-caps | Navigazione, categorie |
| Piccoli (etichette) | 12-13px | normal/italic | Etimologia, pronuncia |

### Dettagli Tipografici
- **Letter-spacing:** 0.25em per nav, 0.1em per testo normale
- **Line-height:** 1.7 per textarea, 1.75 per body, 1.1-1.2 per titoli
- **Font-smoothing:** -webkit-font-smoothing: antialiased (su body)

---

## Componenti UI

### Card (Parola risultato)
```
┌─────────────────────────┐
│ [PAROLA INVENTATA] /pn/ │  ← Titolo (italic) + pronuncia
│ s.f.                    │  ← Categoria grammaticale
├─────────────────────────┤  ← Divider (border-top: 1px)
│ ETIMOLOGIA              │
│ Spiegazione in 1-2 fr.  │
├─────────────────────────┤
│ DEFINIZIONE             │
│ Definizione della parola│
├─────────────────────────┤
│ ESEMPIO                 │
│ "Quote di esempio..."   │
└─────────────────────────┘
```

**Stile:**
- Bordo: 1px solid var(--border), top-border 3px solid var(--ink)
- Padding: 32-40px interno
- Box-shadow: 0 1px 3px rgba(0,0,0,0.06)
- Border-radius: 4px
- Background: white

### Button (CTA)
- **Stile:** Rettangolare, senza bordo
- **Colore:** Background var(--ink), text white
- **Hover:** opacity change
- **Disabled:** Background #d6d3d1 (grigio chiaro)
- **Padding:** 13px, full width
- **Font:** Georgia, 14px, letter-spacing 0.06em

### Input (Textarea)
- **Bordo:** 1px solid var(--border)
- **Background:** var(--cream)
- **Padding:** 14px
- **Font:** Georgia, 14-18px
- **Placeholder:** muted color
- **Focus:** outline: none, border-color change

### Navigation
- **Posizione:** Fixed, top-right (20px, 24px)
- **Gap:** 24px tra link
- **Font:** Georgia, 11px, uppercase, letter-spacing 0.25em
- **Link attivo:** color var(--ink), border-bottom 1px solid var(--ink)
- **Link inattivo:** color var(--muted), border-bottom 1px solid var(--border)

---

## Layout & Spacing

### Grid System
- **Max-width card:** 560px (contenuti principali)
- **Max-width album:** 1100px (collezione)
- **Padding page:** 48px vertical, 24px horizontal (mobile), 80px bottom
- **Gap colonnes:** 24px (album), 20px (gallery)

### Spacing Scale
- **Header bottom:** 48px (home), 64px (consulta), 52px (album)
- **Card spacing:** 16px between cards
- **Padding interno:** 28-40px
- **Border radius:** 4px (buttons, cards), 2px (inputs)

### Responsive
- **Breakpoint tiles:** clamp() per fluid sizing
- **Colonne album:** columns: "260px 3" (3 colonne su width >= 780px, meno su mobile)

---

## Iconografia & Simboli

### Utilizzo Simboli nel Testo
| Simbolo | Uso |
|---------|-----|
| ✦ | Tab attivo (Descrizione) |
| ⊞ | Tab image |
| ◡ | Feeling icon |
| ← | Back link |
| → | Forward/CTA link |
| … | Loading/pensiero |

---

## Animazioni

### Transizioni
```css
transition: color 0.15s;        /* Color changes */
transition: all 0.15s;          /* Button hover */
transition: background 0.15s;   /* Button state */
```

### Keyframes
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Usato: risultato parola dopo generazione */
```

---

## Pattern & Dettagli

### Divider
- **Stile:** `border: none; border-top: 1px solid var(--border); margin: 20px 0;`
- **Uso:** Separare sezioni dentro card

### Hover States
- **Link:** border-bottom sottolineato, colore ink
- **Button:** background più chiaro, cursor pointer
- **Card:** box-shadow più pronunciata (opzionale)

### Focus States
- **Input:** outline: none, focus-visible con border highlight
- **Button:** focus visible con outline

### Empty State (Album)
- Niente contenuto quando array vuoto
- Potenziale: "Nessuna immagine ancora, inizia da qui →"

---

## Densità Visiva

### Whitespace Strategy
- **Generoso:** Spazi ampi tra elementi (respira)
- **Elegante:** Non crowded, legibile
- **Classico:** Ispirato a libri/documenti

### Contrasto
- **Alto:** Ink su cream (accessibile)
- **Medio:** Muted su cream (secondario)
- **Basso:** Border su cream (minimal)

---

## Utilities CSS (usate nel progetto)

```css
:root {
  --cream:  #faf8f3;    /* BG */
  --ink:    #1c1917;    /* Text primary */
  --muted:  #78716c;    /* Text secondary */
  --border: #e7e5e0;    /* Lines */
  --accent: #c2410c;    /* CTA, highlight */
}
```

Tutte le componenti usano `var(--nome)` per coerenza cromatica.

---

## Mobile vs Desktop

### Mobile (< 768px)
- Padding: 48px 16px
- Max-width: 100% (limitato da max-width specifico per card)
- Font size: clamp() per scaling
- Colonne album: 1 colonna (responsive)

### Desktop (>= 768px)
- Padding: 48px 24px
- Max-width: 560px-1100px (dipende componente)
- Font size: fisso o clamp più large
- Colonne album: 3 colonne

---

## Referenze Stilistiche

**Ispirazioni:**
- Enciclopedie cartacee vintage
- Tipografia classica (Georgia serif)
- Minimalismo caldo (cream + ink)
- Design editoriale (spaziatura generosa)
- Brand: Notion, Medium, Ghost blog

**Mood:**
- Intellettuale ma accessibile
- Poetico ma leggibile
- Nostalgico ma moderno
- Serio senza essere freddo
