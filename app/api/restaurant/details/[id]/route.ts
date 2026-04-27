import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(req:NextRequest,{params}:{params:{id:string}}) {

 try {
    const id = params.id

    const info = await prisma.restaurantDetail.findUnique({
        where:{
            id:Number(id)
        },
        select:{
            restaurantName:true,
            logo:true,
            location:true,
            googlePlacedId:true
        }
    })

    console.log("info:",info)

    if(!info){
        return NextResponse.json({
            msg:"not found restuarnat   "
        },{status:404})
    }

    return NextResponse.json({
        msg:"Restaunrt detailes fetched",
        info
    })
 } catch (error) {
    console.log(error)
    return NextResponse.json({
        msg:"Interal server error"
    })
 }
}