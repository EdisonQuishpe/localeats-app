import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();

    const { email, newPassword } = body;

    if (!email || !newPassword) {
      return Response.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const trimmedEmail = String(email).trim();
    const trimmedPassword = String(newPassword);

    if (trimmedPassword.length < 6) {
      return Response.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });
    }

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return Response.json({ error: "Email inválido" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: trimmedEmail,
      },
    });

    if (!user) {
      return Response.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        email: trimmedEmail,
      },
      data: {
        password: hashedPassword,
      },
    });

    return Response.json({
      message: "Contraseña actualizada correctamente",
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Error del servidor" },
      { status: 500 }
    );
  }
}