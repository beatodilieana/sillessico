import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const CREATIVE_ANGLES = [
  "Semantic calque from Japanese or Chinese: identify a compound concept in that language (e.g. a kanji pairing), translate its components literally into Latin or Greek roots, then fuse them into a single phonologically natural word. The etymology explains the calque logic, not a fictional history.",
  "Semantic calque from Arabic or Persian: find a root that captures the concept through its consonantal skeleton, then adapt its phonology to the target language's sound patterns. Explain which semantic field the root belongs to and how the form was adapted.",
  "Semantic calque from German: German often compounds two nouns into a single precise concept. Translate those components into Latin or Romance roots and fuse them with natural morphology. The etymology names the two source meanings and shows how they combine.",
  "Portmanteau of two existing words in the target language — but the seam must be invisible. The two words should be semantically unexpected together. The etymology reveals the hidden structure only after the word already feels whole.",
  "Pure phonaesthesia: choose the sounds first — the phonemes that feel viscerally right for this sensation — then reverse-engineer a plausible root structure that justifies them. The etymology is honest about this: it names the phonetic logic and links it to a real root cluster that shares that sound-feel.",
  "Build on a Latin or Greek root, but through an unexpected semantic extension — not the obvious meaning of the root, but a lateral, metaphorical branch. The etymology explains the extension as a reasoning process: 'because X implies Y, which in turn implies Z'.",
  "Derive from a real but obscure root (technical, botanical, nautical, alchemical) that happens to carry the right weight. The etymology traces the root's original domain and explains why this concept belongs in the same semantic family.",
  "Construct a suffix or prefix combination that doesn't exist yet but follows real morphological rules. The etymology names the productive patterns it borrows from (e.g. '-ura' for result-of-action, '-mente' for adverbial quality) and explains why this combination is internally consistent.",
  "Onomatopoeic core with morphological framing: the root imitates a sound or rhythm associated with the concept, then standard grammatical endings anchor it as a real word class. The etymology names the phonetic gesture and the morphological frame separately.",
  "False cognate logic: the word is built so it sounds like it comes from one root but actually combines two different ones. The etymology names both, explains the acoustic overlap, and shows how the ambiguity is the point.",
];

function pickAngle(): string {
  return CREATIVE_ANGLES[Math.floor(Math.random() * CREATIVE_ANGLES.length)];
}

type PreviousResult = { word: string; definition: string; etymology: string };

function buildSystemPrompt(language: "it" | "en", previousResults: PreviousResult[]): string {
  const isIt = language === "it";

  const avoidance = previousResults.length > 0
    ? `\nPREVIOUS RESULTS FOR THIS SAME INPUT — every dimension must differ from all of these:\n${previousResults.map((r, i) => `[${i + 1}] word: "${r.word}" | etymology approach: "${r.etymology}" | definition angle: "${r.definition.slice(0, 80)}…"`).join("\n")}\nDo not reuse the word, do not echo the etymology logic, do not repeat the same definition angle. Take a completely different creative path.\nSUFFIX / ENDING CONSTRAINT: the previous words ended in: ${previousResults.map(r => `"…${r.word.slice(-3)}"`).join(", ")}. The new word must end differently — different final syllable, different suffix, different grammatical ending.\n`
    : "";

  return `You are a creative lexicographer inventing new words. Given a description or image, you must either coin a new word OR recognize that the concept already has a common name.

OUTPUT LANGUAGE: Always respond in ${isIt ? "Italian" : "English"}, regardless of the input language. The "language" field in the JSON must always be "${language}".

CREATIVE ANGLE FOR THIS INVENTION: ${pickAngle()}
${avoidance}
WORD FORMATION RULES:
- The grammatical category MUST match the concept (noun for objects/concepts/states, verb for actions/processes, adjective for qualities/attributes, adverb for manners)
- The word must sound natural and pronounceable in ${isIt ? "Italian" : "English"}
- The definition must be precise — name the thing exactly, not approximately
- The example must use the word as if it had always existed

ETYMOLOGY RULES — this is critical:
- The etymology explains HOW the word is constructed NOW, following real linguistic mechanisms. It is generative, not archaeological.
- Never imply the word existed before, was found, survived, or was attested anywhere.
- Instead: name the roots or components used, explain why they fit this concept, show the internal logic of the construction.
- The tone should be that of a linguist explaining their reasoning, not a historian citing sources.
- It must be credible: use real roots, real morphological patterns, real productive suffixes — just applied to a new combination.
- 1-2 sentences maximum. No Latin citations, no "attested in", no "from the manuscript of".

WHEN THE CONCEPT ALREADY HAS A WORD:
If the concept is something that already has a common, well-known word in ${isIt ? "Italian" : "English"} (e.g., "${isIt ? "felicità, sedia, correre" : "happiness, chair, to run"}"), respond with the "exists" format. Only flag very obvious, well-known concepts — not niche or poetic ones.

RESPONSE: Return ONLY valid JSON, no markdown, no explanation outside the JSON.

FORMAT for new word:
{
  "exists": false,
  "language": "${language}",
  "word": "invented word (lowercase)",
  "pronunciation": "IPA or syllable breakdown",
  "grammatical_category": ${isIt ? '"s.m." / "s.f." / "v. tr." / "v. intr." / "agg." / "avv."' : '"n." / "v." / "adj." / "adv."'},
  "etymology": "1-2 sentences: name the roots/components, explain the construction logic, no historical claims",
  "definition": "precise definition, 2-4 sentences",
  "example": "one natural example sentence using the word"
}

FORMAT when word already exists:
{
  "exists": true,
  "language": "${language}",
  "known_word": "the existing word",
  "known_category": "grammatical category",
  "known_definition": "brief real definition"
}`;
}

