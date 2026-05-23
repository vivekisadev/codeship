"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstallModal({ isOpen, onClose }: InstallModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          zIndex: 9999, background: 'rgba(0,0,0,0.5)'
        }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="glass-panel"
            style={{ 
              background: 'var(--surface-base)', padding: '32px', 
              borderRadius: '16px', maxWidth: '500px', width: '100%', 
              position: 'relative',
              boxShadow: '0 12px 40px -10px rgba(0,0,0,0.1)'
            }}
          >
            <button 
              onClick={onClose} 
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <X size={20} />
            </button>
            <h3 className="heading-lg" style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
              How to Install Codeship
            </h3>
            <ol style={{ fontSize: '1rem', color: 'var(--text-secondary)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>Your download should start automatically. Extract the <strong>codeship-extension.zip</strong> file.</li>
              <li>Open Chrome and navigate to <code style={{background: 'var(--background)', padding: '2px 6px', borderRadius: '4px'}}>chrome://extensions/</code></li>
              <li>Enable <strong>Developer mode</strong> in the top right corner.</li>
              <li>Click <strong>Load unpacked</strong> and select the extracted folder.</li>
              <li>Go to LeetCode, submit a solution, and watch the magic happen!</li>
            </ol>
            <button 
              onClick={onClose}
              className="btn-primary"
              style={{ marginTop: '24px', width: '100%', padding: '12px', background: 'var(--accent-primary)', color: '#fff', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
            >
              Got it!
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
