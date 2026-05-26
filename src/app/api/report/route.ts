import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, description, type, consoleLogs, source } = body;

    const report = await prisma.report.create({
      data: {
        email: email || null,
        description: description || null,
        type: type || "feedback",
        consoleLogs: consoleLogs || null,
        source: source || "web",
      },
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to submit report" },
      { status: 500 }
    );
  }
}