function buildReverseSystemPrompt(language: "it" | "en"): string {
  const isIt = language === "it";
  return `You are a creative lexicographer. You receive a made-up word and your job is to give it a meaning by reading its form.

OUTPUT LANGUAGE: Always respond in ${isIt ? "Italian" : "English"}. The "language" field must always be "${language}".

RULES:
- Accept the given word exactly as written. Never change it.
- Read the word's phonetics and morphology as clues: its sounds, its endings, its internal structure suggest a meaning and a grammatical role. Follow those clues.
- The etymology explains the construction logic of the word as you read it — which roots or sound patterns are present, what semantic field they point to, how the form implies the meaning. It is a reading, not a history.
- Never imply the word existed before, was found, or was attested anywhere. The etymology is generative: it shows why this form could only mean this thing.
- The meaning should be precise and emotionally specific — name something subtle that language has overlooked.
- The grammatical category must feel natural given the word's form.
- Example sentence must use the word naturally.

RESPONSE: Return ONLY valid JSON, no markdown.

FORMAT:
{
  "exists": false,
  "language": "${language}",
  "word": "the word exactly as received",
  "pronunciation": "IPA or syllable breakdown",
  "grammatical_category": ${isIt ? '"s.m." / "s.f." / "v. tr." / "v. intr." / "agg." / "avv."' : '"n." / "v." / "adj." / "adv."'},
  "etymology": "1-2 sentences: read the word's roots and sound structure, explain what form implies meaning, no historical claims",
  "definition": "precise definition, 2-4 sentences",
  "example": "one natural example sentence using the word"
}`;
}

type ImageMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    return NextResponse.json(
      { error: "API key Anthropic non configurata. Inserisci ANTHROPIC_API_KEY nel file .env.local" },
      { status: 500 }
    );
  }

  const client = new Anthropic({ apiKey });

  try {
    const body = await req.json();
    const { text, imageBase64, mimeType, imageFocus, outputLanguage, previousResults, mode } = body as {
      text?: string;
      imageBase64?: string;
      mimeType?: string;
      imageFocus?: "object" | "feeling";
      outputLanguage?: "it" | "en";
      previousResults?: PreviousResult[];
      mode?: "reverse";
    };

    const language: "it" | "en" = outputLanguage === "en" ? "en" : "it";
    const isIt = language === "it";

    if (!text && !imageBase64) {
      return NextResponse.json(
        { error: isIt ? "Fornisci un testo o un'immagine." : "Please provide a text or an image." },
        { status: 400 }
      );
    }

    // Reverse mode: given a made-up word, invent its definition
    if (mode === "reverse") {
      const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: buildReverseSystemPrompt(language),
        messages: [{ role: "user", content: text?.trim() ?? "" }],
      });
      const raw = response.content[0];
      if (raw.type !== "text") throw new Error(isIt ? "Risposta inattesa dal modello." : "Unexpected response from model.");
      const jsonText = raw.text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
      return NextResponse.json(JSON.parse(jsonText));
    }

    type ContentBlock =
      | { type: "image"; source: { type: "base64"; media_type: ImageMediaType; data: string } }
      | { type: "text"; text: string };

    const userContent: ContentBlock[] = [];

    if (imageBase64 && mimeType) {
      userContent.push({
        type: "image",
        source: {
          type: "base64",
          media_type: mimeType as ImageMediaType,
          data: imageBase64,
        },
      });
    }

    let textPrompt: string;
    if (text?.trim()) {
      textPrompt = text.trim();
    } else if (imageBase64 && imageFocus === "feeling") {
      textPrompt = isIt
        ? "Guarda questa immagine. Non nominare l'oggetto o la scena in sé, ma inventa una parola per il sentimento, l'atmosfera o l'emozione che questa immagine evoca nell'osservatore."
        : "Look at this image. Do not name the object or scene itself — instead, invent a word for the feeling, atmosphere, or emotion this image evokes in the viewer.";
    } else {
      textPrompt = isIt
        ? "Guarda questa immagine. Identifica l'oggetto, il soggetto o la scena principale e inventa una parola nuova per nominarlo, come se fosse un concetto che non aveva ancora un nome."
        : "Look at this image. Identify the main object, subject, or scene and invent a new word to name it, as if it were a concept that had no name yet.";
    }

    userContent.push({ type: "text", text: textPrompt });

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: buildSystemPrompt(language, previousResults ?? []),
      messages: [{ role: "user", content: userContent }],
    });

    const raw = response.content[0];
    if (raw.type !== "text") throw new Error(isIt ? "Risposta inattesa dal modello." : "Unexpected response from model.");

    // Strip markdown code fences if present
    const jsonText = raw.text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
    const result = JSON.parse(jsonText);

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore sconosciuto";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
