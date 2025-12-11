import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { expect } from "chai";
import { before, beforeEach, after, describe, it } from "mocha";
import request from "supertest";

import { AppModule } from "../../app.module";
import { UserBody } from "../../contracts/user.body";
import { prisma } from "../../lib/prisma";
import { RecipeBody } from "../../contracts/recipe.body";
import { Fridge, Product, Recipe } from "@prisma/client";
import { User } from "../../controllers/users/handlers/user.store";
import bcrypt from "bcryptjs";

const userFixtures: User[] = [
  {
    firstName: "test2",
    lastName: "tester2",
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
    capacity: 8,
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
const recipeFixtures: Recipe[] = [
  {
    id: "0",
    name: "Dinner",
    description: "Protein",
    owner: "test-user-1@panenco.com",
  },
];

describe("Integration tests", () => {
  describe("Recipe Tests", () => {
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
    let recipes: any[];
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
            const hashedPassword = await bcrypt.hash(
                fixture.password,
                10
            );
            return prisma.user.create({
                data: {
                    firstName: fixture.firstName,
                    lastName: fixture.lastName,
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
                connect: { id: fridges[0].id }
              }
            },
          });
        })
      );
      // Create test recipe
      recipes = await Promise.all(
        recipeFixtures.map(async (fixture) => {
          return prisma.recipe.create({
            data: {
              name: fixture.name,
              description: fixture.description,
              owner: fixture.owner,
              ingredients: {
                connect: { id: products[0].id },
              },
            },
          });
        })
      );
    });

    after(async () => {
      await app.close();
    });

    it("should CRUD recipes with authentication", async () => {
      // Test unauthorized access
      await request(app.getHttpServer()).get(`/api/recipes`).expect(401);

      // Successfully create new user (public endpoint)
      const { body: createResponse } = await request(app.getHttpServer())
        .post(`/api/users`)
        .send({
          firstName: "test",
          lastName: "testy",
          email: "test-user-1@panenco.com",
          password: "real secret stuff",
        } as UserBody)
        .expect(201);

      // Verify user was created in memory store
      const users = await prisma.user.findMany();
      expect(users.some((x) => x.email === createResponse.email)).true;

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

      // Successfully create new recipe
      const { body: createResponseRecipe } = await request(app.getHttpServer())
        .post(`/api/recipes`)
        .send({
          name: "Dinner",
          description: "Protein",
          owner: "test-user-1@panenco.com",
          ingredients: [],
        } as RecipeBody)
        .set("x-auth", token)
        .expect(201);

      // Verify recipe was created in memory store
      const recipes = await prisma.recipe.findMany();
      expect(recipes.some((x) => x.name === createResponseRecipe.name)).true;

      // Get all recipes from user
      const { body: getListRes } = await request(app.getHttpServer())
        .get(`/api/recipes?search=${createResponse.email}`)
        .set("x-auth", token)
        .expect(200);
      expect(getListRes.length).equal(2);
      const { body: getListRes1 } = await request(app.getHttpServer())
        .get(`/api/recipes?search=${"email@email"}`)
        .set("x-auth", token)
        .expect(200);
      expect(getListRes1.length).equal(0);

      // Successfully update recipe
      const { body: updateResponse } = await request(app.getHttpServer())
        .patch(`/api/recipes/${createResponseRecipe.id}`)
        .send({
          name: "lunch",
        })
        .set("x-auth", token)
        .expect(200);

      expect(updateResponse.name).equal("lunch");
      expect(updateResponse.description).equal(updateResponse.description);
      expect(updateResponse.owner).equal(createResponseRecipe.owner);

      // Get the newly created recipe
      const { body: getResponse } = await request(app.getHttpServer())
        .get(`/api/recipes/${createResponseRecipe.id}`)
        .set("x-auth", token)
        .expect(200);
      expect(getResponse.name).equal("lunch");

      // Get the missing ingredients from a recipe from user that has the ingredients
      const { body: getResponseMissingIngredients } = await request(
        app.getHttpServer()
      )
        .get(
          `/api/recipes/${recipes[0].id}/missing-ingredients?email=test-user-1@panenco.com`
        )
        .set("x-auth", token)
        .expect(200);
      expect(getResponseMissingIngredients.length).equal(0);

      // Get the missing ingredients from a recipe from user that does not have the ingredients
      const { body: getResponseMissingIngredients1 } = await request(
        app.getHttpServer()
      )
        .get(
          `/api/recipes/${recipes[0].id}/missing-ingredients?email=test-user-2@panenco.com`
        )
        .set("x-auth", token)
        .expect(200);
      expect(getResponseMissingIngredients1.length).equal(1);

      // Delete the recipe
      await request(app.getHttpServer())
        .delete(`/api/recipes/${createResponseRecipe.id}`)
        .set("x-auth", token)
        .expect(204);

      // Verify recipe is deleted
      const { body: getNoneResponse } = await request(app.getHttpServer())
        .get(`/api/recipes/${createResponseRecipe.id}`)
        .set("x-auth", token)
        .expect(404);
    });
  });
});
