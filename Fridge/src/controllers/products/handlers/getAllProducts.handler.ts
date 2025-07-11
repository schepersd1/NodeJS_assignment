import { prisma } from "../../../lib/prisma";

export const getAllProducts = async (email: string) => {
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
