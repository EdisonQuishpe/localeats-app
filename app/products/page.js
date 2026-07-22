"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useTheme } from "../components/ThemeProvider";
import { ProtectedRoute, useAuth } from "../components/AuthProvider";
import { api } from "../lib/api";

function ProductsContent() {
  const { t } = useTheme();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null });
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.get("/products");
      setProducts(data);
    } catch {
      setProducts([]);
    }
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
    if (!user?.id) return;

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
    };

    try {
      if (editingProduct) {
        // Gateway: PATCH /products/:id
        await api.patch(`/products/${editingProduct}`, payload);
      } else {
        // Gateway: POST /products (ownerId = dueno del producto)
        await api.post("/products", { ...payload, ownerId: user.id });
      }
      setForm({ name: "", description: "", price: "" });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert(err.message || t("fillAll"));
    }
  };

  const handleDelete = async (id) => {
    if (!user?.id) return;
    try {
      await api.delete(`/products/${id}`);
      setDeleteDialog({ open: false, product: null });
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price });
    setEditingProduct(p.id);
  };

  const handleCancel = () => {
    setForm({ name: "", description: "", price: "" });
    setEditingProduct(null);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { productId: product.id, quantity: 1, product }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const cartTotal = cart.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);

  const placeOrder = async () => {
    if (!user?.id || cart.length === 0) return;
    try {
      // Gateway: POST /orders -> { userId, items: [{ productId, quantity }] }
      await api.post("/orders", {
        userId: user.id,
        items: cart.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      setCart([]);
      setShowCart(false);
      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const getAIImageUrl = (product) => {
    return `/api/generate-image?prompt=${encodeURIComponent(product.name)}&seed=${product.id}`;
  };

  const openProductDetail = (product) => {
    setImageLoaded(false);
    setSelectedProduct(product);
  };

  useEffect(() => {
    if (selectedProduct && !imageLoaded) {
      const timer = setTimeout(() => setImageLoaded(true), 8000);
      return () => clearTimeout(timer);
    }
  }, [selectedProduct, imageLoaded]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[10%] right-[10%] w-80 h-80 rounded-full blur-[120px]"
          style={{ background: "var(--brand-glow)" }}
          animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Order success toast */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg"
            style={{ background: "var(--success)", color: "white" }}
          >
            <span className="font-bold">✅ {t("orderPlaced")}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>
              📦 {t("products")}
            </h1>
            <p style={{ color: "var(--text-muted)" }} className="mt-1">{t("exploreMenu")}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Cart button */}
            {cart.length > 0 && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCart(!showCart)}
                className="relative px-4 py-2 rounded-xl font-bold text-sm"
                style={{
                  background: "var(--brand-subtle)",
                  color: "var(--brand)",
                  border: "1px solid var(--brand-glow)",
                }}
              >
                🛒 {t("cart")} ({cart.reduce((s, i) => s + i.quantity, 0)})
              </motion.button>
            )}
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors"
              style={{ color: "var(--brand)" }}
            >
              ← {t("back")}
            </Link>
          </div>
        </motion.div>

        {/* Cart panel */}
        <AnimatePresence>
          {showCart && cart.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="glass-card p-5">
                <h3 className="font-bold text-lg mb-3" style={{ color: "var(--text-primary)" }}>
                  🛒 {t("cart")}
                </h3>
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--border)" }}>
                    <span style={{ color: "var(--text-primary)" }}>
                      {item.product.name} × {item.quantity}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold" style={{ color: "var(--brand)" }}>
                        ${(Number(item.product.price) * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-xs px-2 py-1 rounded-lg"
                        style={{ background: "rgba(239,68,68,0.1)", color: "var(--error)" }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                  <span className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                    {t("total")}: ${cartTotal.toFixed(2)}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={placeOrder}
                    className="btn-primary"
                  >
                    {t("checkout")}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="glass-card p-6 mb-8"
        >
          <h2 className="font-bold text-lg mb-4" style={{ color: "var(--text-primary)" }}>
            {editingProduct ? `✏️ ${t("editProduct")}` : `➕ ${t("newProduct")}`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="name"
              placeholder={t("productName")}
              value={form.name}
              onChange={handleChange}
              className="input-field"
            />
            <input
              name="description"
              placeholder={t("description")}
              value={form.description}
              onChange={handleChange}
              className="input-field"
            />
            <input
              name="price"
              placeholder={t("price")}
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn-primary"
            >
              {editingProduct ? t("update") : t("create")}
            </motion.button>
            {editingProduct && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
              >
                {t("cancel")}
              </motion.button>
            )}
          </div>
        </motion.form>

        {/* Products list */}
        {loading ? (
          <div className="flex flex-col items-center py-12">
            <div
              className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "var(--brand)", borderTopColor: "transparent" }}
            />
            <p className="mt-3" style={{ color: "var(--text-muted)" }}>{t("loadingProducts")}</p>
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-12"
          >
            <div className="w-56 h-56">
              <DotLottieReact
                src="/animations/shopping cart.lottie"
                autoplay
                loop
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <p className="mt-4 text-lg font-semibold" style={{ color: "var(--text-secondary)" }}>
              {t("noProducts")}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {products.map((p) => {
                const isOwner = p.ownerId === user?.id;
                const inCart = cart.find((i) => i.productId === p.id);
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -2 }}
                    className="group glass-card p-5 cursor-pointer"
                    onClick={() => openProductDetail(p)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                            {p.name}
                          </h3>
                          {isOwner && (
                            <span className="badge badge-success text-[10px]">
                              {t("createdBy")} {user?.name}
                            </span>
                          )}
                        </div>
                        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                          {p.description}
                        </p>
                        <p className="mt-2 text-xl font-black gradient-text">
                          ${Number(p.price).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {isOwner && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => { e.stopPropagation(); handleEdit(p); }}
                              className="p-2 rounded-lg transition-colors"
                              style={{ background: "rgba(234,179,8,0.1)", color: "var(--warning)" }}
                            >
                              ✏️
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => { e.stopPropagation(); setDeleteDialog({ open: true, product: p }); }}
                              className="p-2 rounded-lg transition-colors"
                              style={{ background: "rgba(239,68,68,0.1)", color: "var(--error)" }}
                            >
                              🗑️
                            </motion.button>
                          </div>
                        )}
                        {!isOwner && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.stopPropagation(); inCart ? removeFromCart(p.id) : addToCart(p); }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                            style={
                              inCart
                                ? { background: "rgba(239,68,68,0.1)", color: "var(--error)", border: "1px solid rgba(239,68,68,0.2)" }
                                : { background: "var(--brand-subtle)", color: "var(--brand)", border: "1px solid var(--brand-glow)" }
                            }
                          >
                            {inCart ? t("removeFromCart") : t("addToCart")}
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Product Detail Modal with AI Image */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.6)" }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              {/* AI Image area */}
              <div className="relative w-full h-64 overflow-hidden" style={{ background: "var(--surface-secondary)" }}>
                {!imageLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-32 h-32">
                      <DotLottieReact
                        src="/animations/shopping cart.lottie"
                        autoplay
                        loop
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                    <p className="text-xs mt-2 animate-pulse" style={{ color: "var(--text-muted)" }}>
                      {t("loading")}
                    </p>
                  </div>
                )}
                <img
                  src={getAIImageUrl(selectedProduct)}
                  alt={selectedProduct.name}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                  className="w-full h-full object-cover transition-opacity duration-500"
                  style={{ opacity: imageLoaded ? 1 : 0 }}
                />
              </div>

              {/* Product info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-black" style={{ color: "var(--text-primary)" }}>
                    {selectedProduct.name}
                  </h2>
                  <span className="text-xl font-black gradient-text">
                    ${Number(selectedProduct.price).toFixed(2)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {selectedProduct.description}
                </p>

                <div className="flex gap-3 mt-5">
                  {selectedProduct.ownerId !== user?.id && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="flex-1 btn-primary"
                    >
                      🛒 {t("addToCart")}
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedProduct(null)}
                    className="flex-1 btn-secondary"
                  >
                    {t("close")}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteDialog.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteDialog({ open: false, product: null })}
              className="absolute inset-0 backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.5)" }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm p-6 rounded-2xl shadow-2xl"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(239,68,68,0.1)" }}>
                  <span className="text-3xl">🗑️</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-center" style={{ color: "var(--text-primary)" }}>
                {t("confirmDelete")}
              </h3>
              <p className="text-sm text-center mt-2" style={{ color: "var(--text-muted)" }}>
                {t("confirmDeleteDesc")} <span className="font-semibold" style={{ color: "var(--brand)" }}>{deleteDialog.product?.name}</span>
              </p>
              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeleteDialog({ open: false, product: null })}
                  className="flex-1 btn-secondary"
                >
                  {t("cancel")}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDelete(deleteDialog.product?.id)}
                  className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-colors"
                  style={{ background: "var(--error)" }}
                >
                  {t("delete")}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Products() {
  return (
    <ProtectedRoute>
      <ProductsContent />
    </ProtectedRoute>
  );
}
