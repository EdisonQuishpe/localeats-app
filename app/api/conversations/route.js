import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Listar conversaciones
export async function GET() {
  try {
    const conversations = await prisma.conversation.findMany({
      include: {
        messages: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(conversations);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Error al obtener conversaciones" },
      { status: 500 }
    );
  }
}

// Crear conversación
export async function POST(req) {
  try {
    const body = await req.json();
    const { subject } = body;

    if (!subject) {
      return Response.json(
        { error: "El asunto es obligatorio" },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.create({
      data: {
        subject,
      },
    });

    return Response.json({
      message: "Conversación creada",
      conversation,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Error al crear conversación" },
      { status: 500 }
    );
  }
}