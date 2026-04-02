import prisma from "@/app/lib/prisma";


async function findUserByEmail(email:string) {
   return prisma.user.findUnique({
    where: { email },
  });
}

interface SignupPayload{
    email:string
    password:string
    name:string
}

async function createUserInDb({email,password,name}:SignupPayload) {
    return  prisma.user.create({
      data: {
        email: email,
        password: password,
        name: name,
      },
    });
}


export {
    findUserByEmail,
    createUserInDb
}