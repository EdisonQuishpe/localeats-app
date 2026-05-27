import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all users (for admin panel)
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: { orders: true, conversations: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(users);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error fetching users" }, { status: 500 });
  }
}
