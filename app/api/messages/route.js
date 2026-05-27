import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Crear mensaje
export async function POST(req) {
  try {
    const body = await req.json();
    const { content, senderRole, conversationId, userId } = body;

    if (!content || !senderRole || !conversationId) {
      return Response.json(
        { error: "Faltan datos del mensaje" },
        { status: 400 }
      );
    }

    if (!['user', 'support'].includes(senderRole)) {
      return Response.json(
        { error: "senderRole inválido" },
        { status: 400 }
      );
    }

    const conversationIdNumber = Number(conversationId);
    if (Number.isNaN(conversationIdNumber) || conversationIdNumber <= 0) {
      return Response.json(
        { error: "conversationId inválido" },
        { status: 400 }
      );
    }

    let ownerId = null;
    if (senderRole === 'user') {
      if (!userId) {
        return Response.json(
          { error: "userId es obligatorio para mensajes de usuario" },
          { status: 400 }
        );
      }

      ownerId = Number(userId);
      if (Number.isNaN(ownerId) || ownerId <= 0) {
        return Response.json(
          { error: "userId inválido" },
          { status: 400 }
        );
      }
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderRole,
        conversationId: conversationIdNumber,
        userId: ownerId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        conversation: true,
      },
    });

    // Create push notification for the other party
    try {
      const conversation = message.conversation;
      let targetUserIds = [];

      if (senderRole === "user") {
        // Notify all admins/support
        const admins = await prisma.user.findMany({
          where: { role: { in: ["admin", "support"] } },
          select: { id: true },
        });
        targetUserIds = admins.map((a) => a.id);
      } else if (senderRole === "support" && conversation.userId) {
        // Notify the conversation owner
        targetUserIds = [conversation.userId];
      }

      if (targetUserIds.length > 0) {
        const senderName = message.user?.name || "Soporte";
        const notifications = await Promise.all(
          targetUserIds.map((uid) =>
            prisma.notification.create({
              data: {
                type: "message",
                title: `💬 ${senderName}`,
                body: content.length > 80 ? content.slice(0, 80) + "..." : content,
                userId: uid,
                link: `/support/${conversationIdNumber}`,
              },
            })
          )
        );

        // Push via Socket.IO
        if (global.io && global.userSockets) {
          targetUserIds.forEach((uid, i) => {
            const sockets = global.userSockets.get(String(uid));
            if (sockets) {
              sockets.forEach((sid) => {
                global.io.to(sid).emit("new-notification", notifications[i]);
              });
            }
          });
        }
      }
    } catch (notifErr) {
      console.error("Notification error:", notifErr);
    }

    return Response.json({
      message: "Mensaje creado",
      data: message,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Error al crear mensaje" },
      { status: 500 }
    );
  }
}

// Listar mensajes por conversación
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return Response.json(
        { error: "conversationId es obligatorio" },
        { status: 400 }
      );
    }

    const conversationIdNumber = Number(conversationId);
    if (Number.isNaN(conversationIdNumber) || conversationIdNumber <= 0) {
      return Response.json({ error: "conversationId inválido" }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationIdNumber,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return Response.json(messages);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Error al obtener mensajes" },
      { status: 500 }
    );
  }
}