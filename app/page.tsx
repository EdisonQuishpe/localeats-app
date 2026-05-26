"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "./components/ThemeProvider";

const floatingFoods = ["🍔", "🍕", "🌮", "🍣", "🥗", "🍜", "🧁", "🍩"];

export default function Home() {
  const { t, theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`relative min-h-screen overflow-hidden ${isDark ? "bg-[#0a0a0a]" : "bg-[#f8f9fa]"}`}>
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 ${isDark ? "bg-[radial-gradient(ellipse_at_top,#1a1a2e_0%,#0a0a0a_50%)]" : "bg-[radial-gradient(ellipse_at_top,#fff7ed_0%,#f8f9fa_50%)]"}`} />
        <motion.div
          className={`absolute top-[-20%] left-[-10%] w-150 h-150 rounded-full ${isDark ? "bg-orange-500/10" : "bg-orange-500/20"} blur-[120px]`}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute bottom-[-20%] right-[-10%] w-125 h-125 rounded-full ${isDark ? "bg-red-500/10" : "bg-red-500/15"} blur-[120px]`}
          animate={{
            x: [0, -40, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute top-[40%] right-[20%] w-75 h-75 rounded-full ${isDark ? "bg-yellow-500/8" : "bg-yellow-500/15"} blur-[100px]`}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating food emojis */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingFoods.map((food, i) => (
          <motion.span
            key={i}
            className={`absolute text-3xl ${isDark ? "opacity-20" : "opacity-30"}`}
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
              opacity: isDark ? [0.15, 0.3, 0.15] : [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            {food}
          </motion.span>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <span className="text-7xl">🍔</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl font-black text-center bg-linear-to-r from-orange-400 via-red-400 to-yellow-400 bg-clip-text text-transparent"
        >
          LocalEats
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`mt-4 text-lg md:text-xl text-center max-w-lg ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
        >
          Tu comida favorita, cerca de ti. Descubre restaurantes locales y pide
          en minutos.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 mt-10"
        >
          <Link href="/login">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(249,115,22,0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/25 transition-all cursor-pointer text-center"
            >
              {t("login")}
            </motion.div>
          </Link>
          <Link href="/register">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 border rounded-xl font-bold text-lg backdrop-blur-sm transition-all cursor-pointer text-center ${isDark ? "border-zinc-700 text-white hover:bg-white/10" : "border-zinc-300 text-zinc-800 hover:bg-zinc-100"}`}
            >
              {t("register")}
            </motion.div>
          </Link>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl"
        >
          {[
            { href: "/products", icon: "📦", title: t("products"), desc: t("exploreMenu") },
            { href: "/chat", icon: "💬", title: t("chat"), desc: t("liveChat") },
            { href: "/dashboard", icon: "📊", title: t("dashboard"), desc: t("controlPanel") },
          ].map((card) => (
            <Link key={card.href} href={card.href}>
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`group relative p-6 rounded-2xl border backdrop-blur-md transition-colors cursor-pointer ${isDark ? "border-zinc-800 bg-zinc-900/50 hover:border-orange-500/50" : "border-zinc-200 bg-white/70 hover:border-orange-400/50 shadow-sm"}`}
              >
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-3xl">{card.icon}</span>
                <h3 className={`mt-3 font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>{card.title}</h3>
                <p className={`mt-1 text-sm transition-colors ${isDark ? "text-zinc-500 group-hover:text-zinc-400" : "text-zinc-500 group-hover:text-zinc-700"}`}>
                  {card.desc}
                </p>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Bottom glow line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 w-48 h-0.5 bg-linear-to-r from-transparent via-orange-500 to-transparent"
        />
      </div>
    </div>
  );
}
