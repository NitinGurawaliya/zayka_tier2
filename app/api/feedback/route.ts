import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { authMiddleware } from "@/app/lib/middleware/authMiddleware";

export async function GET(req:NextRequest,res:NextResponse) {

    const authResult  = await authMiddleware(req)

    if(authResult.error){
                return authResult.error;    
    }

    const restaurantId = req.cookies.get("restaurantId")?.value;



    const feedback = await prisma.feedback.findMany({
        where:{
            restaurantId:Number(restaurantId)
        }
    })

    return NextResponse.json({
        msg:"all feedbacks",
        feedback
    })
}
