"use client";

import { motion } from "framer-motion";
import { Settings, Link as LinkIcon, Unplug, Save, LogOut } from "lucide-react";
import { SiLeetcode } from "react-icons/si";
import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { InstallModal } from "../../components/InstallModal";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function SettingsPage() {
  const { data: session, status } = useSession();

  const [githubPat, setGithubPat] = useState("");
  const [targetRepo, setTargetRepo] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [autoLinkedIn, setAutoLinkedIn] = useState(false);
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled((prev) => {
        if (!prev && window.scrollY > 60) return true;
        if (prev && window.scrollY < 20) return false;
        return prev;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/settings")
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setGithubPat(data.githubPat || "");
            setTargetRepo(data.targetRepo || "");
            setAutoLinkedIn(data.autoLinkedIn || false);
            setLinkedinConnected(data.linkedinConnected || false);
          }
        });
    }
  }, [status]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    await fetch("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targetRepo, autoLinkedIn }),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDisconnect = async (provider: string) => {
    if (!confirm(`Are you sure you want to disconnect ${provider}?`)) return;

    await fetch(`/api/settings?provider=${provider}`, { method: "DELETE" });

    if (provider === "linkedin") {
      setLinkedinConnected(false);
      setAutoLinkedIn(false);
    }
  };

  if (status === "loading")
    return (
      <div
        style={{ minHeight: "100vh", background: "var(--background)" }}
      ></div>
    );

  if (status === "unauthenticated") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--background)",
        }}
      >
        <div
          className="glass-panel"
          style={{ padding: "40px", textAlign: "center" }}
        >
          <h2 className="heading-lg" style={{ marginBottom: "16px" }}>
            Not Authenticated
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
            Please log in to access your settings.
          </p>
          <Link
            href="/login"
            className="btn-primary"
            style={{ padding: "12px 24px" }}
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        paddingBottom: "100px",
      }}
    >
      {/* Top Navigation */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: scrolled ? "12px 24px" : "24px",
          position: "sticky",
          top: scrolled ? "16px" : "0",
          zIndex: 50,
          backdropFilter: scrolled ? "blur(24px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
          backgroundColor: scrolled ? "var(--surface-elevated)" : "transparent",
          borderRadius: scrolled ? "var(--radius-full)" : "0",
          border: scrolled ? "1px solid var(--border-subtle)" : "1px solid transparent",
          borderBottom: !scrolled ? "1px solid var(--border-subtle)" : "1px solid var(--border-subtle)",
          boxShadow: scrolled ? "0 12px 32px -8px rgba(0, 0, 0, 0.08)" : "none",
          transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
          margin: scrolled ? "0 24px" : "0",
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <span className="display-font" style={{ 
            fontWeight: '900', 
            fontSize: scrolled ? '1.5rem' : '2rem', 
            letterSpacing: '-0.04em', 
            color: 'var(--text-primary)', 
            transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)' 
          }}>
            Codeship
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <ThemeToggle />
          <Link
            href="/dashboard"
            className="btn-secondary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              fontSize: "0.875rem",
            }}
          >
            Dashboard
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="btn-secondary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              fontSize: "0.875rem",
            }}
          >
            <LogOut size={16} />
          </button>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "var(--text-primary)",
              overflow: "hidden",
            }}
          >
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt="Avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </div>
        </div>
      </nav>

      <main
        className="container"
        style={{ marginTop: "80px", maxWidth: "800px" }}
      >
        <div style={{ marginBottom: "40px" }}>
          <h1
            className="display-font"
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Dashboard Settings
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Configure where your LeetCode solutions are pushed.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* GitHub Settings Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              padding: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(59, 130, 246, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaGithub size={24} color="var(--accent-primary)" />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                >
                  GitHub Push Settings
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.875rem",
                  }}
                >
                  Provide a fine-grained Personal Access Token with repository
                  write access.
                </p>
              </div>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div
                style={{
                  padding: "16px",
                  background: "rgba(16, 185, 129, 0.05)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <h4
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "var(--success)",
                    marginBottom: "8px",
                  }}
                >
                  Security Upgraded
                </h4>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  Codeship now uses secure GitHub OAuth integration. You no
                  longer need to manage or paste Personal Access Tokens (PAT).
                </p>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Target Repository Name
                </label>
                <input
                  type="text"
                  value={targetRepo}
                  onChange={(e) => setTargetRepo(e.target.value)}
                  placeholder="e.g. yourusername/leetcode-solutions"
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "var(--background)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    outline: "none",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "16px",
                }}
              >
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="pill-dark"
                  style={{
                    padding: "12px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {saving ? (
                    "Saving..."
                  ) : saved ? (
                    "Saved!"
                  ) : (
                    <>
                      <Save size={16} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Chrome Extension Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              padding: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", gap: "16px", alignItems: "center" }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(255, 161, 22, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SiLeetcode size={24} color="#ffa116" />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      marginBottom: "4px",
                    }}
                  >
                    Browser Extension
                  </h3>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.875rem",
                    }}
                  >
                    Download and install the extension to auto-sync your
                    solutions.
                  </p>
                </div>
              </div>

              <a
                href="/codeship-extension.zip"
                download
                onClick={() => setShowInstallModal(true)}
                className="btn-primary"
                style={{
                  background: "#ffa116",
                  color: "#000",
                  padding: "10px 20px",
                  borderRadius: "var(--radius-md)",
                  textDecoration: "none",
                  fontWeight: "600",
                }}
              >
                Download Extension
              </a>
            </div>

            <div
              style={{
                padding: "16px",
                background: "var(--surface-base)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <h4
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Installation Instructions:
              </h4>
              <ol
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  paddingLeft: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <li>
                  Download and extract the <code>codeship-extension.zip</code>{" "}
                  file.
                </li>
                <li>
                  Open Chrome and navigate to <code>chrome://extensions/</code>
                </li>
                <li>
                  Enable <strong>Developer mode</strong> in the top right
                  corner.
                </li>
                <li>
                  Click <strong>Load unpacked</strong> and select the extracted
                  folder.
                </li>
                <li>
                  Go to LeetCode, submit a solution, and watch the magic happen!
                </li>
              </ol>
            </div>
          </motion.div>

          {/* Social Broadcasting Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              padding: "32px",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                Social Broadcasting
              </h3>
              <p
                style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}
              >
                Share your algorithmic victories on LinkedIn with a dynamic code
                snapshot.
              </p>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              {/* LinkedIn Settings */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px",
                  background: "var(--surface-base)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <FaLinkedin size={24} color="#0077b5" />
                  <div>
                    <h4 style={{ fontWeight: "bold" }}>LinkedIn</h4>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {linkedinConnected ? "Account Linked" : "Not Linked"}
                    </p>
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  {linkedinConnected ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                        }}
                      >
                        <div className="switch">
                          <input
                            type="checkbox"
                            checked={autoLinkedIn}
                            onChange={(e) => setAutoLinkedIn(e.target.checked)}
                          />
                          <span className="slider round"></span>
                        </div>
                        Auto-Post Solutions
                      </label>
                      <button
                        onClick={() => handleDisconnect("linkedin")}
                        className="btn-secondary"
                        style={{
                          padding: "6px 12px",
                          fontSize: "0.75rem",
                          color: "#ef4444",
                          borderColor: "#ef4444",
                        }}
                      >
                        Disconnect
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => signIn("linkedin")}
                      className="btn-secondary"
                      style={{ padding: "8px 16px", fontSize: "0.875rem" }}
                    >
                      Connect LinkedIn
                    </button>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "8px",
                }}
              >
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="pill-dark"
                  style={{
                    padding: "12px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {saving ? (
                    "Saving..."
                  ) : saved ? (
                    "Saved!"
                  ) : (
                    <>
                      <Save size={16} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <InstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
}
