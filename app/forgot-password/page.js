"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "../components/ThemeProvider";

export default function ForgotPassword() {
  const { t } = useTheme();
  const [form, setForm] = useState({ email: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.newPassword) {
      setError(t("fillAll"));
      return;
    }
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.message) {
      setMessage(data.message);
      setForm({ email: "", newPassword: "" });
    } else {
      setError(data.error || t("passwordError"));
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[20%] left-[30%] w-80 h-80 rounded-full blur-[120px]"
          style={{ background: "var(--brand-glow)" }}
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.form
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-sm p-8 rounded-2xl shadow-2xl"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(20px)",
          border: "1px solid var(--glass-border)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <span className="text-4xl">🔑</span>
          <h1 className="mt-3 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {t("resetPassword")}
          </h1>
        </motion.div>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm mb-4 p-3 rounded-lg"
            style={{ color: "var(--success)", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
          >
            {message}
          </motion.p>
        )}
        {error && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm mb-4 p-3 rounded-lg"
            style={{ color: "var(--error)", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            {error}
          </motion.p>
        )}

        <div className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder={t("email")}
            value={form.email}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="password"
            name="newPassword"
            placeholder={t("newPassword")}
            value={form.newPassword}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full mt-6 py-3 btn-primary"
        >
          {t("changePassword")}
        </motion.button>

        <p className="mt-6 text-center text-sm">
          <Link href="/login" className="font-medium transition-colors" style={{ color: "var(--brand)" }}>
            {t("backToLogin")}
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
