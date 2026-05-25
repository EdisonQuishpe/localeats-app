import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔍 Obtener productos
export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return Response.json(products);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}

// ➕ Crear producto
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, description, price } = body;

    if (!name || !description || !price) {
      return Response.json({ error: "Campos requeridos" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
      },
    });

    return Response.json({ message: "Producto creado", product });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error en servidor" }, { status: 500 });
  }
}