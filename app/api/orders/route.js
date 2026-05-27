import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Listar pedidos de un usuario
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const where = userId ? { userId: Number(userId) } : {};

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, imageUrl: true },
            },
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(orders);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error al obtener pedidos" }, { status: 500 });
  }
}

// POST - Crear un nuevo pedido
export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, items } = body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return Response.json(
        { error: "userId y al menos un item son requeridos" },
        { status: 400 }
      );
    }

    const numericUserId = Number(userId);
    if (Number.isNaN(numericUserId) || numericUserId <= 0) {
      return Response.json({ error: "Usuario inválido" }, { status: 400 });
    }

    // Validate all products exist and get current prices
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      return Response.json(
        { error: "Uno o más productos no existen" },
        { status: 400 }
      );
    }

    // Calculate total and prepare order items
    let totalAmount = 0;
    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const price = Number(product.price);
      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
      totalAmount += price * quantity;
      return {
        productId: item.productId,
        quantity,
        priceAtPurchase: price,
      };
    });

    const order = await prisma.order.create({
      data: {
        userId: numericUserId,
        totalAmount,
        status: "pending",
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, imageUrl: true },
            },
          },
        },
        user: {
          select: { id: true, name: true },
        },
      },
    });

    // Notify all admins about new order
    try {
      const admins = await prisma.user.findMany({
        where: { role: "admin" },
        select: { id: true },
      });
      const customerName = order.user?.name || "Cliente";

      if (admins.length > 0) {
        const notifications = await Promise.all(
          admins.map((admin) =>
            prisma.notification.create({
              data: {
                type: "order",
                title: "🛒 Nuevo pedido",
                body: `${customerName} realizó un pedido por $${totalAmount.toFixed(2)}`,
                userId: admin.id,
                link: "/orders",
              },
            })
          )
        );

        // Push via Socket.IO
        if (global.io && global.userSockets) {
          admins.forEach((admin, i) => {
            const sockets = global.userSockets.get(String(admin.id));
            if (sockets) {
              sockets.forEach((sid) => {
                global.io.to(sid).emit("new-notification", notifications[i]);
              });
            }
          });
        }
      }
    } catch (notifErr) {
      console.error("Order notification error:", notifErr);
    }

    return Response.json({ message: "Pedido creado", order }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error al crear pedido" }, { status: 500 });
  }
}
