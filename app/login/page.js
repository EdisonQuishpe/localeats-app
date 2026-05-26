"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useTheme } from "../components/ThemeProvider";
import { useAuth } from "../components/AuthProvider";

export default function Login() {
  const router = useRouter();
  const { t, theme } = useTheme();
  const isDark = theme === "dark";
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
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (data.user) {
      login(data.user);
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 3500);
    } else {
      setError(data.error || t("wrongCredentials"));
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          >
            {/* Animated background - adapts to theme */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute inset-0 ${isDark ? "bg-linear-to-br from-black via-zinc-900 to-black" : "bg-linear-to-br from-white via-orange-50 to-amber-50"}`}
            />

            {/* Particle rings */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
              animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.5], rotate: 180 }}
              transition={{ delay: 0.3, duration: 2, ease: "easeOut" }}
              className={`absolute w-96 h-96 rounded-full border-2 border-dashed ${isDark ? "border-orange-400/30" : "border-orange-400/40"}`}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
              animate={{ opacity: [0, 0.3, 0], scale: [0.8, 2], rotate: -120 }}
              transition={{ delay: 0.5, duration: 2.5, ease: "easeOut" }}
              className={`absolute w-80 h-80 rounded-full border ${isDark ? "border-amber-300/20" : "border-orange-300/30"}`}
            />

            {/* Lottie animation - bigger */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-80 h-80 md:w-96 md:h-96"
            >
              <DotLottieReact
                src="/animations/Food delivered.lottie"
                autoplay
                loop={false}
                style={{ width: "100%", height: "100%" }}
              />
            </motion.div>

            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 text-center mt-2"
            >
              <h2 className={`text-3xl md:text-4xl font-black bg-linear-to-r from-orange-500 via-red-500 to-amber-500 bg-clip-text text-transparent`}>
                ¡Bienvenido de vuelta!
              </h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className={`text-base mt-3 flex items-center justify-center gap-2 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
              >
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  🍔
                </motion.span>
                Preparando tu experiencia gastronómica...
                <motion.span
                  animate={{ rotate: [0, -15, 15, 0] }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                >
                  🔥
                </motion.span>
              </motion.p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className={`relative z-10 mt-8 w-48 h-1.5 rounded-full overflow-hidden ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`}
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.3, duration: 1.2, ease: "easeInOut" }}
                className="h-full bg-linear-to-r from-orange-500 to-amber-400 rounded-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-[-10%] left-[20%] w-96 h-96 rounded-full bg-orange-500/8 blur-[100px]"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[10%] w-80 h-80 rounded-full bg-red-500/8 blur-[100px]"
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
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
          <span className="text-4xl">🔐</span>
          <h1 className="mt-3 text-2xl font-bold text-white">{t("login")}</h1>
        </motion.div>

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
          <div>
            <input
              name="email"
              type="email"
              placeholder={t("email")}
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder={t("password")}
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(249,115,22,0.3)" }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-3 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all"
        >
          {loading ? t("entering") : t("enter")}
        </motion.button>

        <div className="mt-6 space-y-2 text-center text-sm">
          <p>
            <Link href="/forgot-password" className="text-orange-400 hover:text-orange-300 transition-colors">
              {t("forgotPassword")}
            </Link>
          </p>
          <p className="text-zinc-500">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-orange-400 hover:text-orange-300 transition-colors">
              {t("register")}
            </Link>
          </p>
        </div>
      </motion.form>
    </div>
  );
}