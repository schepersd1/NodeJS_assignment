import { prisma } from "../../../lib/prisma";

export const getAllProductsLocation = async (location: number, email: string) => {
    const products = await prisma.product.findMany({
        where: {
            owner: email,
            fridge: {
                location: location,
            },
        },
        orderBy: {
            size: "desc",
        },
    });

    return products;
};
