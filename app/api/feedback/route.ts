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



export async function POST(req:NextRequest,res:NextResponse) {

    try {
        const data = await req.json()
        const restaurantId = data.restaurantId;
        console.log(data)

        if(!restaurantId || !data.rating){
            return NextResponse.json({
                msg:"Full data nro sent",

            })
        }


        const feedback = await prisma.feedback.create({
            data:{
                restaurantId:restaurantId,
                rating:data.rating,
            }
        })

        
        console.log(feedback)

        return NextResponse.json({
            msg:"hello",
            feedbackid: feedback.id
        })

    } catch (error) {
        console.log(error)

        return NextResponse.json({
            msg:"something is wrong",
            error
        })
        
        
    }
}