import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma"

interface Params{
    params:{
        feedbackid:string
        restaurantid:string
    }
}

export async function PATCH(req:NextRequest,{params}:Params) {

    const feedbackid = Number(params.feedbackid);

    const data = await req.json();

    if(!feedbackid){
        return NextResponse.json({
            msg:"feedback id not provided "
        })
    }

    const {message, customerContact} = data;

    if (!message && !customerContact) {
        return NextResponse.json(
            { msg: "Nothing to update" },
            { status: 400 }
        );
    }


    const feedback = await prisma.feedback.update({
        where:{
            id:feedbackid
        },
        data:{
               message:message,
               customerContact:customerContact,
               status:"COMPLETE" 
        }
    })


    return NextResponse.json({
      msg: "Feedback updated",
      feedback,
    });

}





export async function POST(req:NextRequest,{params}:Params) {

    try {
        const data = await req.json()
        const restaurantId = Number(params.restaurantid)

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