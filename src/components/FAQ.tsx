"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Codeship?",
    answer: "Codeship is a powerful browser extension that automatically tracks your LeetCode problem-solving progress and syncs it directly to your GitHub repository in real-time."
  },
  {
    question: "What problems does Codeship solve?",
    answer: "It eliminates the manual work of downloading, formatting, and pushing your LeetCode solutions to GitHub. It helps you build a strong portfolio effortlessly while you focus on problem-solving."
  },
  {
    question: "Is Codeship meant for developers or teams?",
    answer: "Codeship is built for individual developers, students, and job seekers looking to showcase their algorithmic skills. However, teams can also use it to standardize how coding challenges are tracked."
  },
  {
    question: "How does Codeship handle real-time syncing?",
    answer: "As soon as you successfully submit a solution on LeetCode, our extension captures the code, complexity metrics, and problem details, securely pushing a formatted commit straight to your linked GitHub repository."
  },
  {
    question: "Do I need to manage my own GitHub tokens?",
    answer: "You only need to authenticate once securely via OAuth when setting up the extension. Codeship handles the secure token storage and API communication for you behind the scenes."
  },
  {
    question: "Is Codeship free to use?",
    answer: "Yes! The core syncing functionality of Codeship is completely free. We believe in helping developers build their portfolios without friction."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section style={{ 
      width: "100%", 
      maxWidth: "800px", 
      margin: "0 auto 120px auto", 
      padding: "0 24px" 
    }}>
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h2 
          className="display-font" 
          style={{ 
            fontSize: "clamp(2rem, 5vw, 2.5rem)", 
            fontWeight: "bold", 
            marginBottom: "16px" 
          }}
        >
          Common Questions, Clear Answers
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
          Everything you need to know about tracking, syncing, and showcasing your problem-solving skills with Codeship.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          
          return (
            <div 
              key={index}
              style={{
                border: "1px solid var(--border-subtle)",
                borderRadius: "16px",
                background: isOpen ? "var(--surface-elevated)" : "var(--surface-base)",
                boxShadow: isOpen ? "0 8px 32px -12px rgba(0,0,0,0.08)" : "none",
                overflow: "hidden",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                style={{
                  width: "100%",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "none",
                  border: "none",
                  color: "var(--text-primary)",
                  fontSize: "1rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                {faq.question}
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ color: "var(--text-secondary)" }}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div 
                      style={{ 
                        padding: "0 24px 24px 24px", 
                        color: "var(--text-secondary)",
                        lineHeight: "1.6",
                        fontSize: "0.95rem"
                      }}
                    >
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
