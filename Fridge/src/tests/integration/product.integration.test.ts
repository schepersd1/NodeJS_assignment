import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { expect } from "chai";
import { before, beforeEach, after, describe, it } from "mocha";
import request from "supertest";

import { AppModule } from "../../app.module";
import { UserBody } from "../../contracts/user.body";
import { prisma } from "../../lib/prisma";
import { RecipeBody } from "../../contracts/recipe.body";
import { User } from "../../controllers/users/handlers/user.store";
import { Fridge, Product, Recipe } from "@prisma/client";
import { ProductBody } from "../../contracts/product.body";
import bcrypt from "bcryptjs";

const userFixtures: User[] = [
  {
    name: "test2",
    email: "test-user-2@panenco.com",
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
    capacity: 12,
  },
];
const productFixtures: Product[] = [
  {
    id: "0",
    name: "Tomato",
    size: 5,
    type: "Food",
    owner: "test-user-1@panenco.com",
    fridgeId: null,
  },
  {
    id: "1",
    name: "Smoothie",
    size: 10,
    type: "Drink",
    owner: "test-user-2@panenco.com",
    fridgeId: null,
  },
];

describe("Integration tests", () => {
  describe("Product Tests", () => {
    let app: INestApplication;

    before(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();

      // Apply the same configuration as in main.ts
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
        })
      );

      app.enableCors({
        origin: "*",
        credentials: true,
        exposedHeaders: ["x-auth"],
      });

      app.setGlobalPrefix("api");

      await app.init();

      await prisma.$connect;
    });
    let fridges: any[];
    let products: any[];
    let users: any[];
    beforeEach(async () => {
      // Clean up database before each test
      await prisma.product.deleteMany();
      await prisma.recipe.deleteMany();
      await prisma.fridge.deleteMany();
      await prisma.user.deleteMany();
      // Create test users
      users = await Promise.all(
        userFixtures.map(async (fixture) => {
          const hashedPassword = await bcrypt.hash(fixture.password, 10);
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
              name: fixture.name,
              size: fixture.size,
              type: fixture.type,
              owner: fixture.owner,
              fridge: {
                connect: { id: fridges[0].id },
              },
            },
          });
        })
      );
    });

    after(async () => {
      await app.close();
    });

    it("should CRUD products with authentication", async () => {
      // Test unauthorized access
      await request(app.getHttpServer()).get(`/api/products`).expect(401);

      // Successfully create new user (public endpoint)
      const { body: createResponseUser } = await request(app.getHttpServer())
        .post(`/api/users`)
        .send({
          name: "test",
          email: "test-user-1@panenco.com",
          password: "real secret stuff",
        } as UserBody)
        .expect(201);

      // Verify user was created in memory store
      const users = await prisma.user.findMany();
      expect(users.some((x) => x.email === createResponseUser.email)).true;

      // Login to get JWT token
      const { body: loginResponse } = await request(app.getHttpServer())
        .post(`/api/auth/login`)
        .send({
          email: "test-user-1@panenco.com",
          password: "real secret stuff",
        })
        .expect(201);

      const token = loginResponse.token;
      expect(token).to.be.a("string");

      // Successfully create new product
      const { body: createResponseProduct } = await request(app.getHttpServer())
        .post(`/api/products`)
        .send({
          name: "Onion",
          size: 4,
          type: "Food",
          owner: "test-user-1@panenco.com",
        } as ProductBody)
        .set("x-auth", token)
        .expect(201);

      // Verify product was created in memory store
      const products = await prisma.product.findMany();
      expect(products.some((x) => x.size === createResponseProduct.size)).true;

      // Get the newly created product
      const { body: getResponseProduct } = await request(app.getHttpServer())
        .get(`/api/products/${createResponseProduct.id}`)
        .set("x-auth", token)
        .expect(200);
      expect(getResponseProduct.size).equal(4);
      expect(getResponseProduct.type).equal("Food");
      expect(getResponseProduct.owner).equal("test-user-1@panenco.com");

      // Successfully put product in a fridge
      const { body: putProductInFridgeResponse } = await request(
        app.getHttpServer()
      )
        .patch(`/api/fridges/${fridges[2].id}/put`)
        .send(createResponseProduct)
        .set("x-auth", token)
        .expect(200);

      expect(putProductInFridgeResponse.fridgeId).equals(fridges[2].id);

      // Get all products from user
      const { body: getAllProductsResponse } = await request(
        app.getHttpServer()
      )
        .get(`/api/products?email=${createResponseUser.email}`)
        .set("x-auth", token)
        .expect(200);
      expect(getAllProductsResponse.length).equal(2);

      // Get all products from user from fridge
      const { body: getAllProductsFromFridgeResponse } = await request(
        app.getHttpServer()
      )
        .get(
          `/api/products/${fridges[0].id}/all-from-fridge?email=${createResponseUser.email}`
        )
        .set("x-auth", token)
        .expect(200);
      expect(getAllProductsFromFridgeResponse.length).equal(1);

      // Get all products from all fridges in a certain location from user
      const { body: getAllProductsLocation } = await request(
        app.getHttpServer()
      )
        .get(
          `/api/products/101/all-from-fridge-in-location?email=${createResponseUser.email}`
        )
        .set("x-auth", token)
        .expect(200);
      expect(getAllProductsLocation.length).equal(1);

      // Successfully gift a product to another user
      const { body: giftProductResponse } = await request(app.getHttpServer())
        .patch(`/api/products/${createResponseProduct.id}/gift`)
        .send({ email: "test-user-2@panenco.com" })
        .set("x-auth", token)
        .expect(200);

      expect(giftProductResponse.owner).equal("test-user-2@panenco.com");

      // Successfully gift all products from a fridge to another user
      // user1 currently has one product in fridge0 and user2 has one product in fridge0 and one in fridge2
      const { body: giftAllProductsFromFridgeResponse } = await request(
        app.getHttpServer()
      )
        .patch(`/api/products/${fridges[2].id}/gift-all-from-fridge`)
        .send({
          from: "test-user-2@panenco.com",
          to: "test-user-1@panenco.com",
        })
        .set("x-auth", token)
        .expect(200);
      expect(giftAllProductsFromFridgeResponse.length).equal(1);
      expect(giftAllProductsFromFridgeResponse[0].owner).equal(
        "test-user-1@panenco.com"
      );

      // Successfully gift all your products to another user
      const { body: giftAllProducts } = await request(app.getHttpServer())
        .patch(`/api/products/gift-all`)
        .send({
          from: "test-user-1@panenco.com",
          to: "test-user-2@panenco.com",
        })
        .set("x-auth", token)
        .expect(200);

      expect(giftAllProducts.length).equal(2);
      expect(giftAllProducts[0].owner).equal("test-user-2@panenco.com");

      // Get all products from user1 after gifts
      const { body: getAllProductsResponseAfterGifts } = await request(
        app.getHttpServer()
      )
        .get(`/api/products?email=test-user-1@panenco.com`)
        .set("x-auth", token)
        .expect(200);
      expect(getAllProductsResponseAfterGifts.length).equal(0);

      // Get all products from user2 after gifts
      const { body: getAllProductsResponseAfterGifts1 } = await request(
        app.getHttpServer()
      )
        .get(`/api/products?email=test-user-2@panenco.com`)
        .set("x-auth", token)
        .expect(200);
      expect(getAllProductsResponseAfterGifts1.length).equal(3);

      // Successfully delete product from a fridge
      const { body: deleteProductFromFridgeResponse } = await request(
        app.getHttpServer()
      )
        .patch(`/api/fridges/${createResponseProduct.id}/delete`)
        .set("x-auth", token)
        .expect(200);

      // Get the deleted product
      const { body: getDeletedProduct } = await request(app.getHttpServer())
        .get(`/api/products/${createResponseProduct.id}`)
        .set("x-auth", token)
        .expect(200);
      expect(getResponseProduct.fridgeId).equal(null);

      // Successfully delete all products from a fridge
      // currently user2 has two products in fridge0
      const { body: deleteProductsFromFridgeResponse } = await request(
        app.getHttpServer()
      )
        .patch(`/api/products/${fridges[0].id}/delete-all-from-fridge`)
        .send({
          email: "test-user-2@panenco.com",
        })
        .set("x-auth", token)
        .expect(200);

      // Get all products from user2 after deletions
      const { body: getAllProductsResponseAfterDeletions } = await request(
        app.getHttpServer()
      )
        .get(`/api/products?email=test-user-2@panenco.com`)
        .set("x-auth", token)
        .expect(200);
      expect(getAllProductsResponseAfterDeletions.length).equal(0);

      // Put two products in two different fridges from user2
      const { body: putProductInFridgeResponseSkip } = await request(
        app.getHttpServer()
      )
        .patch(`/api/fridges/${fridges[0].id}/put`)
        .send(products[0])
        .set("x-auth", token)
        .expect(200);

      const { body: putProductInFridgeResponseSkip1 } = await request(
        app.getHttpServer()
      )
        .patch(`/api/fridges/${fridges[2].id}/put`)
        .send(products[1])
        .set("x-auth", token)
        .expect(200);

      // Check if user2 has again two products in a fridge
      const { body: getAllProductsResponseAfterTwoAdded } = await request(
        app.getHttpServer()
      )
        .get(`/api/products?email=test-user-2@panenco.com`)
        .set("x-auth", token)
        .expect(200);
      expect(getAllProductsResponseAfterTwoAdded.length).equal(2);

      // Successfully delete all products from all fridges
      const { body: deleteProductsResponse } = await request(
        app.getHttpServer()
      )
        .patch(`/api/products/delete-all`)
        .send({
          email: "test-user-2@panenco.com",
        })
        .set("x-auth", token)
        .expect(200);

      // Check if user2 has again zero products in a fridge
      const { body: getAllProductsResponseAfterEverythingDeleted } =
        await request(app.getHttpServer())
          .get(`/api/products?email=test-user-2@panenco.com`)
          .set("x-auth", token)
          .expect(200);
      expect(getAllProductsResponseAfterEverythingDeleted.length).equal(0);
    });
  });
});
