import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import crypto from "crypto";

// Handle CORS for preflight requests from the extension
export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin") || "*";
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

const getExtension = (lang: string) => {
  const map: Record<string, string> = {
    python: "py", python3: "py", javascript: "js", typescript: "ts",
    java: "java", cpp: "cpp", c: "c", csharp: "cs",
    ruby: "rb", swift: "swift", go: "go", rust: "rs"
  };
  return map[lang.toLowerCase()] || "txt";
};

// Push a file to GitHub, resolving SHA if it exists
async function pushToGitHub(repo: string, token: string, path: string, content: string, message: string) {
  const url = `https://api.github.com/repos/${repo}/contents/${path}`;
  const getRes = await fetch(url, {
    headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" },
  });
  
  let sha = undefined;
  if (getRes.status === 200) {
    const file = await getRes.json();
    sha = file.sha;
  }

  const putRes = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(content).toString("base64"),
      sha
    }),
  });

  return putRes.ok;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const email = session?.user?.email || body.email;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized. Please log into Codeship." }, { status: 401 });
    }

    const { title, titleSlug, code, language } = body;

    if (!title || !code || !language || !titleSlug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
      include: { accounts: true, submissions: true }
    });

    const githubAccount = user?.accounts?.find(a => a.provider === "github");
    const githubToken = githubAccount?.access_token;

    if (!user || !githubToken || !user.targetRepo) {
      return NextResponse.json({ error: "GitHub OAuth token or Target Repo not configured." }, { status: 400 });
    }

    // Idempotent Check
    const codeHash = crypto.createHash("sha256").update(code + titleSlug).digest("hex");
    const existing = await prisma.submission.findFirst({
      where: { userId: user.id, codeHash }
    });

    if (existing) {
      // Already pushed this exact code for this problem
      return NextResponse.json({ success: true, message: "Duplicate submission skipped." });
    }

    let finalTitle = title;
    let problemContent = "";
    
    try {
      const query = `
        query questionData($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            questionFrontendId
            title
            content
            difficulty
          }
        }
      `;
      const lcRes = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables: { titleSlug } })
      });
      const lcData = await lcRes.json();
      const question = lcData?.data?.question;
      
      if (question) {
        finalTitle = `${question.questionFrontendId}. ${question.title}`;
        const diffColor = question.difficulty === 'Easy' ? '#00b8a3' : question.difficulty === 'Medium' ? '#ffc01e' : '#ff375f';
        const diffHtml = `<h3><span style="color:${diffColor}">${question.difficulty}</span></h3>`;
        problemContent = `<h2><a href="https://leetcode.com/problems/${titleSlug}">${finalTitle}</a></h2>\n${diffHtml}\n<hr>\n${question.content}`;
      }
    } catch(e) {
      console.error("GraphQL Error", e);
    }

    // 1. Push Code File
    const ext = getExtension(language);
    const codePath = `problems/${titleSlug}/solution.${ext}`;
    await pushToGitHub(user.targetRepo, githubToken, codePath, code, `Codeship: Added solution for ${title}`);

    // 2. Push Problem README
    if (problemContent) {
      const readmePath = `problems/${titleSlug}/README.md`;
      await pushToGitHub(user.targetRepo, githubToken, readmePath, problemContent, `Codeship: Added README for ${title}`);
    }

    // 3. Save to DB
    await prisma.submission.create({
      data: {
        userId: user.id,
        title: title,
        language: language,
        status: "Accepted",
        codeHash: codeHash,
      }
    });

    // 4. Generate and Push Root Stats README
    const allSubmissions = await prisma.submission.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }
    });

    const solvedCount = new Set(allSubmissions.map(s => s.title)).size;
    const langs = [...new Set(allSubmissions.map(s => s.language))].join(", ");

    const rootReadme = `# Codeship - LeetCode Journey 🚀\n\n` +
      `This repository contains my LeetCode solutions automatically synced using **Codeship**.\n\n` +
      `## 📊 Stats\n` +
      `- **Problems Solved:** ${solvedCount}\n` +
      `- **Total Submissions:** ${allSubmissions.length}\n` +
      `- **Languages Used:** ${langs}\n\n` +
      `*Auto-generated by Codeship*`;

    await pushToGitHub(user.targetRepo, githubToken, "README.md", rootReadme, "Codeship: Update stats README");

    return NextResponse.json({ success: true, message: "Successfully synced via Codeship!" }, {
      headers: {
        "Access-Control-Allow-Origin": req.headers.get("origin") || "*",
        "Access-Control-Allow-Credentials": "true",
      }
    });
  } catch (error: any) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { 
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": req.headers.get("origin") || "*",
        "Access-Control-Allow-Credentials": "true",
      }
    });
  }
}
