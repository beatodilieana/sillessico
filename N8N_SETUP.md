# n8n Setup — Generazione Parola Direttamente da Claude

## Struttura

**Trigger:** Cron ogni giorno ore 10:00 UTC

**Flow:**
```
Cron Trigger
    ↓
HTTP Request → Anthropic API (genera parola + copy)
    ↓
JavaScript: Parse risposta
    ↓
HTTP Request → X API (pubblica tweet)
    ↓
HTTP Request → Resend API (invia email)
```

---

## Step 1: Nodo Cron

**Type:** Cron
**Expression:** `0 10 * * *` (ore 10:00 UTC daily)
**Output:**
```json
{
  "language": "it"
}
```

---

## Step 2: HTTP Request → Anthropic API

**URL:** `https://api.anthropic.com/v1/messages`

**Method:** POST

**Headers:**
```
Content-Type: application/json
x-api-key: {{ env.ANTHROPIC_API_KEY }}
```

**Body (JSON):**
```json
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 2000,
  "system": "You are a creative lexicographer. Generate a brand new Italian word for a concept without a name.\n\nOutput ONLY valid JSON with no markdown:\n{\n  \"word\": \"(1-3 syllables, easy to pronounce)\",\n  \"pronunciation\": \"(syllable breakdown)\",\n  \"definition\": \"(poetic, 3-5 sentences about the concept)\",\n  \"etymology\": \"(explain construction using real roots, 1-2 sentences)\",\n  \"example\": \"(a vivid usage example)\",\n  \"copy_x\": \"(3-tweet thread in Italian, each tweet ~280 chars, poetic and intriguing, include emojis)\",\n  \"copy_email\": \"(professional but warm outreach email template for bloggers, ~200 words, include [Blog Name] and [Author Name] placeholders)\",\n  \"hashtags\": [\"#sillessico\", \"#parolesenzanome\", \"#lessicoinventato\", \"#italiano\", \"#{{WORD}}\"]\n}",
  "messages": [
    {
      "role": "user",
      "content": "Genera una parola nuova e completa."
    }
  ]
}
```

---

## Step 3: JavaScript Node — Parse Response

**Name:** `Parse Word Response`

**Code:**
```javascript
const response = $input.first().json.content[0].text;

// Clean markdown code blocks if present
const cleaned = response
  .replace(/^```(?:json)?\s*/i, '')
  .replace(/\s*```\s*$/i, '')
  .trim();

let data;
try {
  data = JSON.parse(cleaned);
} catch (e) {
  throw new Error(`Failed to parse Claude response: ${e.message}\nResponse: ${response}`);
}

// Validate required fields
const required = ['word', 'pronunciation', 'definition', 'etymology', 'example', 'copy_x', 'copy_email', 'hashtags'];
for (const field of required) {
  if (!data[field]) {
    throw new Error(`Missing required field: ${field}`);
  }
}

return [{ json: data }];
```

---

## Step 4: HTTP Request → X API (Twitter)

**URL:** `https://api.twitter.com/2/tweets`

**Method:** POST

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{ env.X_BEARER_TOKEN }}
```

**Body (JSON):**
```json
{
  "text": "{{ $node[\"Parse Word Response\"].json.copy_x }}"
}
```

**Output:** Salva `data.data.id` come `xPostId`

---

## Step 5: HTTP Request → Resend API (Email)

**URL:** `https://api.resend.com/emails`

**Method:** POST

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{ env.RESEND_API_KEY }}
```

**Body (JSON):**
```json
{
  "from": "Sillessico <hello@sillessico.com>",
  "to": "{{ env.OUTREACH_EMAIL_LIST }}",
  "subject": "Una parola nuova: {{ $node[\"Parse Word Response\"].json.word }}",
  "html": "<h2>{{ $node[\"Parse Word Response\"].json.word }}</h2><p>{{ $node[\"Parse Word Response\"].json.copy_email }}</p>"
}
```

---

## Credenziali Necessarie (Variabili d'Ambiente in n8n)

```
ANTHROPIC_API_KEY=sk-ant-api03-...
X_BEARER_TOKEN=AAAAAAAAAAAA...
RESEND_API_KEY=re_...
OUTREACH_EMAIL_LIST=email1@example.com,email2@example.com
```

---

## Setup su n8n

1. **Crea credenziali nuove:**
   - `ANTHROPIC_API_KEY` → Prendi da https://console.anthropic.com/keys
   - `X_BEARER_TOKEN` → Prendi da https://developer.twitter.com/en/portal/dashboard
   - `RESEND_API_KEY` → Prendi da https://resend.com/api-keys

2. **Copia il workflow:**
   - Crea 5 nodi come sopra
   - Connetti in sequenza: Cron → HTTP (Claude) → JavaScript → HTTP (X) → HTTP (Resend)
   - Testa con il pulsante Play

3. **Test senza pubblicare:**
   - Aggiungi un nodo `Stop` dopo il JavaScript
   - Verifica che la parola generata abbia tutti i campi
   - Poi attiva i nodi X + Resend

---

## Alternativa: Una Sola Call con Tutto Insieme

Se vuoi consolidare ancora più, puoi fare:

**Step 2 + 3 + 4 unificati:**

Unico nodo HTTP che:
1. Chiama Claude una volta
2. Riceve tutto (word, definition, copy X, copy email, hashtags)
3. Estrae il JSON
4. Passa direttamente a X e Resend

Risparmia 3 API calls, ma il prompt a Claude diventa più denso.

---

## Test Locale (Curl)

```bash
curl -X POST https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -d '{
    "model": "claude-sonnet-4-6",
    "max_tokens": 2000,
    "system": "You are a creative lexicographer. Generate a brand new Italian word for a concept without a name. Output ONLY valid JSON.",
    "messages": [{"role": "user", "content": "Genera una parola nuova."}]
  }' | jq .
```

---

## Prossimi Step

1. Configurare n8n con i 5 nodi
2. Testare con Play (senza pubblicare su X)
3. Una volta verificato, attivare il Cron
4. Monitorare i risultati
5. Aggiustare il prompt se le parole non piacciono
