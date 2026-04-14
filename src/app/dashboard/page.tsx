import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Settings, ExternalLink, Code2 } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      submissions: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  const submissions = user.submissions || [];

  return (
    <div style={{ minHeight: '100vh', padding: '40px 24px', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--text-primary)' }} className="display-font">
          <div style={{ background: '#111827', color: '#fff', borderRadius: '8px', padding: '6px' }}>
            <Code2 size={20} strokeWidth={2.5} />
          </div>
          LeetSync
        </Link>
        <Link href="/settings" className="pill-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.875rem' }}>
          <Settings size={16} /> Settings
        </Link>
      </div>

      <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 className="display-font" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>Your Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track the solutions captured by the LeetSync extension.</p>
        </div>

        {submissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>No solutions captured yet.</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Go to LeetCode and submit a passing solution to see it here!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {submissions.map((sub) => (
              <div key={sub.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <h3 style={{ fontWeight: '500', fontSize: '1.1rem', marginBottom: '4px' }}>{sub.title}</h3>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div>
                      {sub.language}
                    </span>
                    <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {user.targetRepo && (
                  <a href={`https://github.com/${user.targetRepo}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', padding: '8px' }}>
                    <ExternalLink size={20} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
