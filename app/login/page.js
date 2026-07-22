"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useTheme } from "../components/ThemeProvider";
import { useAuth } from "../components/AuthProvider";
import { api } from "../lib/api";

export default function Login() {
  const router = useRouter();
  const { t, theme } = useTheme();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError(t("fillAll"));
      return;
    }
    setLoading(true);
    try {
      // Gateway: POST /auth/login -> { accessToken, user }
      const data = await api.post("/auth/login", form, { auth: false });
      setLoading(false);
      if (data.accessToken && data.user) {
        login(data); // guarda user + accessToken
        setShowSuccess(true);
        setTimeout(() => router.push("/dashboard"), 2500);
      } else {
        setError(t("wrongCredentials"));
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || t("wrongCredentials"));
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Success overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: "var(--background)" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-72 h-72"
            >
              <DotLottieReact
                src="/animations/Food delivered.lottie"
                autoplay
                loop={false}
                style={{ width: "100%", height: "100%" }}
              />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-black gradient-text mt-4"
            >
              {t("welcome")}!
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 w-48 h-1.5 rounded-full overflow-hidden"
              style={{ background: "var(--surface-secondary)" }}
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 1.2, ease: "easeInOut" }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(to right, var(--brand), var(--brand-hover))" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[-10%] left-[20%] w-96 h-96 rounded-full blur-[120px]"
          style={{ background: "var(--brand-glow)" }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Form */}
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
          <span className="text-4xl">🔐</span>
          <h1 className="mt-3 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {t("login")}
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
          {loading ? t("entering") : t("enter")}
        </motion.button>

        <div className="mt-6 space-y-2 text-center text-sm">
          <p>
            <Link href="/forgot-password" className="transition-colors font-medium" style={{ color: "var(--brand)" }}>
              {t("forgotPassword")}
            </Link>
          </p>
          <p style={{ color: "var(--text-muted)" }}>
            {t("noAccount")}{" "}
            <Link href="/register" className="font-medium transition-colors" style={{ color: "var(--brand)" }}>
              {t("register")}
            </Link>
          </p>
        </div>
      </motion.form>
    </div>
  );
}
