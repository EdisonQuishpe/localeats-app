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

// Datos simulados de ventas semanales
const salesData = [
  { day: "Lun", ventas: 12, pedidos: 8 },
  { day: "Mar", ventas: 19, pedidos: 14 },
  { day: "Mié", ventas: 15, pedidos: 11 },
  { day: "Jue", ventas: 25, pedidos: 18 },
  { day: "Vie", ventas: 32, pedidos: 24 },
  { day: "Sáb", ventas: 42, pedidos: 35 },
  { day: "Dom", ventas: 38, pedidos: 28 },
];

// Datos simulados de categorías
const categoryData = [
  { name: "Comida rápida", value: 35, color: "#f97316" },
  { name: "Bebidas", value: 25, color: "#06b6d4" },
  { name: "Postres", value: 20, color: "#ec4899" },
  { name: "Saludable", value: 20, color: "#22c55e" },
];

// Actividad reciente simulada
const recentActivity = [
  { id: 1, type: "order", message: "Nuevo pedido #1042 recibido", time: "Hace 5 min", icon: "🛒" },
  { id: 2, type: "message", message: "Mensaje de Juan: '¿Aún tienen pizza?'", time: "Hace 12 min", icon: "💬" },
  { id: 3, type: "product", message: "Producto 'Hamburguesa Clásica' actualizado", time: "Hace 30 min", icon: "📦" },
  { id: 4, type: "order", message: "Pedido #1041 completado", time: "Hace 1 hora", icon: "✅" },
  { id: 5, type: "user", message: "Nuevo usuario registrado: María López", time: "Hace 2 horas", icon: "👤" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

function DashboardContent() {
  const { t, isDark } = useTheme();
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const stats = [
    { label: "Productos", value: products.length, icon: "📦", change: "+3", gradient: "from-orange-500 to-amber-500" },
    { label: "Pedidos hoy", value: 24, icon: "🛒", change: "+12%", gradient: "from-green-500 to-emerald-500" },
    { label: "Ingresos", value: "$1,248", icon: "💰", change: "+8%", gradient: "from-blue-500 to-cyan-500" },
    { label: "Clientes activos", value: 156, icon: "👥", change: "+5%", gradient: "from-purple-500 to-pink-500" },
  ];

  const quickActions = [
    { href: "/products", icon: "📦", title: t("products"), desc: "Gestionar menú", gradient: "from-orange-500 to-amber-500" },
    { href: "/chat", icon: "💬", title: t("chat"), desc: "Soporte en vivo", gradient: "from-green-500 to-emerald-500" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[5%] left-[10%] w-96 h-96 rounded-full bg-orange-500/5 dark:bg-orange-500/5 blur-[120px]"
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[5%] w-80 h-80 rounded-full bg-blue-500/5 dark:bg-blue-500/5 blur-[100px]"
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
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white">
              {greeting()}, <span className="bg-linear-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">{user?.name || "Usuario"}</span> 👋
            </h1>
            <p className="mt-1 text-zinc-500 dark:text-zinc-400">
              {currentTime.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="mt-4 sm:mt-0 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-500 font-semibold text-sm hover:bg-red-500/20 transition-colors border border-red-500/20"
          >
            Cerrar sesión
          </motion.button>
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
              className="relative p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-20 h-20 bg-linear-to-br ${stat.gradient} opacity-10 rounded-bl-full`} />
              <span className="text-2xl">{stat.icon}</span>
              <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-zinc-500">{stat.label}</p>
              <span className="inline-block mt-1 text-xs font-semibold text-green-500">{stat.change}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Area Chart - Ventas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Ventas de la semana</h3>
                <p className="text-sm text-zinc-500">Últimos 7 días</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-orange-500"></span> Ventas
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span> Pedidos
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPedidos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#27272a" : "#e4e4e7"} />
                <XAxis dataKey="day" stroke={isDark ? "#71717a" : "#a1a1aa"} fontSize={12} />
                <YAxis stroke={isDark ? "#71717a" : "#a1a1aa"} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: isDark ? "#18181b" : "#fff",
                    border: `1px solid ${isDark ? "#27272a" : "#e4e4e7"}`,
                    borderRadius: "12px",
                    color: isDark ? "#fff" : "#18181b",
                  }}
                />
                <Area type="monotone" dataKey="ventas" stroke="#f97316" fillOpacity={1} fill="url(#colorVentas)" strokeWidth={2} />
                <Area type="monotone" dataKey="pedidos" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPedidos)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart - Categorías */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md"
          >
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Categorías</h3>
            <p className="text-sm text-zinc-500 mb-4">Distribución de ventas</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: isDark ? "#18181b" : "#fff",
                    border: `1px solid ${isDark ? "#27272a" : "#e4e4e7"}`,
                    borderRadius: "12px",
                    color: isDark ? "#fff" : "#18181b",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  <span className="text-zinc-600 dark:text-zinc-400 truncate">{cat.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row: Activity + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="lg:col-span-2 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md"
          >
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Actividad reciente</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, idx) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <span className="text-xl flex-shrink-0">{activity.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-800 dark:text-zinc-200 truncate">{activity.message}</p>
                    <p className="text-xs text-zinc-400">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Acciones rápidas</h3>
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md overflow-hidden cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors mb-4"
                >
                  <div className={`absolute inset-0 bg-linear-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{action.icon}</span>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white">{action.title}</h4>
                      <p className="text-xs text-zinc-500">{action.desc}</p>
                    </div>
                  </div>
                  <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </motion.div>
              </Link>
            ))}

            {/* Bar Chart - Pedidos por hora */}
            <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md">
              <h4 className="font-bold text-zinc-900 dark:text-white text-sm mb-3">Pedidos por hora</h4>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={[
                  { h: "10", v: 3 }, { h: "11", v: 5 }, { h: "12", v: 12 },
                  { h: "13", v: 15 }, { h: "14", v: 8 }, { h: "15", v: 6 },
                  { h: "16", v: 4 }, { h: "17", v: 7 }, { h: "18", v: 11 },
                  { h: "19", v: 14 }, { h: "20", v: 9 }, { h: "21", v: 5 },
                ]}>
                  <XAxis dataKey="h" stroke={isDark ? "#71717a" : "#a1a1aa"} fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      background: isDark ? "#18181b" : "#fff",
                      border: `1px solid ${isDark ? "#27272a" : "#e4e4e7"}`,
                      borderRadius: "8px",
                      color: isDark ? "#fff" : "#18181b",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="v" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
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