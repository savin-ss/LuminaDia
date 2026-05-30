import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const scans = await db.scan.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        filename: true,
        predictedClass: true,
        predictedLabel: true,
        confidence: true,
        mode: true,
        createdAt: true,
      }
    });
    return NextResponse.json(scans);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch scans" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const scan = await db.scan.create({
      data: {
        filename: body.filename,
        predictedClass: body.predictedClass,
        predictedLabel: body.predictedLabel,
        confidence: body.confidence,
        probabilities: JSON.stringify(body.probabilities),
        explanation: body.explanation,
        solution: body.solution,
        gradcamBase64: body.gradcamBase64,
        vitAttBase64: body.vitAttBase64,
        originalImgB64: body.originalImgB64,
        mode: body.mode,
      }
    });
    return NextResponse.json(scan);
  } catch (error) {
    console.error("Error creating scan:", error);
    return NextResponse.json({ error: "Failed to save scan" }, { status: 500 });
  }
}
