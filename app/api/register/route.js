import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;
    const trimmedEmail = String(email || "").trim();

    if (!name || !trimmedEmail || !password) {
      return Response.json({ error: "Campos requeridos" }, { status: 400 });
    }

    if (String(password).length < 6) {
      return Response.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });
    }

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return Response.json({ error: "Email inválido" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingUser) {
      return Response.json({ error: "Usuario ya existe" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: trimmedEmail,
        password: hashedPassword,
      },
    });

    // Do not return password hash to the client
    return Response.json({
      message: "Usuario creado",
      user: { id: user.id, name: user.name, email: user.email },
    });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error en servidor" }, { status: 500 });
  }
}