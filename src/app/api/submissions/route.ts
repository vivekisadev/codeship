import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import crypto from "crypto";

const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get("origin") || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
};

// Handle CORS for preflight requests from the extension
export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(req),
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
  const cleanRepo = repo.replace('https://github.com/', '').replace('http://github.com/', '').replace(/\/$/, '').trim();
  const url = `https://api.github.com/repos/${cleanRepo}/contents/${path}`;
  const getRes = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json", "User-Agent": "Codeship-App" },
  });
  
  let sha = undefined;
  if (getRes.status === 200) {
    const file = await getRes.json();
    sha = file.sha;
  }

  const putRes = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "Codeship-App"
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(content).toString("base64"),
      sha
    }),
  });

  if (!putRes.ok) {
    const errorBody = await putRes.text();
    console.error(`Codeship GitHub Push Error [${putRes.status}] to ${cleanRepo}:`, errorBody);
  }

  return putRes.ok;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const email = session?.user?.email || body.email;

    if (!email) {
      return NextResponse.json(
        { error: "Unauthorized. Please log into Codeship." },
        { status: 401, headers: getCorsHeaders(req) }
      );
    }

    const { title, titleSlug, code, language, runtime, memory, linkedInStyle, base64Image } = body;

    if (!title || !code || !language || !titleSlug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers: getCorsHeaders(req) }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
      include: { accounts: true, submissions: true }
    });

    const githubAccount = user?.accounts?.find(a => a.provider === "github");
    const githubToken = githubAccount?.access_token;
    
    const linkedinAccount = user?.accounts?.find(a => a.provider === "linkedin");

    if (!user || !githubToken || !user.targetRepo) {
      return NextResponse.json(
        { error: "GitHub OAuth token or Target Repo not configured." },
        { status: 400, headers: getCorsHeaders(req) }
      );
    }

    // Idempotent Check
    const codeHash = crypto.createHash("sha256").update(code + titleSlug).digest("hex");
    const existing = await prisma.submission.findFirst({
      where: { userId: user.id, codeHash }
    });

    if (existing) {
      // Already pushed this exact code for this problem
      return NextResponse.json(
        { success: true, message: "Duplicate submission skipped." },
        { headers: getCorsHeaders(req) }
      );
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
    const pushSuccess = await pushToGitHub(user.targetRepo, githubToken, codePath, code, `Codeship: Added solution for ${title}`);

    if (!pushSuccess) {
      return NextResponse.json(
        { error: "Failed to push to GitHub. Verify your target repo exists and Codeship has access." },
        { status: 400, headers: getCorsHeaders(req) }
      );
    }

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
        runtime: runtime,
        memory: memory
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

    // 5. Social Broadcasting
    const origin = new URL(req.url).origin;
    
    // Multiple writing styles to keep the timeline fresh and authentic
    const postTemplates = [
      `I just successfully solved "${title}" on LeetCode! 🚀\n\nI tackled this problem using ${language}, focusing on writing clean and optimized code.\n\n⏱️ Runtime: ${runtime || 'N/A'}\n💾 Memory: ${memory || 'N/A'}\n\nYou can check out my complete solution on my GitHub:\n🔗 https://github.com/${user.targetRepo}/blob/main/${codePath}\n\n#LeetCode #SoftwareEngineering #ProblemSolving #Coding #Codeship`,
      
      `Another algorithm down! Just wrapped up "${title}" on LeetCode. 🧠💻\n\nBuilt the solution in ${language}. Always satisfying to see the test cases pass!\n\n⏱️ Speed: ${runtime || 'N/A'}\n💾 Memory usage: ${memory || 'N/A'}\n\nFull code is available here:\n🔗 https://github.com/${user.targetRepo}/blob/main/${codePath}\n\n#LeetCode #SoftwareDeveloper #CodingJourney #Algorithms`,
      
      `Happy to share that I just cracked the "${title}" problem! 🎉\n\nIt was a great exercise in problem-solving. Here are the stats for my ${language} implementation:\n\n⚡ Runtime: ${runtime || 'N/A'}\n🧠 Memory: ${memory || 'N/A'}\n\nCheck out the repo for my approach:\n🔗 https://github.com/${user.targetRepo}/blob/main/${codePath}\n\n#Coding #Tech #Programming #LeetCode #CodeShip`,
      
      `Just pushed a new solution to my algorithms repo! 🚀\n\nProblem: ${title}\nLanguage: ${language}\n\nPerformance metrics:\n⏱️ ${runtime || 'N/A'}\n💾 ${memory || 'N/A'}\n\nYou can review the source code on my GitHub:\n🔗 https://github.com/${user.targetRepo}/blob/main/${codePath}\n\n#LeetCode #Engineering #Developer #OpenSource`
    ];

    let postText = "";
    if (linkedInStyle && linkedInStyle !== "random" && !isNaN(parseInt(linkedInStyle))) {
      postText = postTemplates[parseInt(linkedInStyle) % postTemplates.length];
    } else {
      postText = postTemplates[Math.floor(Math.random() * postTemplates.length)];
    }

    let imageBuffer: Buffer | null = null;
    try {
      if (base64Image) {
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
        imageBuffer = Buffer.from(base64Data, 'base64');
        console.log("Codeship: Using base64Image provided by the extension");
      } else {
        const ogUrl = new URL(`${origin}/api/og`);
        ogUrl.searchParams.set("title", title);
        ogUrl.searchParams.set("lang", language);
        ogUrl.searchParams.set("code", code);

        const ogRes = await fetch(ogUrl.toString());
        if (!ogRes.ok) {
          throw new Error("Failed to generate OG image for LinkedIn");
        }
        const arrayBuffer = await ogRes.arrayBuffer();
        imageBuffer = Buffer.from(arrayBuffer);
      }
    } catch (e: any) {
      console.error("Error generating LinkedIn image:", e);
    }



    if (user.autoLinkedIn && linkedinAccount?.access_token && linkedinAccount.providerAccountId) {
      try {
        let linkedInBody: any = {
          author: `urn:li:person:${linkedinAccount.providerAccountId}`,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: { text: postText },
              shareMediaCategory: "NONE"
            }
          },
          visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
        };

        if (imageBuffer && imageBuffer.length > 0) {
          // 1. Register Upload
          const regRes = await fetch("https://api.linkedin.com/v2/assets?action=registerUpload", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${linkedinAccount.access_token}`,
              "Content-Type": "application/json",
              "X-Restli-Protocol-Version": "2.0.0"
            },
            body: JSON.stringify({
              registerUploadRequest: {
                recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
                owner: `urn:li:person:${linkedinAccount.providerAccountId}`,
                serviceRelationships: [{ relationshipType: "OWNER", identifier: "urn:li:userGeneratedContent" }]
              }
            })
          });
          
          if (regRes.ok) {
            const regData = await regRes.json();
            const uploadMechanism = regData?.value?.uploadMechanism?.["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"];
            const uploadUrl = uploadMechanism?.uploadUrl;
            const asset = regData?.value?.asset;

            // 2. Upload Image
            if (uploadUrl && asset) {
              await fetch(uploadUrl, {
                method: "PUT",
                headers: { "Content-Type": "image/png" },
                body: imageBuffer as any
              });

              // 3. Update LinkedIn Body
              linkedInBody.specificContent["com.linkedin.ugc.ShareContent"].shareMediaCategory = "IMAGE";
              linkedInBody.specificContent["com.linkedin.ugc.ShareContent"].media = [
                {
                  status: "READY",
                  description: { text: "LeetCode Solution" },
                  media: asset
                }
              ];
            }
          }
        }

        await fetch("https://api.linkedin.com/v2/ugcPosts", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${linkedinAccount.access_token}`,
            "Content-Type": "application/json",
            "X-Restli-Protocol-Version": "2.0.0"
          },
          body: JSON.stringify(linkedInBody)
        });
      } catch (e) {
        console.error("LinkedIn Broadcast Error:", e);
      }
    }

    return NextResponse.json(
      { success: true, message: "Successfully synced via Codeship!" },
      { headers: getCorsHeaders(req) }
    );
  } catch (error: any) {
    console.error("Sync Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500, headers: getCorsHeaders(req) }
    );
  }
}
