import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener una conversación específica con sus mensajes
export async function GET(req, context) {
  try {
    const { id } = await context.params;

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        messages: {
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
        },
      },
    });

    if (!conversation) {
      return Response.json(
        { error: "Conversación no encontrada" },
        { status: 404 }
      );
    }

    return Response.json(conversation);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Error al obtener conversación" },
      { status: 500 }
    );
  }
}

// Cerrar conversación
export async function PATCH(req, context) {
  try {
    const { id } = await context.params;

    const conversation = await prisma.conversation.update({
      where: {
        id: parseInt(id),
      },
      data: {
        status: "closed",
      },
    });

    return Response.json({
      message: "Conversación cerrada",
      conversation,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Error al cerrar conversación" },
      { status: 500 }
    );
  }
}