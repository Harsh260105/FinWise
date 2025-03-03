import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

// Initialize Prisma client
const prisma = new PrismaClient();

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return Response.json({ isSubscribed: false });
        }

        // Find user by clerkUserId
        const dbUser = await prisma.user.findUnique({
            where: { clerkUserId: userId },
            select: {
                isSubscribed: true,
                subscriptions: {
                    where: {
                        status: "ACTIVE",
                        endDate: { gte: new Date() } // Not expired
                    },
                    select: { id: true }
                }
            }
        });

        // User is subscribed if either the flag is true or they have an active subscription
        const isSubscribed = dbUser?.isSubscribed || (dbUser?.subscriptions.length > 0);

        return Response.json({ isSubscribed });
    } catch (error) {
        console.error("Error checking subscription:", error);
        return Response.json({ isSubscribed: false });
    }
} 