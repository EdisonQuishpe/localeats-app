"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "../components/ThemeProvider";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function Dashboard() {
  const { t } = useTheme();

  const cards = [
    { href: "/products", icon: "📦", title: t("products"), desc: t("exploreMenu"), gradient: "from-orange-500 to-amber-500" },
    { href: "/chat", icon: "💬", title: t("chat"), desc: t("liveChat"), gradient: "from-green-500 to-emerald-500" },
    { href: "/", icon: "🏠", title: t("home"), desc: "LocalEats", gradient: "from-blue-500 to-indigo-500" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-[5%] left-[10%] w-96 h-96 rounded-full bg-orange-500/5 blur-[120px]"
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[5%] w-80 h-80 rounded-full bg-green-500/5 blur-[100px]"
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white">
            {t("welcome")} <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="mt-3 text-lg text-zinc-400">{t("welcomeSub")}</p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-4 w-24 h-1 bg-linear-to-r from-orange-500 to-red-500 rounded-full origin-left"
          />
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {cards.map((card) => (
            <motion.div key={card.href} variants={item}>
              <Link href={card.href}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md overflow-hidden cursor-pointer hover:border-zinc-600 transition-colors"
                >
                  {/* Card glow */}
                  <div className={`absolute inset-0 bg-linear-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                  <span className="text-4xl block mb-4">{card.icon}</span>
                  <h2 className="text-xl font-bold text-white mb-2">{card.title}</h2>
                  <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">{card.desc}</p>

                  {/* Arrow indicator */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 grid grid-cols-3 gap-4"
        >
          {[
            { label: "Pedidos", value: "0", icon: "🛒" },
            { label: "Favoritos", value: "0", icon: "❤️" },
            { label: "Mensajes", value: "0", icon: "✉️" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30">
              <span className="text-2xl">{stat.icon}</span>
              <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}