import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      targetRepo: true,
      autoTweet: true,
      autoLinkedIn: true,
      accounts: {
        select: {
          provider: true
        }
      }
    }
  });

  const twitterConnected = user?.accounts.some(a => a.provider === 'twitter') || false;
  const linkedinConnected = user?.accounts.some(a => a.provider === 'linkedin') || false;

  return NextResponse.json({
    ...user,
    twitterConnected,
    linkedinConnected
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetRepo, autoTweet, autoLinkedIn } = await req.json();

  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      targetRepo,
      autoTweet,
      autoLinkedIn
    }
  });

  return NextResponse.json({ success: true, user });
}
