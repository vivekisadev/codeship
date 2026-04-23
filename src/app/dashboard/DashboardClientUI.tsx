"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Settings, ExternalLink, Code2, Zap, Flame, CodeSquare } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WelcomeToast } from "@/components/WelcomeToast";

const calculateStreak = (submissions: any[]) => {
  if (submissions.length === 0) return 0;
  
  const dates = [...new Set(submissions.map(s => new Date(s.createdAt).toDateString()))]
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const firstSubDate = dates[0];
  const diffTime = Math.abs(currentDate.getTime() - firstSubDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 1) return 0; // Streak broken

  let expectedDate = new Date(firstSubDate);

  for (const d of dates) {
    if (d.getTime() === expectedDate.getTime()) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export function DashboardClientUI({ session, user, submissions }: { session: any, user: any, submissions: any[] }) {
  const problemsSolved = submissions.length;
  const currentStreak = calculateStreak(submissions);
  const linesCommitted = submissions.length * 34; // Beautiful pseudo-metric

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 24px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '100px' }}>
      <WelcomeToast userName={session.user.name} />
      
      {/* Top Navigation */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--text-primary)' }} className="display-font">
          <div style={{ background: 'var(--text-primary)', color: 'var(--background)', borderRadius: '8px', padding: '6px' }}>
            <Code2 size={20} strokeWidth={2.5} />
          </div>
          LeetSync
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ThemeToggle />
          <Link href="/settings" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.875rem' }}>
            <Settings size={16} /> Settings
          </Link>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Welcome Section */}
        <motion.div variants={itemVariants}>
          <h1 className="heading-lg" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            Hello, <span className="text-gradient">{session.user.name?.split(" ")[0] || "Developer"}</span>!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Here's your algorithmic progress at a glance.</p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {/* Problems Solved */}
          <motion.div whileHover={{ scale: 1.02, translateY: -4 }} className="bento-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-secondary)', fontWeight: 'bold', marginBottom: '16px' }}>
              <Zap size={18} /> Problems Solved
            </div>
            <div className="display-font" style={{ fontSize: '3.5rem', fontWeight: 'bold', lineHeight: '1' }}>{problemsSolved}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '12px' }}>Tracked algorithms via LeetSync</div>
          </motion.div>

          {/* Current Streak */}
          <motion.div whileHover={{ scale: 1.02, translateY: -4 }} className="bento-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: 'bold', marginBottom: '16px' }}>
              <Flame size={18} /> Current Streak
            </div>
            <div className="display-font" style={{ fontSize: '3.5rem', fontWeight: 'bold', lineHeight: '1' }}>
              {currentStreak} <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Days</span>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '12px' }}>Keep the momentum going!</div>
          </motion.div>

          {/* Lines Committed */}
          <motion.div whileHover={{ scale: 1.02, translateY: -4 }} className="bento-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: 'bold', marginBottom: '16px' }}>
              <CodeSquare size={18} /> Lines Committed
            </div>
            <div className="display-font" style={{ fontSize: '3.5rem', fontWeight: 'bold', lineHeight: '1' }}>{linesCommitted.toLocaleString()}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '12px' }}>Estimated lines written</div>
          </motion.div>
        </motion.div>

        {/* Recent Submissions */}
        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="display-font" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Recent Submissions</h2>
            {user.targetRepo && (
              <a href={`https://github.com/${user.targetRepo}`} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ExternalLink size={16} /> View Repository
              </a>
            )}
          </div>

          {submissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 24px', background: 'var(--surface-base)', borderRadius: '16px', border: '1px dashed var(--border-subtle)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <Code2 size={24} color="var(--text-tertiary)" />
              </div>
              <p style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px' }}>No solutions captured yet</p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Go to LeetCode and submit a passing solution to see it sync here magically.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {submissions.map((sub, i) => (
                <motion.div 
                  key={sub.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  whileHover={{ x: 4, backgroundColor: 'var(--surface-elevated)' }}
                  className="mockup-card" 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: 'var(--surface-base)', border: '1px solid var(--border-subtle)', cursor: 'default' }}
                >
                  <div>
                    <h3 style={{ fontWeight: '600', fontSize: '1.15rem', marginBottom: '6px' }}>{sub.title}</h3>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-primary)' }}></div>
                        {sub.language}
                      </span>
                      <span>{new Date(sub.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 'bold' }}>
                    {sub.status.toUpperCase()}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
