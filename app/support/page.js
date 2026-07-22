"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../components/ThemeProvider";
import { ProtectedRoute, useAuth } from "../components/AuthProvider";
import { api } from "../lib/api";

function SupportContent() {
  const { t } = useTheme();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(true);

  const isAgent = user?.role === "admin" || user?.role === "support";

  const fetchConversations = async () => {
    setLoading(true);
    try {
      // Gateway: GET /support/conversations devuelve TODAS.
      // Los usuarios normales filtran sus propias conversaciones aqui.
      const data = await api.get("/support/conversations");
      const list = Array.isArray(data) ? data : [];
      setConversations(isAgent ? list : list.filter((c) => c.userId === user?.id));
    } catch {
      setConversations([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchConversations(); }, [user]);

  const createConversation = async (e) => {
    e.preventDefault();
    if (!subject.trim()) return;
    try {
      await api.post("/support/conversations", {
        subject: subject.trim(),
        userId: user?.id,
      });
      setSubject("");
      setShowNewForm(false);
      fetchConversations();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[15%] left-[10%] w-80 h-80 rounded-full blur-[120px]"
          style={{ background: "var(--brand-glow)" }}
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>
              💬 {t("supportTitle")}
            </h1>
            <p className="mt-1" style={{ color: "var(--text-muted)" }}>
              {t("conversations")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNewForm(!showNewForm)}
              className="btn-primary text-sm"
            >
              + {t("newConversation")}
            </motion.button>
            <Link href="/dashboard" className="text-sm font-medium" style={{ color: "var(--brand)" }}>
              ← {t("back")}
            </Link>
          </div>
        </motion.div>

        {/* New conversation form */}
        <AnimatePresence>
          {showNewForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
              onSubmit={createConversation}
            >
              <div className="glass-card p-5">
                <h3 className="font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                  {t("newConversation")}
                </h3>
                <div className="flex gap-3">
                  <input
                    placeholder={t("subject")}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="input-field flex-1"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="btn-primary"
                  >
                    {t("create")}
                  </motion.button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Conversations list */}
        {loading ? (
          <div className="flex flex-col items-center py-16">
            <div
              className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "var(--brand)", borderTopColor: "transparent" }}
            />
            <p className="mt-3" style={{ color: "var(--text-muted)" }}>{t("loading")}</p>
          </div>
        ) : conversations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <span className="text-6xl block mb-4">💬</span>
            <p className="text-lg font-medium" style={{ color: "var(--text-secondary)" }}>
              {t("noConversations")}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-3"
          >
            {conversations.map((conv, idx) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link href={`/support/${conv.id}`}>
                  <div className="glass-card p-5 cursor-pointer hover:scale-[1.01] transition-transform">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {conv.status === "open" ? "🟢" : "⚪"}
                        </span>
                        <div>
                          <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>
                            #{conv.id} — {conv.subject}
                          </h3>
                          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                            {conv.messages?.length || 0} {t("messagesCount")} • {new Date(conv.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span
                        className="badge"
                        style={
                          conv.status === "open"
                            ? { color: "var(--success)", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }
                            : { color: "var(--text-muted)", background: "var(--surface-secondary)", border: "1px solid var(--border)" }
                        }
                      >
                        {conv.status === "open" ? t("openTicket") : t("closedTicket")}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function SupportPage() {
  return (
    <ProtectedRoute>
      <SupportContent />
    </ProtectedRoute>
  );
}
