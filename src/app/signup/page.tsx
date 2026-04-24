"use client";

import { motion } from "framer-motion";
import { Code2, ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
      <Link href="/" style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--text-primary)' }} className="display-font">
        <div style={{ background: '#111827', color: '#fff', borderRadius: '8px', padding: '6px' }}>
          <Code2 size={20} strokeWidth={2.5} />
        </div>
        Codeship
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel" 
        style={{ width: '100%', maxWidth: '400px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 className="display-font" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>Create an Account</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Get started with Codeship today.</p>
        </div>

        <button 
          onClick={() => signIn("github", { callbackUrl: '/settings' })}
          className="pill-dark" 
          style={{ width: '100%', padding: '12px', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
        >
          <FaGithub size={20} /> Continue with GitHub
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--accent-primary)', fontWeight: '500' }}>Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
