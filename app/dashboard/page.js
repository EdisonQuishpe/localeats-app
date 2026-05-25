import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Bienvenido a LocalEats
      </h1>

      <div className="flex gap-4">
        <Link
          href="/products"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Productos
        </Link>

        <Link
          href="/chat"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Chat
        </Link>
      </div>
    </div>
  );
}