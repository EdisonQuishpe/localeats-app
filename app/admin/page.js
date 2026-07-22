"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../components/ThemeProvider";
import { ProtectedRoute, useAuth } from "../components/AuthProvider";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";

function AdminContent() {
  const { t } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.get("/users");
      if (Array.isArray(data)) setUsers(data);
    } catch {
      setUsers([]);
    }
    setLoading(false);
  };

  const updateRole = async (userId, newRole) => {
    try {
      await api.patch(`/users/${userId}`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleActive = async (userId, currentStatus) => {
    try {
      await api.patch(`/users/${userId}`, { isActive: !currentStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: !currentStatus } : u))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const roleColors = {
    admin: { bg: "rgba(239,68,68,0.1)", color: "var(--error)", border: "rgba(239,68,68,0.2)" },
    support: { bg: "rgba(59,130,246,0.1)", color: "var(--info)", border: "rgba(59,130,246,0.2)" },
    user: { bg: "rgba(34,197,94,0.1)", color: "var(--success)", border: "rgba(34,197,94,0.2)" },
  };

  if (user?.role !== "admin") return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[10%] right-[15%] w-96 h-96 rounded-full blur-[140px]"
          style={{ background: "var(--brand-glow)" }}
          animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>
            🛡️ {t("adminPanel")}
          </h1>
          <p className="mt-1" style={{ color: "var(--text-muted)" }}>
            {t("manageUsers")}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: t("totalUsers"), value: users.length, icon: "👥" },
            { label: t("adminRole"), value: users.filter((u) => u.role === "admin").length, icon: "🛡️" },
            { label: t("supportRole"), value: users.filter((u) => u.role === "support").length, icon: "🎧" },
            { label: t("active"), value: users.filter((u) => u.isActive).length, icon: "✅" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-2xl font-bold mt-1" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <input
            type="text"
            placeholder={t("search") + "..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field max-w-sm"
          />
        </motion.div>

        {/* Users table */}
        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>{t("loading")}</p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>
                      {t("name")}
                    </th>
                    <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>
                      {t("email")}
                    </th>
                    <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>
                      {t("role")}
                    </th>
                    <th className="text-center px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>
                      {t("active")}
                    </th>
                    <th className="text-center px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>
                      {t("orders")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => {
                    const rc = roleColors[u.role] || roleColors.user;
                    return (
                      <motion.tr
                        key={u.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        style={{ borderBottom: "1px solid var(--border)" }}
                        className="hover:opacity-80 transition-opacity"
                      >
                        <td className="px-4 py-3">
                          <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                            {u.name}
                          </span>
                        </td>
                        <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                          {u.email}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={u.role}
                            onChange={(e) => updateRole(u.id, e.target.value)}
                            disabled={u.id === user?.id}
                            className="px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer outline-none"
                            style={{
                              background: rc.bg,
                              color: rc.color,
                              border: `1px solid ${rc.border}`,
                              opacity: u.id === user?.id ? 0.5 : 1,
                            }}
                          >
                            <option value="user">{t("userRole")}</option>
                            <option value="support">{t("supportRole")}</option>
                            <option value="admin">{t("adminRole")}</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => toggleActive(u.id, u.isActive)}
                            disabled={u.id === user?.id}
                            className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                            style={{
                              background: u.isActive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                              color: u.isActive ? "var(--success)" : "var(--error)",
                              border: `1px solid ${u.isActive ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                              opacity: u.id === user?.id ? 0.5 : 1,
                            }}
                          >
                            {u.isActive ? t("active") : t("inactive")}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center" style={{ color: "var(--text-muted)" }}>
                          {u._count?.orders || 0}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <p className="p-6 text-center" style={{ color: "var(--text-muted)" }}>
                {t("noResults")}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  );
}
