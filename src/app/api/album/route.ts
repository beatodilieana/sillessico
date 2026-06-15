import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

const dbPath = join(process.cwd(), "src/data/albumEntries.json");

interface AlbumEntry {
  id: string;
  imageData: string;
  word: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageData, word } = body;

    if (!imageData || !word) {
      return NextResponse.json({ error: "Missing imageData or word" }, { status: 400 });
    }

    let entries: AlbumEntry[] = [];
    try {
      const data = readFileSync(dbPath, "utf-8");
      entries = JSON.parse(data);
    } catch {
      entries = [];
    }

    const newEntry: AlbumEntry = {
      id: `${Date.now()}`,
      imageData,
      word,
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
