import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    twitterId: process.env.TWITTER_CLIENT_ID ? "SET" : "MISSING",
    linkedinId: process.env.LINKEDIN_CLIENT_ID ? "SET" : "MISSING",
    githubId: process.env.GITHUB_ID ? "SET" : "MISSING",
  });
}
