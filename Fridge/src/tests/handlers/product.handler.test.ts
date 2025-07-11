import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";

import { createProduct } from "../../controllers/products/handlers/createProduct.handler";
import { putProductInFridge } from "../../controllers/fridges/handlers/putProductInFridge.handler";
import { giftProduct } from "../../controllers/products/handlers/giftProduct.handler";
import { deleteAllProducts } from "../../controllers/products/handlers/deleteAllProducts.handler";
import { deleteAllProductsFromFridge } from "../../controllers/products/handlers/deleteAllProductsFromFridge.handler";
import { getAllProducts } from "../../controllers/products/handlers/getAllProducts.handler";
import { getAllProductsFromFridge } from "../../controllers/products/handlers/getAllProductsFromFridge.handler";
import { getAllProductsLocation } from "../../controllers/products/handlers/getAllProductsLocation.handler";
import { getProduct } from "../../controllers/products/handlers/getProduct.handler";
import { giftAllProducts } from "../../controllers/products/handlers/giftAllProducts.handler";
import { giftAllProductsFromFridge } from "../../controllers/products/handlers/giftAllProductsFromFridge.handler";


import { User } from "../../controllers/users/handlers/user.store";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { Fridge, Product } from "@prisma/client";
import { deleteProductFromFridge } from "../../controllers/fridges/handlers/deleteProductFromFridge.handler";

const userFixtures: User[] = [
    {
        name: "test1",
        email: "test-user+1@panenco.com",
        id: 0,
        password: "password1",
    },
    {
		name: "test2",
		email: "test-user+2@panenco.com",
		id: 1,
		password: "password2",
	},
];
const fridgeFixtures: Fridge[] = [
    {
        id: "0",
        location: 101,
        capacity: 20,
    },
    {
        id: "1",
        location: 101,
        capacity: 15,
    },
    {
        id: "2",
        location: 201,
        capacity: 8,
    },
];
const productFixtures: Product[] = [
    {
        id: "0",
        size: 5,
        type: "Food",
        owner: "test-user+1@panenco.com",
        fridgeId: null
    },
    {
        id: "1",
        size: 10,
        type: "Drink",
        owner: "test-user+2@panenco.com",
        fridgeId: null
    },
];


