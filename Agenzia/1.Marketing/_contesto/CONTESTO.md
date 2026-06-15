# Sillessico — Contesto del Progetto

## Visione

**Sillessico** è un'app che inventa nuove parole italiane per sentimenti, sensazioni e concetti che non hanno ancora un nome nella lingua comune.

L'idea parte da una premessa semplice: **esiste uno spazio tra le cose e le parole che le nominano**. Uno spazio abitato da sentimenti precisi, momenti esatti, verità sottili che la lingua comune non ha ancora raggiunto.

**Nominare è un atto di libertà.** Ogni concetto senza nome è un pensiero che non riesci a finire, un'emozione che non riesci a difendere, un'esperienza che non riesci a condividere.

---

## Come funziona

### Flusso principale

1. **Utente inserisce:**
   - Una descrizione testuale (es. "la malinconia del sole che tramonta d'estate")
   - Oppure un'immagine + un focus (l'oggetto o il sentimento)

2. **API genera una parola nuova** (via Claude):
   - Crea una parola plausibile
   - Spiega l'etimologia (con radici reali)
   - Fornisce definizione + esempio d'uso

3. **Risultato salvato in Album**:
   - Se generato da immagine, viene salvato automaticamente
   - L'utente vede una collezione delle proprie creazioni

### Categorie dell'app

| Categoria | URL | Descrizione |
|-----------|-----|-------------|
| **Progetto** | `/dizionario` | About page — spiega la visione di Sillessico |
| **Consulta** | `/consulta` | Lessico statico — 11 parole d'esempio curate a mano |
| **Album** | `/album` | Collezione personale — parole generate dall'utente |

---

## Stack Tecnologico

| Componente | Tecnologia |
|-----------|-----------|
| Frontend | Next.js 14 (React) + TypeScript |
| Backend | Next.js API Routes |
| AI Model | Claude (Sonnet 4.6) |
| Database | JSON file (`albumEntries.json`) |
| Deployment | Vercel (sillessico.vercel.com) |
| Automazione | n8n (per futura promozione) |

---

## Stato Attuale (Giugno 2026)

### ✅ Completato
- [x] App funzionante con generazione parole
- [x] Supporto input testuale e per immagini
- [x] Salvataggio automatico in Album
- [x] Lessico statico con 11 parole curate
- [x] Deploy su Vercel
- [x] Naming: da "Titivillus" a "Sillessico"
- [x] Rename categoria: "Esplora" → "Consulta"

### 🚀 In Sviluppo
- [ ] Sistema di promozione intelligente (AI Agents + n8n)
- [ ] Bot social che pubblica contenuti generati

### 🎯 Futuri
- [ ] Database reale (non JSON file)
- [ ] Autenticazione utenti
- [ ] Condivisione parole con community
- [ ] Ranking/votazione parole migliori
- [ ] Export/stampa album personale

---

## Architettura Promozione (Pianificata)

```
┌──────────────────┐
│  Sillessico App  │  ← estrae parole nuove
└────────┬─────────┘
         │
    ┌────▼─────────────────────┐
    │   Claude AI Agent        │
    │  (Promotion Intelligence)│
    │  • Analizza parola       │
    │  • Genera storie         │
    │  • Crea copy smart       │
    │  • Produce hashtag       │
    └────┬────────────────────┘
         │
    ┌────▼──────────────────┐
    │   n8n Workflow        │
    │  (Publication Engine) │
    │  • Pubblica X/Twitter │
    │  • Pubblica Instagram │
    │  • Traccia engagement │
    └──────────────────────┘
```

---

## Brand Identity (Minima)

### Logo & Simbolo
- **Simbolo principale:** Una "S" stilizzata con un sottotitolo di tre puntini (·) che evocano parole non ancora dette
- **Variante icona:** Un piccolo punto interrogativo rotato (?) dentro un cerchio — l'ignoto che aspetta un nome
- **Uso:** Minimalista, monocromatico, scalabile da favicon a poster

### Palette Colori
| Nome | Hex | Uso |
|------|-----|-----|
| **Inchiostro** | `#2c2c2c` | Testo principale, UI |
| **Crema** | `#f5f3ee` | Background, spazi bianchi |
| **Acento** | `#a89e8f` | Link, highlight, categoria |
| **Confine** | `#d9d5ce` | Bordi, divisioni |

*Ispirazione:* Colori di una vecchia enciclopedia, penna su carta, arcano ma leggibile.

### Typography
| Elemento | Font | Uso |
|----------|------|-----|
| Titoli | Georgia, serif (italic) | H1, H2, marchio |
| Corpo | Georgia, serif | Testo principale |
| Etichette | Georgia, serif, small caps | Nav, label, metadati |

*Principio:* Eleganza classica con tono narrativo. Le parole inventate meritano una cornice colta.

### Tone of Voice

**Pilastri:**
- 📖 **Poetico**: parla di sentimenti, non di features
- 🗣️ **Intimo**: tu-e-io, conversazionale, non aziendale
- 🎓 **Colto**: usa il linguaggio con rispetto, ma rimane accessibile
- ✨ **Curioso**: celebra il dettaglio, la scoperta, l'inaspettato

**Esempi di messaggi:**
- ❌ "Inventa parole nuove facilmente"
- ✅ "Ogni sentimento senza nome è un pensiero che non finisci"
- ❌ "Salva le tue creazioni"
- ✅ "Custodisci i tuoi spazi innominati"

### Hashtag Fissi
- `#sillessico` — marca principale
- `#parolesenzanome` — identità del progetto
- `#lessicoinventato` — categoria

### Messaging Principale
**Headline:** *"Dizionario delle parole mai dette"*

**Subheader:** *"Ogni concetto senza nome è un pensiero che non riesci a finire. Sillessico espande lo spazio della tua lingua, una parola alla volta."*

**Call-to-action:** *"Dai un nome"* (non "Crea una parola")

---

## Dati Chiave

- **Modello AI:** Claude Sonnet 4.6
- **Lingue supportate:** Italiano, Inglese
- **Sillabe parole:** 1-3 (pronunciabili)
- **Fattore di generazione:** 8 angoli creativi ruotati

---

## File Importanti

| Path | Descrizione |
|------|-------------|
| `src/app/page.tsx` | Home page — inventore di parole |
| `src/app/api/invent/route.ts` | Endpoint generazione parole (Claude API) |
| `src/app/consulta/page.tsx` | Lessico statico curato |
| `src/app/album/page.tsx` | Album personale (dinamico) |
| `src/app/api/album/route.ts` | API salvataggio album |
| `src/data/albumEntries.json` | Storage parole generate |
| `src/data/words.ts` | Lessico statico (11 parole) |

---

## Come Iniziare in Sviluppo

```bash
# Installa dipendenze
npm install

# Avvia server di sviluppo
npm run dev

# Visita
http://localhost:3000
```

---

## Prossimi Step (Dalla Sessione Corrente)

1. ✅ Rinominare "Esplora" → "Consulta"
2. ✅ Creare salvataggio automatico immagini in Album
3. 🚀 Costruire sistema promozione con Claude Agents + n8n
