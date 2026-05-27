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

    const message = await prisma.message.create({
      data: {
        content,
        senderRole,
        conversationId: parseInt(conversationId),
        userId: userId ? parseInt(userId) : null,
      },
    });

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

    const messages = await prisma.message.findMany({
      where: {
        conversationId: parseInt(conversationId),
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