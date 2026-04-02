import { NextRequest, NextResponse, userAgent } from "next/server";
import { signinSchema } from "@/zod";
import { sign } from "jsonwebtoken";
import { findUserByEmail } from "@/db/queries";

// Force dynamic rendering since we set cookies
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const parsed = signinSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ msg: "Invalid data" }, { status: 400 });
        }
        const { email, password } = parsed.data;


        const findUser = await findUserByEmail(email)

        if (!findUser || findUser.password !== password) {
            return NextResponse.json({ 
                msg: "Invalid email or password" 
            }, { status: 409 });
        }

        const token = sign({ id: findUser.id }, process.env.NEXTAUTH_SECRET as string, {
            expiresIn: "30d", 
        });

        const response = NextResponse.json({ 
            userId: findUser.id,
            msg: "Sign in successful"
        });

        response.cookies.set("token", token, {
            path: "/",
            maxAge: 30 * 24 * 60 * 60, 
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        response.cookies.set("userId", findUser.id.toString(), {
            path: "/",
            maxAge: 30 * 24 * 60 * 60,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return response;
    } catch (error) {
        console.error("Signin error:", error);
        return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
    }
}