describe("Handler tests", () => {
    describe("Product Tests", () => {
        let users: any[];
        let fridges: any[];
        let products: any[];
        beforeEach(async () => {
            // Clean up database
            await prisma.product.deleteMany();
            await prisma.recipe.deleteMany();
            await prisma.fridge.deleteMany();
            await prisma.user.deleteMany();
            // Create test users
            users = await Promise.all(
                userFixtures.map(async (fixture) => {
                    const hashedPassword = await bcrypt.hash(
                        fixture.password,
                        10
                    );
                    return prisma.user.create({
                        data: {
                            name: fixture.name,
                            email: fixture.email,
                            password: hashedPassword,
                        },
                    });
                })
            );
            // Create test fridges
            fridges = await Promise.all(
                fridgeFixtures.map(async (fixture) => {
                    return prisma.fridge.create({
                        data: {
                            location: fixture.location,
                            capacity: fixture.capacity,
                        },
                    });
                })
            );
            // Create test products
            products = await Promise.all(
                productFixtures.map(async (fixture) => {
                    return prisma.product.create({
                        data: {
                            size: fixture.size,
                            type: fixture.type,
                            owner: fixture.owner,
                        },
                    });
                })
            );
        });

        it("should create product", async () => {
            const body = {
                id: "0",
                size: 5,
                type: "Food",
                owner: "test-user+1@panenco.com",
            };
            const res = await createProduct(body);

            expect(res.size).equal(5);
            expect(res.type).equal("Food");
            expect(res.owner).equal("test-user+1@panenco.com");
        });

        it("should put a product in a fridge", async () => {
            const res = await putProductInFridge(fridges[0].id, products[0]);
            expect(res.fridgeId).equal(fridges[0].id);
        });

        it("should fail when putting product in unknown fridge", async () => {
            try {
                await putProductInFridge("00", products[1]);
            } catch (error) {
                expect(error.message).equal("Fridge not found");
                return;
            }
            expect(true, "should have thrown an error").false;
        });

        it("should fail when putting a big product in a small fridge", async () => {
            try {
                await putProductInFridge(fridges[2].id, products[1]);
            } catch (error) {
                expect(error.message).equal("Fridge is full");
                return;
            }
            expect(true, "should have thrown an error").false;
        });


        it("should gift a product to another user", async () => {
            const res = await giftProduct( products[0].id, {email: users[1].email});

            expect(res.owner).equal(users[1].email);
        });

        it("should fail when gifting an unknown product", async () => {
            try {
                await giftProduct("00", users[1]);
            } catch (error) {
                expect(error.message).equal("Product not found");
                return;
            }
            expect(true, "should have thrown an error").false;
        });

        it("should delete a product from a fridge", async () => {
            const productInFridge = await putProductInFridge(fridges[0].id, products[0]);
            expect(productInFridge.fridgeId).equal(fridges[0].id);
            await deleteProductFromFridge(productInFridge.id);
            const updatedProduct = await getProduct(productInFridge.id);
            expect(updatedProduct.fridgeId).equal(null);
        });

        it("should fail when deleting an unknown product in a fridge", async () => {
            try {
                await deleteProductFromFridge("00");
            } catch (error) {
                expect(error.message).equal("Product not found");
                return;
            }
            expect(true, "should have thrown an error").false;
        });

        it("should fail when deleting a product that is not in a fridge", async () => {
            try {
                await deleteProductFromFridge(products[0].id);
            } catch (error) {
                expect(error.message).equal("Product is not in a fridge");
                return;
            }
            expect(true, "should have thrown an error").false;
        });

        it("should get product by id", async () => {
            const res = await getProduct(products[0].id);
        
            expect(res.size).equal(products[0].size);
            expect(res.type).equal(products[0].type);
            expect(res.owner).equal(products[0].owner);
        });

        it("should fail when getting an unknown product", async () => {
            try {
                await getProduct("00");
            } catch (error) {
                expect(error.message).equal("Product not found");
                return;
            }
            expect(true, "should have thrown an error").false;
        });

        it("should get all the products of a user from a fridge", async () => {
			const res = await getAllProductsFromFridge(fridges[0].id,users[0].email);
			expect(res.length).equal(0);
            // put a product from user1 in fridge
            await putProductInFridge(fridges[0].id,products[0]);
            const res1 = await getAllProductsFromFridge(fridges[0].id,users[0].email);
			expect(res1.length).equal(1);
            // put a product from user2 in fridge
            await putProductInFridge(fridges[0].id, products[1])
            const res2 = await getAllProductsFromFridge(fridges[0].id,users[0].email);
			expect(res2.length).equal(1);
		});
        
        it("should fail when getting products from unknown fridge", async () => {
            try {
                await getAllProductsFromFridge("00",users[0].email);
            } catch (error) {
                expect(error.message).equal("Fridge not found");
                return;
            }
            expect(true, "should have thrown an error").false;
        });

        it("should gift all products from a fridge from one user to another user", async () => {
            await putProductInFridge(fridges[0].id, products[0])
            const res = await giftAllProductsFromFridge(fridges[0].id,
                { 
                from: users[0].email,
                to: users[1].email,
                }
            );

            expect(res.length).equal(1);
            expect(res[0].owner).equal(users[1].email);

        });

        it("should fail when gifting products from unknown fridge", async () => {
            try {
                await giftAllProductsFromFridge("00",{ 
                    from: users[0].email,
                    to: users[1].email,
                }
            );
            } catch (error) {
                expect(error.message).equal("Fridge not found");
                return;
            }
            expect(true, "should have thrown an error").false;
        });
        
        it("should delete all products from a fridge", async () => {
            const productInFridge = await putProductInFridge(fridges[0].id, products[0]);
            expect(productInFridge.fridgeId).equal(fridges[0].id);
            await deleteAllProductsFromFridge(fridges[0].id, users[0].email);
            const updatedProduct = await getProduct(productInFridge.id);
            expect(updatedProduct.fridgeId).equal(null);
        });

        it("should fail when deleting products from unknown fridge", async () => {
            try {
                await deleteAllProductsFromFridge("00", users[0].email);
            } catch (error) {
                expect(error.message).equal("Fridge not found");
                return;
            }
            expect(true, "should have thrown an error").false;
        });
        
        it("should get all the products of a user from all fridges", async () => {
			const res = await getAllProducts(users[0].email);
			expect(res.length).equal(0);
            // put a product from user1 in fridge
            await putProductInFridge(fridges[0].id,products[0]);
            const res1 = await getAllProducts(users[0].email);
			expect(res1.length).equal(1);
            // put a product from user2 in fridge
            await putProductInFridge(fridges[0].id, products[1])
            const res2 = await getAllProducts(users[0].email);
			expect(res2.length).equal(1);
		});

        it("should gift all products from all fridges from one user to another user", async () => {
            await putProductInFridge(fridges[0].id, products[0])
            const res = await giftAllProducts(
                { 
                from: users[0].email,
                to: users[1].email,
                }
            );

            expect(res.length).equal(1);
            expect(res[0].owner).equal(users[1].email);

        });
        
        it("should delete all products from a user from all fridges", async () => {
            const productInFridge = await putProductInFridge(fridges[0].id, products[0]);
            expect(productInFridge.fridgeId).equal(fridges[0].id);
            await deleteAllProducts(users[0].email);
            const updatedProduct = await getProduct(productInFridge.id);
            expect(updatedProduct.fridgeId).equal(null);
        });

        it("should get all the products of a user from all fridges in a certain location", async () => {
			const res = await getAllProductsLocation(101, users[0].email);
			expect(res.length).equal(0);
            // put a product from user1 in fridge
            await putProductInFridge(fridges[0].id,products[0]);
            const res1 = await getAllProductsLocation(101, users[0].email);
			expect(res1.length).equal(1);
            // checking products on another location should still give 0
            const res2 = await getAllProductsLocation(201, users[0].email);
			expect(res2.length).equal(0);
            // put a product from user2 in fridge
            await putProductInFridge(fridges[0].id, products[1])
            const res3 = await getAllProductsLocation(101, users[0].email);
			expect(res3.length).equal(1);
		});
    });
});