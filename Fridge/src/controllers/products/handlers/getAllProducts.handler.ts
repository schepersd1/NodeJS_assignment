import { BadRequestException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";
import { validateUser } from "../../../validators/user.validator";

export const getAllProducts = async (email: string) => {
    const validUser = await validateUser(email);
    if (!validUser) {
        throw new BadRequestException("Email is not linked to a valid user");
    }
    
    const products = await prisma.product.findMany({
        where:   {
            owner: email,
            fridgeId: {
                not:null,
            }
        },
        orderBy: { size: "desc" },
    });

    return products;
};
