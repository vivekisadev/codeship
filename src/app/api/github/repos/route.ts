import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true }
    });

    const githubAccount = user?.accounts?.find((a) => a.provider === "github");
    const githubToken = githubAccount?.access_token;

    if (!githubToken) {
      return NextResponse.json({ error: "No GitHub account connected." }, { status: 400 });
    }

    // Fetch repositories from GitHub API
    const response = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Codeship-App"
      }
    });

    if (!response.ok) {
      console.error("Failed to fetch GitHub repos", await response.text());
      return NextResponse.json({ error: "Failed to fetch repositories." }, { status: 500 });
    }

    const repos = await response.json();
    const repoList = repos.map((r: any) => ({
      id: r.id,
      name: r.full_name,
      private: r.private,
      url: r.html_url
    }));

    return NextResponse.json(repoList);
  } catch (error: any) {
    console.error("Error fetching repos:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
