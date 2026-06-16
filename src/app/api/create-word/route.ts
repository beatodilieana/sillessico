// Force Vercel rebuild
import { Anthropic } from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

interface SquadGenerateResponse {
  word: string;
  pronunciation: string;
  definition: string;
  etymology: string;
  example: string;
  copy_x: string;
  copy_email: string;
  hashtags: string[];
  language: "it" | "en";
}

const client = new Anthropic();
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(req: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Missing ANTHROPIC_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { language = "it", mode = "new" } = body;

    if (language !== "it" && language !== "en") {
      return NextResponse.json(
        { error: "Language must be 'it' or 'en'" },
        { status: 400 }
      );
    }

    const isIt = language === "it";

    // Step 1: Generate new word using existing invent logic
    const wordSystemPrompt = buildWordSystemPrompt(language);

    const wordResponse = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system: wordSystemPrompt,
      messages: [
        {
          role: "user",
          content: isIt ? "Genera una parola nuova." : "Generate a new word.",
        },
      ],
    });

    const wordRaw = wordResponse.content[0].type === "text" ? wordResponse.content[0].text : "";
    const wordCleaned = wordRaw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();

    let wordData: {
      word: string;
      pronunciation: string;
      reason?: string;
    };
    try {
      wordData = JSON.parse(wordCleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse word generation response" },
        { status: 500 }
      );
    }

    // Step 2: Generate full definition using Claude
    const defSystemPrompt = buildDefinitionSystemPrompt(language);

    const defResponse = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      system: defSystemPrompt,
      messages: [
        {
          role: "user",
          content: isIt
            ? `La parola è: "${wordData.word}". Genera definizione, etimologia ed esempio.`
            : `The word is: "${wordData.word}". Generate definition, etymology and example.`,
        },
      ],
    });

    const defRaw = defResponse.content[0].type === "text" ? defResponse.content[0].text : "";
    const defCleaned = defRaw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();

    let defData: {
      definition: string;
      etymology: string;
      example: string;
    };
    try {
      defData = JSON.parse(defCleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse definition response" },
        { status: 500 }
      );
    }

    // Step 3: Generate X copy (thread format)
    const xCopyPrompt = buildXCopyPrompt(
      wordData.word,
      defData.definition,
      language
    );

    const xResponse = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system: xCopyPrompt.system,
      messages: [
        {
          role: "user",
          content: xCopyPrompt.userMessage,
        },
      ],
    });

    const xCopy = xResponse.content[0].type === "text" ? xResponse.content[0].text : "";

    // Step 4: Generate email copy
    const emailCopyPrompt = buildEmailCopyPrompt(
      wordData.word,
      defData.definition,
      language
    );

    const emailResponse = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system: emailCopyPrompt.system,
      messages: [
        {
          role: "user",
          content: emailCopyPrompt.userMessage,
        },
      ],
    });

    const emailCopy = emailResponse.content[0].type === "text" ? emailResponse.content[0].text : "";

    // Step 5: Extract/generate hashtags
    const hashtags = [
      "#sillessico",
      "#parolesenzanome",
      "#lessicoinventato",
      isIt ? "#italiano" : "#english",
      isIt ? "#parole" : "#words",
    ];

    const result: SquadGenerateResponse = {
      word: wordData.word,
      pronunciation: wordData.pronunciation,
      definition: defData.definition,
      etymology: defData.etymology,
      example: defData.example,
      copy_x: xCopy,
      copy_email: emailCopy,
      hashtags,
      language,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in squad/generate-word:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

function buildWordSystemPrompt(language: "it" | "en"): string {
  const isIt = language === "it";

  return isIt
    ? `Tu sei un esperto di linguistica creativa specializzato in nomi inventati per prodotti digitali.
Genera una singola parola inventata che potrebbe servire come nome per un app che inventa nuove parole.

REQUISITI:
- 1-3 sillabe, facile da pronunciare in italiano
- Memorabile, con un tono leggermente arcano o linguistico
- Nello spirito di Sillessico (il dizionario delle parole mai dette)
- Deve sembrare un vero brand name

ETIMOLOGIA: spiega come la parola è costruita usando radici reali e pattern morfologici reali. 1-2 frasi.

Rispondi SOLO con JSON valido, no markdown:
{"word": "...", "pronunciation": "suddivisione in sillabe", "reason": "una frase sul perché funziona come nome"}`
    : `You are a creative linguistics expert specializing in invented word names for digital products.
Generate a single invented word that could serve as the name for an app that invents new words.

REQUIREMENTS:
- 1-3 syllables, easy to pronounce in English
- Memorable, with a slightly arcane or linguistic feel
- In the spirit of Sillessico (dictionary of unsaid words)
- Must feel like a real brand name

ETYMOLOGY: explain how the word is constructed using real roots and real morphological patterns. 1-2 sentences.

Respond ONLY with valid JSON, no markdown:
{"word": "...", "pronunciation": "syllable breakdown", "reason": "one sentence why this works as a name"}`;
}

function buildDefinitionSystemPrompt(language: "it" | "en"): string {
  const isIt = language === "it";

  return isIt
    ? `Tu sei un lessicografo poetico che crea definizioni per parole inventate.

Data una parola inventata, genera:
1. Una DEFINIZIONE poetica ma chiara (2-4 frasi)
2. Un'ETIMOLOGIA che spiega come è costruita (1-2 frasi)
3. Un ESEMPIO d'uso che mostra il significato in contesto

Rispondi solo con JSON:
{"definition": "...", "etymology": "...", "example": "..."}`
    : `You are a poetic lexicographer who creates definitions for invented words.

Given an invented word, generate:
1. A poetic yet clear DEFINITION (2-4 sentences)
2. An ETYMOLOGY explaining how it's constructed (1-2 sentences)
3. An EXAMPLE showing its meaning in context

Respond only with JSON:
{"definition": "...", "etymology": "...", "example": "..."}`;
}

function buildXCopyPrompt(
  word: string,
  definition: string,
  language: "it" | "en"
): { system: string; userMessage: string } {
  const isIt = language === "it";

  return {
    system: isIt
      ? `Tu sei un copywriter che crea contenuti accattivanti per Twitter/X.

Lo STILE DI SILLESSICO:
- Poetico ma accessibile
- Intimo: tu-e-io, conversazionale
- Colto: usa il linguaggio con rispetto
- Curioso: celebra il dettaglio, la scoperta

Crea un thread di 2-3 tweet che:
1. Presenta la parola in modo affascinante
2. Spiega il significato con una storia/contesto
3. Invita l'audience a scoprire di più

Mantieni il tono poetico e intimo. Massimo 280 caratteri per tweet.`
      : `You are a copywriter who creates engaging content for Twitter/X.

SILLESSICO STYLE:
- Poetic but accessible
- Intimate: you-and-me, conversational
- Cultured: use language with respect
- Curious: celebrates detail, discovery

Create a thread of 2-3 tweets that:
1. Present the word in a fascinating way
2. Explain the meaning with a story/context
3. Invite the audience to discover more

Keep the poetic and intimate tone. Max 280 characters per tweet.`,
    userMessage: isIt
      ? `Crea un thread X per questa parola:

PAROLA: ${word}
DEFINIZIONE: ${definition}

Genera solo il contenuto dei tweet, uno per riga, separati da "---"`
      : `Create an X thread for this word:

WORD: ${word}
DEFINITION: ${definition}

Generate only the tweet content, one per line, separated by "---"`,
  };
}

function buildEmailCopyPrompt(
  word: string,
  definition: string,
  language: "it" | "en"
): { system: string; userMessage: string } {
  const isIt = language === "it";

  return {
    system: isIt
      ? `Tu sei un copywriter specializzato in email di outreach per blog e media.

Lo STILE DI SILLESSICO:
- Professionale ma caldo
- Personalizzato per chi scrive di linguaggio/semantica
- Proposta: "Penso che questa parola interesserebbe i tuoi lettori"

Crea una email di outreach che:
1. Si presenta brevemente
2. Spiega perché la parola è interessante per il loro pubblico
3. Invita a scoprire Sillessico
4. Include un link CTA

Tono: colto, breve, rispettoso.`
      : `You are a copywriter specialized in outreach emails for blogs and media.

SILLESSICO STYLE:
- Professional but warm
- Personalized for those writing about language/semantics
- Pitch: "I think your readers would love this word"

Create an outreach email that:
1. Introduces briefly
2. Explains why the word interests their audience
3. Invites to discover Sillessico
4. Includes a CTA link

Tone: cultured, concise, respectful.`,
    userMessage: isIt
      ? `Crea una email di outreach per questa parola:

PAROLA: ${word}
DEFINIZIONE: ${definition}

Genera solo il contenuto dell'email (oggetto + corpo), senza "Subject:" o "Body:"`
      : `Create an outreach email for this word:

WORD: ${word}
DEFINITION: ${definition}

Generate only the email content (subject + body), without "Subject:" or "Body:"`,
  };
}
