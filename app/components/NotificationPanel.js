"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthProvider";
import { useTheme } from "./ThemeProvider";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";

let socket;

export default function NotificationPanel() {
  const { user } = useAuth();
  const { t } = useTheme();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const panelRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fetch existing notifications
  useEffect(() => {
    if (!user?.id) return;
    api.get(`/notifications?userId=${user.id}`)
      .then((data) => {
        if (Array.isArray(data)) {
          setNotifications(data);
          if (data.some((n) => !n.read)) setHasNew(true);
        }
      })
      .catch(() => {});
  }, [user]);

  // Socket connection for push notifications
  useEffect(() => {
    if (!user?.id) return;

    socket = io();
    socket.on("connect", () => {
      socket.emit("register-user", user.id);
    });

    socket.on("new-notification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setHasNew(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Close panel on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markAllRead = async () => {
    if (!user?.id) return;
    try {
      await api.patch("/notifications", { userId: user.id });
    } catch {
      // no bloquear la UI si falla
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setHasNew(false);
  };

  const handleOpen = () => {
    setOpen(!open);
    if (!open && hasNew) {
      markAllRead();
    }
  };

  const handleNotifClick = (notif) => {
    if (notif.link) {
      router.push(notif.link);
      setOpen(false);
    }
  };

  const typeIcon = {
    message: "💬",
    order: "🛒",
    conversation: "📩",
  };

  if (!user) return null;

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-lg transition-colors"
        style={{ color: "var(--text-secondary)" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: "var(--error)" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-xl shadow-xl z-50"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--glass-border)",
            }}
          >
            {/* Header */}
            <div
              className="sticky top-0 flex items-center justify-between px-4 py-3 z-10"
              style={{
                background: "var(--glass-bg)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                🔔 {t("notifications") || "Notificaciones"}
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-medium"
                  style={{ color: "var(--brand)" }}
                >
                  {t("markAllRead") || "Marcar leídas"}
                </button>
              )}
            </div>

            {/* Notifications list */}
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {t("noNotifications") || "Sin notificaciones"}
                </p>
              </div>
            ) : (
              <div>
                {notifications.slice(0, 20).map((notif) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => handleNotifClick(notif)}
                    className="flex gap-3 px-4 py-3 cursor-pointer transition-colors"
                    style={{
                      borderBottom: "1px solid var(--border)",
                      background: notif.read ? "transparent" : "rgba(249,115,22,0.04)",
                    }}
                  >
                    <span className="text-lg flex-shrink-0">
                      {typeIcon[notif.type] || "🔔"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                        {notif.title}
                      </p>
                      <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--text-muted)" }}>
                        {notif.body}
                      </p>
                      <p className="text-[10px] mt-1 opacity-60" style={{ color: "var(--text-muted)" }}>
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notif.read && (
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                        style={{ background: "var(--brand)" }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
