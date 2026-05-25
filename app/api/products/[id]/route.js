import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✏️ EDITAR producto
export async function PUT(req, context) {
  try {
    const { id } = await context.params; 

    const body = await req.json();
    const { name, description, price } = body;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: parseFloat(price),
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

    console.log("ID:", id);

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return Response.json({ message: "Producto eliminado" });

  } catch (error) {
    console.error("ERROR DELETE:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}