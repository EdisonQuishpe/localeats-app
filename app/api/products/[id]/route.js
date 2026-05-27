import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔎 Obtener un producto por ID
export async function GET(req, context) {
  try {
    const { id } = await context.params;
    const productId = parseInt(id, 10);

    if (Number.isNaN(productId)) {
      return Response.json({ error: "ID inválido" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return Response.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    return Response.json(product);
  } catch (error) {
    console.error("ERROR GET:", error);
    return Response.json({ error: "Error en servidor" }, { status: 500 });
  }
}

// ✏️ EDITAR producto
export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const productId = parseInt(id, 10);

    if (Number.isNaN(productId)) {
      return Response.json({ error: "ID inválido" }, { status: 400 });
    }

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

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return Response.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    if (existingProduct.userId !== ownerId) {
      return Response.json({ error: "No tienes permiso para editar este producto" }, { status: 403 });
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price: numericPrice,
      },
    });

    return Response.json({ message: "Producto actualizado", product });

  } catch (error) {
    console.error("ERROR PUT:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// 🗑️ ELIMINAR producto
export async function DELETE(req, context) {
  try {
    const { id } = await context.params;
    const productId = parseInt(id, 10);

    if (Number.isNaN(productId)) {
      return Response.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return Response.json({ error: "Usuario inválido" }, { status: 400 });
    }

    const ownerId = Number(userId);
    if (Number.isNaN(ownerId) || ownerId <= 0) {
      return Response.json({ error: "Usuario inválido" }, { status: 400 });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return Response.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    if (existingProduct.userId !== ownerId) {
      return Response.json({ error: "No tienes permiso para eliminar este producto" }, { status: 403 });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return Response.json({ message: "Producto eliminado" });

  } catch (error) {
    console.error("ERROR DELETE:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}