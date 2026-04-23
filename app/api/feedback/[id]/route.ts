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

    console.log("data in patch api",data)
    try {

        
    const {message, contactNumber} = data;


    const feedback = await prisma.feedback.update({
        where:{
            id:feedbackid
        },
        data:{
               message:message,
               customerContact:contactNumber,
               status:"COMPLETE" 
        }
    })


    return NextResponse.json({
      msg: "Feedback updated",
      feedback,
    });
        
    } catch (error) {
        console.log(error)

        return NextResponse.json({
            msg:"something is wrong",
            error
        })  
    }

}


export async function POST(req:NextRequest,{params}:Params) {

    try {
        const data = await req.json()
        const restaurantId = Number(params.id)

        console.log("data in post api",restaurantId,data.rating)

        const {rating,selectedPointIds,selectedPoints} = data;

        if(!restaurantId || !rating || !selectedPointIds|| !selectedPointIds){
            return NextResponse.json({
                msg:"Full data nro sent",
            })
        }


        const feedback = await prisma.feedback.create({
            data:{
                restaurantId:restaurantId,
                rating:data.rating,
                selectedPoints,
                selectedPointIds,
                
            }
        })

        
        console.log(feedback)

        return NextResponse.json({
            msg:"feedback added",
            feedbackId:feedback.id,
        })

    } catch (error) {
        console.log(error)

        return NextResponse.json({
            msg:"something is wrong",
            error
        })
        
        
    }
}