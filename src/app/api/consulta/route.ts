import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

const dbPath = join(process.cwd(), "src/data/consultaEntries.json");

interface ConsultaEntry {
  id: string;
  word: string;
  pronunciation: string;
  category: string;
  etymology: string;
  definition: string;
  example: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { word, pronunciation, category, etymology, definition, example } = body;

    if (!word || !definition) {
      return NextResponse.json({ error: "Missing word or definition" }, { status: 400 });
    }

    let entries: ConsultaEntry[] = [];
    try {
      const data = readFileSync(dbPath, "utf-8");
      entries = JSON.parse(data);
    } catch {
      entries = [];
    }

    const newEntry: ConsultaEntry = {
      id: `${Date.now()}`,
      word,
      pronunciation: pronunciation ?? "",
      category: category ?? "",
      etymology: etymology ?? "",
      definition,
      example: example ?? "",
    };

    entries.push(newEntry);
    writeFileSync(dbPath, JSON.stringify(entries, null, 2));

    return NextResponse.json({ success: true, entry: newEntry });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = readFileSync(dbPath, "utf-8");
    const entries = JSON.parse(data);
    return NextResponse.json(entries);
  } catch {
    return NextResponse.json([]);
  }
}
