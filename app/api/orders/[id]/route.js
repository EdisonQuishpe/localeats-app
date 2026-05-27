import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Obtener un pedido por ID
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const orderId = Number(id);

    if (Number.isNaN(orderId)) {
      return Response.json({ error: "ID inválido" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, imageUrl: true, description: true },
            },
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!order) {
      return Response.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    return Response.json(order);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error al obtener pedido" }, { status: 500 });
  }
}

// PATCH - Actualizar estado de un pedido
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const orderId = Number(id);
    const body = await req.json();
    const { status } = body;

    if (Number.isNaN(orderId)) {
      return Response.json({ error: "ID inválido" }, { status: 400 });
    }

    const validStatuses = ["pending", "preparing", "dispatched", "delivered", "canceled"];
    if (!validStatuses.includes(status)) {
      return Response.json(
        { error: `Estado inválido. Usar: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    return Response.json({ message: "Pedido actualizado", order });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error al actualizar pedido" }, { status: 500 });
  }
}
