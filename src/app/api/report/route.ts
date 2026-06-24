import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get("origin") || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
};

export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(req),
  });
}

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

    return NextResponse.json(
      { success: true, report },
      { headers: getCorsHeaders(request) }
    );
  } catch (error: any) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to submit report", details: error.message },
      { status: 500, headers: getCorsHeaders(request) }
    );
  }
}
