"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "./AuthProvider";
import NotificationPanel from "./NotificationPanel";

export default function Navbar() {
  const { theme, toggleTheme, locale, toggleLocale, t } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navLinks = isAuthenticated
    ? [
        { href: "/dashboard", label: t("dashboard"), icon: "📊" },
        { href: "/products", label: t("products"), icon: "📦" },
        { href: "/orders", label: t("orders"), icon: "🛒" },
        { href: "/support", label: t("support"), icon: "💬" },
        ...(user?.role === "admin" ? [{ href: "/admin", label: t("adminPanel"), icon: "🛡️" }] : []),
      ]
    : [];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 backdrop-blur-xl border-b"
      style={{
        background: "var(--glass-bg)",
        borderColor: "var(--glass-border)",
      }}
    >
      {/* Logo */}
      <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
        <span className="text-2xl">🍔</span>
        <span className="font-bold text-lg gradient-text">LocalEats</span>
      </Link>

      {/* Nav links (desktop) */}
      {isAuthenticated && (
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  pathname === link.href
                    ? "text-brand bg-brand-subtle"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                }`}
                style={
                  pathname === link.href
                    ? { color: "var(--brand)", background: "var(--brand-subtle)" }
                    : {}
                }
              >
                {link.icon} {link.label}
              </motion.span>
            </Link>
          ))}
        </div>
      )}

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        {isAuthenticated && <NotificationPanel />}

        {/* Auth buttons */}
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <span
              className="hidden sm:inline px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{
                color: "var(--brand)",
                border: "1px solid var(--brand-glow)",
                background: "var(--brand-subtle)",
              }}
            >
              {user?.name}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
              style={{
                color: "var(--error)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                background: "rgba(239, 68, 68, 0.08)",
              }}
            >
              {t("logout")}
            </motion.button>
          </div>
        ) : (
          <Link href="/login">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
              style={{
                color: "var(--brand)",
                border: "1px solid var(--brand-glow)",
                background: "var(--brand-subtle)",
              }}
            >
              {t("login")}
            </motion.span>
          </Link>
        )}

        {/* Language toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleLocale}
          className="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
          style={{
            color: "var(--text-secondary)",
            border: "1px solid var(--border)",
            background: "var(--surface-secondary)",
          }}
          title="Toggle language"
        >
          {locale === "es" ? "🇺🇸 EN" : "🇪🇸 ES"}
        </motion.button>

        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-colors"
          style={{
            border: "1px solid var(--border)",
            background: "var(--surface-secondary)",
          }}
          title="Toggle theme"
        >
          {theme === "dark" ? (
            <svg className="w-4 h-4" style={{ color: "var(--warning)" }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4" style={{ color: "var(--text-muted)" }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </motion.button>
      </div>
    </motion.nav>
  );
}
