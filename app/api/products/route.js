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

    if (!name || !description || price === undefined || price === null) {
      return Response.json({ error: "Campos requeridos" }, { status: 400 });
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return Response.json({ error: "Precio inválido" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: numericPrice,
      },
    });

    return Response.json({ message: "Producto creado", product }, { status: 201 });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error en servidor" }, { status: 500 });
  }
}