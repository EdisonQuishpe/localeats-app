"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "../components/ThemeProvider";
import { useAuth, ProtectedRoute } from "../components/AuthProvider";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const CHART_COLORS = ["#f97316", "#06b6d4", "#ec4899", "#22c55e", "#8b5cf6"];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

function DashboardContent() {
  const { t, theme, locale } = useTheme();
  const isDark = theme === "dark";
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setProducts(data); })
      .catch(() => {});
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setActiveUsers(data.filter((u) => u.isActive).length); })
      .catch(() => {});
    if (user?.id) {
      fetch(`/api/orders?userId=${user.id}`)
        .then((r) => r.json())
        .then((data) => { if (Array.isArray(data)) setOrders(data); })
        .catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return t("goodMorning");
    if (hour < 18) return t("goodAfternoon");
    return t("goodEvening");
  };

  const stats = [
    { label: t("totalProducts"), value: products.length, icon: "📦" },
    { label: t("ordersToday"), value: orders.length, icon: "🛒" },
    { label: t("revenue"), value: `$${orders.reduce((s, o) => s + Number(o.totalAmount), 0).toFixed(0)}`, icon: "💰" },
    { label: t("activeClients"), value: activeUsers, icon: "👥" },
  ];

  // Build chart data from real orders (grouped by day of week)
  const dayNames = locale === "es"
    ? ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const salesData = (() => {
    const grouped = {};
    dayNames.forEach((d) => { grouped[d] = { day: d, ventas: 0, pedidos: 0 }; });
    orders.forEach((o) => {
      const dayIdx = new Date(o.createdAt).getDay();
      const dayName = dayNames[dayIdx];
      if (grouped[dayName]) {
        grouped[dayName].pedidos += 1;
        grouped[dayName].ventas += Number(o.totalAmount);
      }
    });
    return dayNames.map((d) => grouped[d]);
  })();

  // Build pie chart from product count (top products by orders)
  const categoryData = (() => {
    if (orders.length === 0 && products.length === 0) return [];
    const productCounts = {};
    orders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const name = item.product?.name || `Product #${item.productId}`;
        productCounts[name] = (productCounts[name] || 0) + item.quantity;
      });
    });
    const entries = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    if (entries.length === 0) {
      return products.slice(0, 5).map((p, i) => ({
        name: p.name, value: 1, color: CHART_COLORS[i % CHART_COLORS.length],
      }));
    }
    return entries.map(([name, value], i) => ({
      name, value, color: CHART_COLORS[i % CHART_COLORS.length],
    }));
  })();

  const quickActions = [
    { href: "/products", icon: "📦", title: t("products"), desc: t("manageMenu") },
    { href: "/orders", icon: "🛒", title: t("myOrders"), desc: t("trackOrders") },
    { href: "/support", icon: "💬", title: t("support"), desc: t("liveSupportDesc") },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[5%] left-[10%] w-96 h-96 rounded-full blur-[120px]"
          style={{ background: "var(--brand-glow)" }}
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[5%] w-80 h-80 rounded-full blur-[100px]"
          style={{ background: "rgba(59,130,246,0.05)" }}
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-black" style={{ color: "var(--text-primary)" }}>
            {greeting()}, <span className="gradient-text">{user?.name || "Usuario"}</span> 👋
          </h1>
          <p className="mt-1" style={{ color: "var(--text-muted)" }}>
            {currentTime.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={item}
              whileHover={{ scale: 1.02, y: -4 }}
              className="glass-card relative p-5 overflow-hidden"
            >
              <span className="text-2xl">{stat.icon}</span>
              <p className="mt-2 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Area Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  {t("ordersToday")}
                </h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {t("recentActivity")}
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--brand)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPedidos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--info)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--info)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    color: "var(--text-primary)",
                  }}
                />
                <Area type="monotone" dataKey="ventas" stroke="var(--brand)" fillOpacity={1} fill="url(#colorVentas)" strokeWidth={2} />
                <Area type="monotone" dataKey="pedidos" stroke="var(--info)" fillOpacity={1} fill="url(#colorPedidos)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>
              {t("products")}
            </h3>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              {t("filter")}
            </p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" stroke="none">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    color: "var(--text-primary)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span style={{ color: "var(--text-secondary)" }} className="truncate">{cat.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            {t("quickActions")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-card group relative p-5 overflow-hidden cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{action.icon}</span>
                    <div>
                      <h4 className="font-bold" style={{ color: "var(--text-primary)" }}>{action.title}</h4>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{action.desc}</p>
                    </div>
                  </div>
                  <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <svg className="w-5 h-5" style={{ color: "var(--text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Orders per hour bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass-card p-5 mt-8"
        >
          <h4 className="font-bold text-sm mb-3" style={{ color: "var(--text-primary)" }}>
            {t("ordersToday")}
          </h4>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={[
              { h: "10", v: 3 }, { h: "11", v: 5 }, { h: "12", v: 12 },
              { h: "13", v: 15 }, { h: "14", v: 8 }, { h: "15", v: 6 },
              { h: "16", v: 4 }, { h: "17", v: 7 }, { h: "18", v: 11 },
              { h: "19", v: 14 }, { h: "20", v: 9 }, { h: "21", v: 5 },
            ]}>
              <XAxis dataKey="h" stroke="var(--text-muted)" fontSize={10} />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--text-primary)",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="v" fill="var(--brand)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
