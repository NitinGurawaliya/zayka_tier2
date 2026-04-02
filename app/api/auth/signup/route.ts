import { signupSchema } from "@/zod";
import { sign } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { createUserInDb } from "@/db/queries";
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ 
        msg: "Invalid data sent" 
      }, { status: 400 });
    }

    const { email, name, password } = parsed.data;

    const user = await createUserInDb({
        email: email,
        name: name,
        password: password,
    })

    if(!user){
      return  NextResponse.json({ 
        msg: "signup failed" 
      }, { status: 409 });
    }

    const token = sign(
      { id: user.id },
      process.env.NEXTAUTH_SECRET as string,
      { expiresIn: "30d" }
    );

    const response = NextResponse.json({ 
      msg: "Signup successful",
      userId: user.id,
    });

    response.cookies.set("token", token, {
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    response.cookies.set("userId", user.id.toString(), { 
      path: "/",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
}
