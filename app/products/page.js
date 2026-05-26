"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../components/ThemeProvider";

export default function Products() {
  const { t } = useTheme();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "" });

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price) {
      alert(t("fillAll"));
      return;
    }
    const url = editingProduct ? `/api/products/${editingProduct}` : "/api/products";
    const method = editingProduct ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", description: "", price: "" });
    setEditingProduct(null);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!confirm(t("confirmDelete"))) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price });
    setEditingProduct(p.id);
  };

  const handleCancel = () => {
    setForm({ name: "", description: "", price: "" });
    setEditingProduct(null);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-[10%] right-[10%] w-80 h-80 rounded-full bg-amber-500/5 blur-[100px]"
          animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-black text-white">📦 {t("products")}</h1>
            <p className="text-zinc-500 mt-1">{t("exploreMenu")}</p>
          </div>
          <Link href="/dashboard" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
            ← {t("back")}
          </Link>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md mb-8"
        >
          <h2 className="font-bold text-white mb-4 text-lg">
            {editingProduct ? `✏️ ${t("editProduct")}` : `➕ ${t("newProduct")}`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="name"
              placeholder={t("productName")}
              value={form.name}
              onChange={handleChange}
              className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
            />
            <input
              name="description"
              placeholder={t("description")}
              value={form.description}
              onChange={handleChange}
              className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
            />
            <input
              name="price"
              placeholder={t("price")}
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-6 py-2.5 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all"
            >
              {editingProduct ? t("update") : t("create")}
            </motion.button>
            {editingProduct && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 border border-zinc-700 text-zinc-300 rounded-xl font-medium hover:bg-zinc-800 transition-all"
              >
                {t("cancel")}
              </motion.button>
            )}
          </div>
        </motion.form>

        {/* Products list */}
        {loading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="inline-block w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-zinc-500">{t("loadingProducts")}</p>
          </motion.div>
        ) : products.length === 0 ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-zinc-500 py-12">
            {t("noProducts")}
          </motion.p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {products.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -2 }}
                  className="group p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md hover:border-zinc-600 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">{p.name}</h3>
                      <p className="text-sm text-zinc-500 mt-1">{p.description}</p>
                      <p className="mt-2 text-xl font-black bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        ${p.price}
                      </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(p)}
                        className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"
                      >
                        ✏️
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(p.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        🗑️
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}