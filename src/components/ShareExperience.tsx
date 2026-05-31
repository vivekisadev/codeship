"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send } from "lucide-react";
import toast from "react-hot-toast";

const AVATARS = ["👨‍💻", "👩‍💻", "👩‍🎨", "👨‍🎓", "👨‍🚀", "👩‍🚀"];

export function ShareExperience() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [text, setText] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text || !avatar) {
      toast.error("Name and testimonial are required!");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, handle, text, avatar }),
      });

      if (res.ok) {
        toast.success("Thank you for sharing your experience!");
        setIsOpen(false);
        setName("");
        setHandle("");
        setText("");
        setAvatar(AVATARS[0]);
      } else {
        toast.error("Failed to submit testimonial");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-secondary"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          fontWeight: 600,
          border: '1px solid var(--border-glow)',
          background: 'var(--surface-elevated)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          fontSize: '1rem',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 8px 30px -10px rgba(0,0,0,0.15)',
          borderRadius: 'var(--radius-full)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 40px -10px rgba(0,0,0,0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 30px -10px rgba(0,0,0,0.15)';
        }}
      >
        <MessageSquare size={18} /> Share Your Experience
      </button>

      {mounted && createPortal(
        <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              zIndex: 999999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(12px)',
              padding: '16px'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                position: 'relative',
                background: 'var(--surface-elevated)',
                border: '1px solid var(--border-glow)',
                width: '100%',
                maxWidth: '500px',
                padding: '40px',
                borderRadius: '24px',
                boxShadow: '0 24px 60px -12px rgba(0,0,0,0.4)',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              {/* Premium Glow Effect inside Modal */}
              <div style={{
                position: 'absolute',
                top: 0, left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: '4px',
                background: 'linear-gradient(90deg, transparent, var(--text-primary), transparent)',
                opacity: 0.3,
                borderRadius: '100%',
                filter: 'blur(4px)'
              }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 className="display-font" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Share Your Experience</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Choose an Avatar</label>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {AVATARS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setAvatar(emoji)}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: avatar === emoji ? 'var(--border-subtle)' : 'transparent',
                          border: avatar === emoji ? '2px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                          fontSize: '1.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--surface-elevated)',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        outline: 'none',
                      }}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Handle (Optional)</label>
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--surface-elevated)',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        outline: 'none',
                      }}
                      placeholder="@janedoe"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Your Testimonial</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--surface-elevated)',
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      minHeight: '120px',
                      resize: 'none',
                      outline: 'none',
                    }}
                    placeholder="How has Codeship helped you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '14px 24px',
                    opacity: isSubmitting ? 0.7 : 1,
                    pointerEvents: isSubmitting ? 'none' : 'auto',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {isSubmitting ? "Submitting..." : (
                    <>
                      <Send size={18} /> Send to the World
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
