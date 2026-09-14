# Promozione X — Parola del Giorno (Automazione n8n)

Decisioni prese (2 settembre 2026):

| Parametro | Scelta |
|---|---|
| Piattaforma | X (Twitter), solo |
| Cadenza | 1 post al giorno |
| Fonte parole | Nuova parola inventata ad ogni post (non dalle 11 curate, non dall'Album) |
| Automazione | Completa via n8n |

---

## Prima di attivare: 3 cose trovate nel progetto che vanno sistemate

**1. Il dominio nei template non esiste ancora.**
Tutti i template (`TEMPLATE_SOCIAL_SINGLE_TWEET.md`, `ESEMPIO_POST_SINTEMA.md`, `TEMPLATE_SOCIAL_TEXT.md`) usano come CTA `www.sillessico.com`, ma il sito live oggi è `https://sillessico.vercel.app` (verificato dai comandi curl salvati in `.claude/settings.local.json`). Il workflow qui sotto punta a `sillessico.vercel.app` — quando registrate il dominio, basta cambiare una riga (indicata sotto).

**2. Il piano di posting in `N8N_SETUP.md` non pubblicherebbe davvero.**
Quel documento usa un semplice Bearer Token per chiamare `POST /2/tweets`. Ma quell'endpoint di X richiede autenticazione **a nome utente** (OAuth 1.0a o OAuth2 con scope `tweet.write`), non un token app-only: con un Bearer token semplice la richiesta fallisce con un errore di permessi (403). Sotto uso il nodo nativo "Twitter" di n8n, che gestisce da solo la firma OAuth 1.0a.

**3. La chiamata di test a Claude in `N8N_SETUP.md` manca dell'header `anthropic-version`.**
È obbligatorio: senza, l'API risponde 400. Aggiunto nel nodo HTTP qui sotto.

*(Nota a parte, non legata alla promozione: il file `.git/config` di questo repo contiene un Personal Access Token GitHub in chiaro nell'URL del remote. Se questa cartella viene mai copiata o backuppata da qualche parte, quel token è esposto. Vale la pena rigenerarlo su GitHub e riconfigurare il remote con SSH o un credential helper, quando hai un minuto.)*

---

## Architettura del workflow

```
Schedule Trigger (1x/giorno, 09:00 Europe/Rome)
        ↓
Code — "Build Prompt" (genera parola + anti-ripetizione)
        ↓
HTTP Request → Anthropic API
        ↓
Code — "Parse + Valida" (JSON parse, check 280 caratteri, salva in blacklist)
        ↓
Nodo Twitter/X → Pubblica tweet
```

---

## Nodo 1 — Schedule Trigger

**Cron:** `0 9 * * *`
Imposta il fuso orario del workflow su **Europe/Rome** nelle impostazioni (Settings → Timezone), altrimenti n8n usa UTC di default e il post esce alle 11:00.

---

## Nodo 2 — Code: "Build Prompt"

```javascript
const staticData = $getWorkflowStaticData('global');
if (!staticData.postedWords) staticData.postedWords = [];

const avoidance = staticData.postedWords.length > 0
  ? "\n\nPAROLE GIÀ USATE — non ripeterle, non riusare la stessa logica etimologica:\n" +
    staticData.postedWords.map((w, i) => `[${i + 1}] "${w}"`).join("\n")
  : "";

const system = `Sei un lessicografo creativo per Sillessico, un progetto che inventa nuove parole italiane per sentimenti e concetti che non hanno ancora un nome nella lingua comune.

Genera UNA nuova parola inventata, seguendo questi vincoli:
- 1-3 sillabe, pronunciabile in italiano
- Costruita con radici reali (latine, greche, o altre) e pattern morfologici plausibili
- Tono: poetico, arcano ma leggibile, mai commerciale, mai da app di marketing
- Deve nominare un sentimento, una sensazione o un momento preciso che la lingua comune non cattura
- Nessuna claim storica falsa sull'etimologia
${avoidance}

Rispondi SOLO con JSON valido, senza markdown:
{
  "word": "...",
  "pronunciation": "sillabazione",
  "grammatical_category": "s.f. / s.m. / n.",
  "etymology": "1-2 frasi, radici reali",
  "definition": "2-3 frasi, poetica ma precisa",
  "example": "una frase d'uso naturale ed evocativa",
  "definition_short": "versione compressa della definizione, max 150 caratteri, per il tweet"
}`;

const body = JSON.stringify({
  model: "claude-sonnet-4-6",
  max_tokens: 600,
  system: system,
  messages: [{ role: "user", content: "Genera la parola per il post di oggi." }]
});

return [{ json: { body } }];
```

---

## Nodo 3 — HTTP Request → Anthropic API

| Campo | Valore |
|---|---|
| Metodo | POST |
| URL | `https://api.anthropic.com/v1/messages` |
| Header | `Content-Type: application/json` |
| Header | `x-api-key: {{ $env.ANTHROPIC_API_KEY }}` |
| Header | `anthropic-version: 2023-06-01` ← quello che mancava |
| Body (raw JSON) | `={{ $json.body }}` |

Configura `ANTHROPIC_API_KEY` come variabile d'ambiente in n8n (Settings → Variables), non incollarla nel nodo.

---

## Nodo 4 — Code: "Parse + Valida"

```javascript
const raw = $input.first().json.content[0].text;
const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();

let data;
try {
  data = JSON.parse(cleaned);
} catch (e) {
  throw new Error(`Parsing fallito: ${e.message}\nRisposta grezza: ${raw}`);
}

const required = ['word', 'pronunciation', 'etymology', 'definition', 'example', 'definition_short'];
for (const field of required) {
  if (!data[field]) throw new Error(`Campo mancante: ${field}`);
}

// AGGIORNA QUI quando registri il dominio definitivo
const SITE_URL = "https://sillessico.vercel.app";

function buildTweet(word, defShort) {
  return `🔤 ${word.toUpperCase()}\n\n«${defShort}»\n\nScopri → ${SITE_URL}\n\n#sillessico #parolesenzanome`;
}

let tweet = buildTweet(data.word, data.definition_short);

// Sicurezza sul limite di 280 caratteri: se sfora, accorcia la definizione breve
if (tweet.length > 280) {
  const overflow = tweet.length - 280 + 1;
  data.definition_short = data.definition_short.slice(0, -overflow).trim() + "…";
  tweet = buildTweet(data.word, data.definition_short);
}

// Blacklist persistente per evitare ripetizioni
const staticData = $getWorkflowStaticData('global');
if (!staticData.postedWords) staticData.postedWords = [];
staticData.postedWords.push(data.word);
if (staticData.postedWords.length > 200) {
  staticData.postedWords = staticData.postedWords.slice(-200);
}

return [{ json: { ...data, tweet } }];
```

**Sulla ripetizione delle parole:** il bug che avevate con il workflow "Cerca Nome" (Claude che ripeteva "Glossfire") molto probabilmente veniva dal test manuale ripetuto — in n8n l'esecuzione manuale ("Execute Workflow") non sempre salva i cambi ai dati statici del workflow, solo le esecuzioni automatiche (schedulate) lo fanno in modo affidabile. Quindi: testate la logica leggendo l'output, ma per verificare che la blacklist funzioni davvero, attivate lo Schedule Trigger e controllate dopo 2 esecuzioni automatiche reali che `postedWords` contenga 2 parole diverse — non fidatevi di due click su "Execute".

---

## Nodo 5 — Pubblica su X

Usa il nodo nativo **Twitter** (o **X**) di n8n, non un HTTP Request manuale — gestisce da solo la firma OAuth 1.0a che l'API di X richiede per pubblicare.

**Configurazione:**
- Resource: `Tweet`
- Operation: `Create`
- Text: `={{ $json.tweet }}`

**Setup della credenziale (una tantum):**
1. Vai su [developer.twitter.com/en/portal/dashboard](https://developer.twitter.com/en/portal/dashboard), crea un Project + App (il tier gratuito basta: consente fino a 500 post/mese in scrittura, voi ne fate ~30/mese).
2. Nelle impostazioni dell'App → **User authentication settings**, attiva OAuth 1.0a e imposta i permessi su **Read and Write** (di default è solo lettura).
3. Genera (o rigenera, se i permessi erano già impostati su solo lettura) **Access Token** e **Access Token Secret** — vanno rigenerati DOPO aver cambiato i permessi, altrimenti restano di sola lettura.
4. In n8n, crea una credenziale **Twitter OAuth1 API** con: API Key, API Secret, Access Token, Access Token Secret.
5. Collega questa credenziale al nodo Twitter.

---

## Prima di attivare lo Schedule Trigger

1. Disattiva/elimina lo Schedule Trigger del vecchio workflow "Cerca Nome" (non serve più, il nome è deciso).
2. Esegui questo nuovo workflow manualmente 2-3 volte, **senza** collegare ancora il nodo Twitter (staccalo o mettici uno Stop dopo il nodo Parse), per controllare che parola/tono/lunghezza siano quello che vuoi.
3. Solo dopo, ricollega il nodo Twitter e attiva lo Schedule.

---

## Prossimi passi per potenziare la promozione (non urgenti)

- **Registrare il dominio** sillessico.com/.it e aggiornare `SITE_URL` nel Nodo 4.
- **Archivio pubblico**: ogni parola postata potrebbe essere salvata anche sul sito stesso (una nuova pagina tipo `/archivio`, alimentata da un file JSON simile a `albumEntries.json`) — trasforma ogni tweet in un link che arricchisce il sito invece che portare a una pagina statica sempre uguale.
- **Instagram**: avete già il template (`TEMPLATE_SOCIAL_TEXT.md`), stesso identico Nodo 2/3 con un prompt leggermente più lungo, più un nodo di generazione immagine se volete il lato visivo.
- **Tracciamento engagement**: il nodo Twitter di n8n può leggere le metriche del tweet pubblicato in un secondo workflow, per capire quali angoli creativi funzionano meglio.
