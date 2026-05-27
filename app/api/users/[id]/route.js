import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PATCH - update user role or status
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { role, isActive } = body;

    const data = {};
    if (role !== undefined) {
      const validRoles = ["user", "admin", "support"];
      if (!validRoles.includes(role)) {
        return Response.json({ error: "Invalid role" }, { status: 400 });
      }
      data.role = role;
    }
    if (isActive !== undefined) {
      data.isActive = Boolean(isActive);
    }

    if (Object.keys(data).length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return Response.json(user);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error updating user" }, { status: 500 });
  }
}
