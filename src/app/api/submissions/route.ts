import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

// Handle CORS for preflight requests from the extension (if made directly from content script)
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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Fallback: If no session cookie, they might pass an api_key or email in the body for testing
    const body = await req.json();
    const email = session?.user?.email || body.email;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized. Please log into LeetSync." }, { status: 401 });
    }

    const { title, code, language } = body;

    if (!title || !code || !language) {
      return NextResponse.json({ error: "Missing required fields: title, code, language" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user || !user.githubPat || !user.targetRepo) {
      return NextResponse.json({ error: "GitHub PAT or Target Repo not configured in Settings." }, { status: 400 });
    }

    // Prepare the GitHub API request
    const fileExtension = language === "python3" ? "py" : language === "cpp" ? "cpp" : language === "java" ? "java" : "js";
    const filename = `${title.replace(/[^a-zA-Z0-9]/g, "-")}.${fileExtension}`;
    const path = `${filename}`;
    
    const githubApiUrl = `https://api.github.com/repos/${user.targetRepo}/contents/${path}`;

    // Check if file already exists to get its SHA (required for updating files in GitHub API)
    const getRes = await fetch(githubApiUrl, {
      headers: {
        Authorization: `token ${user.githubPat}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    let sha = undefined;
    if (getRes.status === 200) {
      const getFile = await getRes.json();
      sha = getFile.sha;
    }

    // Commit the file
    const contentEncoded = Buffer.from(code).toString("base64");
    
    const commitBody: any = {
      message: `LeetSync: Added solution for ${title}`,
      content: contentEncoded,
    };
    if (sha) commitBody.sha = sha;

    const putRes = await fetch(githubApiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${user.githubPat}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commitBody),
    });

    if (!putRes.ok) {
      const errData = await putRes.json();
      console.error("GitHub API Error:", errData);
      return NextResponse.json({ error: "Failed to push to GitHub", details: errData }, { status: 500 });
    }

    // Save submission to DB
    await prisma.submission.create({
      data: {
        userId: user.id,
        title: title,
        language: language,
        status: "Accepted",
      }
    });

    return NextResponse.json({ success: true, message: "Successfully pushed to GitHub!" }, {
      headers: {
        "Access-Control-Allow-Origin": req.headers.get("origin") || "*",
        "Access-Control-Allow-Credentials": "true",
      }
    });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { 
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": req.headers.get("origin") || "*",
        "Access-Control-Allow-Credentials": "true",
      }
    });
  }
}
