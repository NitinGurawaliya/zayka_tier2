import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

interface CustomerTokenPayload extends jwt.JwtPayload {
  id?: number;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("user_token")?.value;
    if (!token) {
      return NextResponse.json({ customer: null, msg: "User not registered yet" }, { status: 200 });
    }
    console.log("token", token);

    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      return NextResponse.json({ msg: "Server config missing" }, { status: 500 });
    }

    const decoded = jwt.verify(token, secret) as CustomerTokenPayload;
    const customerId = decoded?.id;
    if (!customerId) {
      return NextResponse.json({ msg: "Invalid user token" }, { status: 401 });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: {
        name: true,
        mobile: true,
      },
    });

    if (!customer) {
      const response = NextResponse.json(
        { customer: null, msg: "User not registered yet" },
        { status: 200 }
      );
      // Clear stale/invalid customer cookie so registration popup flow can recover.
      response.cookies.set("user_token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
      return response;
    }

    return NextResponse.json({ customer }, { status: 200 });
  } catch (error) {
    console.error("Error fetching current customer:", error);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
}
