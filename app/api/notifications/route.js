import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET notifications for a user
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return Response.json(notifications);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error fetching notifications" }, { status: 500 });
  }
}

// POST create a notification
export async function POST(req) {
  try {
    const body = await req.json();
    const { type, title, body: notifBody, userId, link } = body;

    if (!type || !title || !notifBody || !userId) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        body: notifBody,
        userId: Number(userId),
        link: link || null,
      },
    });

    return Response.json(notification);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error creating notification" }, { status: 500 });
  }
}

// PATCH mark all as read for a user
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    await prisma.notification.updateMany({
      where: { userId: Number(userId), read: false },
      data: { read: true },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error updating notifications" }, { status: 500 });
  }
}
