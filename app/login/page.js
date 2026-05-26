"use client";
export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4">Iniciar sesión</h1>
        <input placeholder="Email" className="w-full mb-2 p-2 border rounded" />
        <input placeholder="Contraseña" className="w-full mb-4 p-2 border rounded" />
        <button className="w-full bg-green-500 text-white p-2 rounded">Ingresar</button>
      </form>
    </div>
  );
}