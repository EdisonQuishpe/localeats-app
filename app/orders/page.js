"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../components/ThemeProvider";
import { ProtectedRoute, useAuth } from "../components/AuthProvider";
import { api } from "../lib/api";

const statusConfig = {
  pending: { color: "var(--warning)", label: "pending", icon: "⏳" },
  preparing: { color: "var(--info)", label: "preparing", icon: "👨‍🍳" },
  dispatched: { color: "var(--brand)", label: "dispatched", icon: "🚗" },
  delivered: { color: "var(--success)", label: "delivered", icon: "✅" },
  canceled: { color: "var(--error)", label: "canceled", icon: "❌" },
};

function OrdersContent() {
  const { t } = useTheme();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/orders?userId=${user.id}`);
      if (Array.isArray(data)) setOrders(data);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[10%] right-[15%] w-80 h-80 rounded-full blur-[120px]"
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
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>
              🛒 {t("orders")}
            </h1>
            <p style={{ color: "var(--text-muted)" }} className="mt-1">
              {t("orderHistory")}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-medium transition-colors"
            style={{ color: "var(--brand)" }}
          >
            ← {t("back")}
          </Link>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center py-16">
            <div
              className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "var(--brand)", borderTopColor: "transparent" }}
            />
            <p className="mt-3" style={{ color: "var(--text-muted)" }}>{t("loadingOrders")}</p>
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <span className="text-6xl block mb-4">📋</span>
            <p className="text-lg font-medium" style={{ color: "var(--text-secondary)" }}>
              {t("noOrders")}
            </p>
            <Link href="/products" className="btn-primary inline-block mt-4">
              {t("exploreMenu")}
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4"
          >
            {orders.map((order, idx) => {
              const config = statusConfig[order.status] || statusConfig.pending;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-card p-5 cursor-pointer"
                  onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config.icon}</span>
                      <div>
                        <p className="font-bold" style={{ color: "var(--text-primary)" }}>
                          {t("orders")} #{order.id}
                        </p>
                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                          {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} {t("items")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                        ${Number(order.totalAmount).toFixed(2)}
                      </p>
                      <span
                        className="badge"
                        style={{
                          color: config.color,
                          background: `${config.color}15`,
                          border: `1px solid ${config.color}30`,
                        }}
                      >
                        {t(config.label)}
                      </span>
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {selectedOrder?.id === order.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="mt-4 pt-4"
                          style={{ borderTop: "1px solid var(--border)" }}
                        >
                          <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
                            {t("orderDetails")}:
                          </p>
                          {order.items?.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center py-2"
                            >
                              <span style={{ color: "var(--text-primary)" }}>
                                {item.product?.name || "Producto"} × {item.quantity}
                              </span>
                              <span style={{ color: "var(--text-secondary)" }}>
                                ${(Number(item.priceAtPurchase) * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}
