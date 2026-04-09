import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma"

interface Params{
    params:{
        id:string
    }
}

export async function PATCH(req:NextRequest,{params}:Params) {

    const feedbackid = Number(params.id);

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