import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔍 Obtener productos
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

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
    const { name, description, price, userId } = body;

    if (!name || !description || price === undefined || price === null || !userId) {
      return Response.json({ error: "Campos requeridos" }, { status: 400 });
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return Response.json({ error: "Precio inválido" }, { status: 400 });
    }

    const ownerId = Number(userId);
    if (Number.isNaN(ownerId) || ownerId <= 0) {
      return Response.json({ error: "Usuario inválido" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: numericPrice,
        userId: ownerId,
      },
    });

    return Response.json({ message: "Producto creado", product }, { status: 201 });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error en servidor" }, { status: 500 });
  }
}