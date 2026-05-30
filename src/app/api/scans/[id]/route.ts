import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const scan = await db.scan.findUnique({
      where: { id: params.id }
    });

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...scan,
      probabilities: JSON.parse(scan.probabilities)
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch scan" }, { status: 500 });
  }
}
