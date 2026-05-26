"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
  locale: "es",
  toggleLocale: () => {},
  t: (key) => key,
});

const translations = {
  es: {
    login: "Iniciar Sesión",
    register: "Registrarse",
    logout: "Cerrar Sesión",
    email: "Correo electrónico",
    password: "Contraseña",
    newPassword: "Nueva contraseña",
    name: "Nombre",
    forgotPassword: "¿Olvidaste tu contraseña?",
    noAccount: "¿No tienes cuenta?",
    hasAccount: "¿Ya tienes cuenta?",
    backToLogin: "Volver al login",
    resetPassword: "Recuperar contraseña",
    changePassword: "Cambiar contraseña",
    entering: "Ingresando...",
    enter: "Ingresar",
    registering: "Registrando...",
    registerBtn: "Registrar",
    fillAll: "Completa todos los campos",
    wrongCredentials: "Credenciales incorrectas",
    registerError: "Error al registrar",
    passwordError: "Error al cambiar contraseña",
    welcome: "Bienvenido a LocalEats",
    welcomeSub: "Tu centro de control para pedidos y comunicación",
    products: "Productos",
    chat: "Chat en Vivo",
    dashboard: "Dashboard",
    exploreMenu: "Explora el menú completo",
    liveChat: "Habla en tiempo real",
    controlPanel: "Controla tu cuenta",
    newProduct: "Nuevo producto",
    editProduct: "Editar producto",
    productName: "Nombre del producto",
    description: "Descripción",
    price: "Precio",
    create: "Crear",
    update: "Actualizar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    confirmDelete: "¿Eliminar este producto?",
    loadingProducts: "Cargando productos...",
    noProducts: "No hay productos aún.",
    back: "Volver",
    chatTitle: "Chat LocalEats",
    yourName: "Tu nombre",
    connected: "Conectado",
    disconnected: "Desconectado",
    noMessages: "No hay mensajes todavía...",
    typeMessage: "Escribe un mensaje...",
    send: "Enviar",
    home: "Inicio",
  },
  en: {
    login: "Sign In",
    register: "Sign Up",
    logout: "Sign Out",
    email: "Email",
    password: "Password",
    newPassword: "New password",
    name: "Name",
    forgotPassword: "Forgot your password?",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    backToLogin: "Back to login",
    resetPassword: "Reset password",
    changePassword: "Change password",
    entering: "Signing in...",
    enter: "Sign In",
    registering: "Signing up...",
    registerBtn: "Sign Up",
    fillAll: "Fill in all fields",
    wrongCredentials: "Invalid credentials",
    registerError: "Registration error",
    passwordError: "Error changing password",
    welcome: "Welcome to LocalEats",
    welcomeSub: "Your control center for orders and communication",
    products: "Products",
    chat: "Live Chat",
    dashboard: "Dashboard",
    exploreMenu: "Explore the full menu",
    liveChat: "Talk in real time",
    controlPanel: "Manage your account",
    newProduct: "New product",
    editProduct: "Edit product",
    productName: "Product name",
    description: "Description",
    price: "Price",
    create: "Create",
    update: "Update",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    confirmDelete: "Delete this product?",
    loadingProducts: "Loading products...",
    noProducts: "No products yet.",
    back: "Back",
    chatTitle: "LocalEats Chat",
    yourName: "Your name",
    connected: "Connected",
    disconnected: "Disconnected",
    noMessages: "No messages yet...",
    typeMessage: "Type a message...",
    send: "Send",
    home: "Home",
  },
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const [locale, setLocale] = useState("es");

  useEffect(() => {
    const saved = localStorage.getItem("localeats-theme");
    if (saved) setTheme(saved);
    const savedLocale = localStorage.getItem("localeats-locale");
    if (savedLocale) setLocale(savedLocale);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("localeats-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("localeats-locale", locale);
  }, [locale]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const toggleLocale = () => setLocale((l) => (l === "es" ? "en" : "es"));
  const t = (key) => translations[locale]?.[key] || key;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, locale, toggleLocale, t }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
