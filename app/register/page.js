"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "../components/ThemeProvider";
import { api } from "../lib/api";

export default function Register() {
  const router = useRouter();
  const { t } = useTheme();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError(t("fillAll"));
      return;
    }
    setLoading(true);
    try {
      // Gateway: POST /auth/register -> { message, user }
      const data = await api.post("/auth/register", form, { auth: false });
      setLoading(false);
      if (data.message || data.user) {
        router.push("/login");
      } else {
        setError(t("registerError"));
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || t("registerError"));
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[10%] right-[15%] w-96 h-96 rounded-full blur-[120px]"
          style={{ background: "var(--brand-glow)" }}
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
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
          <span className="text-4xl">✨</span>
          <h1 className="mt-3 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {t("register")}
          </h1>
        </motion.div>

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
            name="name"
            placeholder={t("name")}
            value={form.name}
            onChange={handleChange}
            className="input-field"
          />
          <input
            name="email"
            type="email"
            placeholder={t("email")}
            value={form.email}
            onChange={handleChange}
            className="input-field"
          />
          <input
            name="password"
            type="password"
            placeholder={t("password")}
            value={form.password}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-3 btn-primary disabled:opacity-50"
        >
          {loading ? t("registering") : t("registerBtn")}
        </motion.button>

        <p className="mt-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
          {t("hasAccount")}{" "}
          <Link href="/login" className="font-medium transition-colors" style={{ color: "var(--brand)" }}>
            {t("login")}
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
