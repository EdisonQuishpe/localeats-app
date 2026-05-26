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
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-[20%] left-[30%] w-80 h-80 rounded-full bg-yellow-500/8 blur-[100px]"
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.form
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-sm p-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl shadow-2xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <span className="text-4xl">🔑</span>
          <h1 className="mt-3 text-2xl font-bold text-white">{t("resetPassword")}</h1>
        </motion.div>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-400 text-sm mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20"
          >
            {message}
          </motion.p>
        )}
        {error && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-red-400 text-sm mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
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
            className="w-full p-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
          />
          <input
            type="password"
            name="newPassword"
            placeholder={t("newPassword")}
            value={form.newPassword}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(249,115,22,0.3)" }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full mt-6 py-3 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all"
        >
          {t("changePassword")}
        </motion.button>

        <p className="mt-6 text-center text-sm">
          <Link href="/login" className="text-orange-400 hover:text-orange-300 transition-colors">
            {t("backToLogin")}
          </Link>
        </p>
      </motion.form>
    </div>
  );
}