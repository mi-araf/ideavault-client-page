import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return Response.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const token = jwt.sign(
            {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                image: session.user.image || "",
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        return Response.json({
            success: true,
            token,
            user: session.user,
        });
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Failed to generate JWT",
                error: error.message,
            },
            { status: 500 }
        );
    }
}