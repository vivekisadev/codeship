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

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  const provider = searchParams.get('provider');

  if (!provider) {
    return NextResponse.json({ error: "Provider is required" }, { status: 400 });
  }

  try {
    await prisma.account.deleteMany({
      where: {
        userId: userId,
        provider: provider
      }
    });

    if (provider === 'twitter') {
      await prisma.user.update({
        where: { id: userId },
        data: { autoTweet: false }
      });
    } else if (provider === 'linkedin') {
      await prisma.user.update({
        where: { id: userId },
        data: { autoLinkedIn: false }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 });
  }
}
