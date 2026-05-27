import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;
    const trimmedEmail = String(email || "").trim();

    if (!trimmedEmail || !password) {
      return Response.json({ error: "Campos requeridos" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (!user) {
      return Response.json({ error: "Usuario no existe" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return Response.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }

    return Response.json({
      message: "Login exitoso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error en servidor" }, { status: 500 });
  }
}