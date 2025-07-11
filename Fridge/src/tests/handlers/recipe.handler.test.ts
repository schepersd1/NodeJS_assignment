import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";

import { createRecipe } from "../../controllers/recipes/handlers/create.handler";
import { deleteRecipe } from "../../controllers/recipes/handlers/delete.handler";
import { getRecipe } from "../../controllers/recipes/handlers/get.handler";
import { getRecipeList } from "../../controllers/recipes/handlers/getList.handler";
import { getMissingIngredients } from "../../controllers/recipes/handlers/getMissingIngredients.handler";
import { updateRecipe } from "../../controllers/recipes/handlers/update.handler";

import { User } from "../../controllers/users/handlers/user.store";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { Fridge, Product, Recipe } from "@prisma/client";
import { deleteProductFromFridge } from "../../controllers/fridges/handlers/deleteProductFromFridge.handler";
import { putProductInFridge } from "../../controllers/fridges/handlers/putProductInFridge.handler";

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
    fridgeId: null,
  },
  {
    id: "1",
    size: 10,
    type: "Drink",
    owner: "test-user+2@panenco.com",
    fridgeId: null,
  },
];
const recipeFixtures: Recipe[] = [
  {
    id: "0",
    name: "Dinner",
    description: "Protein",
    owner: "test-user+1@panenco.com",
  },
];

describe("Handler tests", () => {
  describe("Recipe Tests", () => {
    let users: any[];
    let fridges: any[];
    let products: any[];
    let recipes: any[];
    beforeEach(async () => {
      // Clean up database
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
              size: fixture.size,
              type: fixture.type,
              owner: fixture.owner,
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

    it("should create recipe", async () => {
      const body = {
        id: "0",
        name: "pasta",
        description: "delicious",
        owner: "test-user+1@panenco.com",
        ingredients: [],
      };
      const res = await createRecipe(body);

      expect(res.name).equal("pasta");
      expect(res.description).equal("delicious");
      expect(res.owner).equal("test-user+1@panenco.com");
    });

    it("should delete recipe by id", async () => {
      const initialCount = await prisma.recipe.count();
      await deleteRecipe(recipes[0].id);

      const newCount = await prisma.recipe.count();
      expect(initialCount - 1).equal(newCount);
    });

    it("should fail when deleting recipe by unknown id", async () => {
      try {
        await deleteRecipe("00");
      } catch (error) {
        expect(error.message).equal("Recipe not found");
        return;
      }
      expect(true, "should have thrown an error").false;
    });

    it("should update recipe", async () => {
      const body = {
        name: "spaghetti",
      };
      const id = recipes[0].id;
      const res = await updateRecipe(id, body);

      expect(res.name).equal(body.name);
      expect(res.description).equal(recipes[0].description);
    });

    it("should fail when updating recipe by unknown id", async () => {
      try {
        await updateRecipe("00", {});
      } catch (error) {
        expect(error.message).equal("Recipe not found");
        return;
      }
      expect(true, "should have thrown an error").false;
    });

    it("should get recipe by id", async () => {
      const res = await getRecipe(recipes[0].id);

      expect(res.name).equal(recipes[0].name);
      expect(res.description).equal(recipes[0].description);
    });

    it("should fail when getting recipe by unknown id", async () => {
      try {
        await getRecipe("00");
      } catch (error) {
        expect(error.message).equal("Recipe not found");
        return;
      }
      expect(true, "should have thrown an error").false;
    });

    it("should get all recipes of a user", async () => {
      const res = await getRecipeList(users[0].email);
      expect(res.length).equal(1);
      const res1 = await getRecipeList(users[1].email);
      expect(res1.length).equal(0);
    });

    it("should get all the missing ingredients to complete a recipe based on the products of a user", async () => {
      await putProductInFridge(fridges[0].id, products[0]);
      const res = await getMissingIngredients(recipes[0].id, users[0].email);
      expect(res.length).equal(0);
      const res1 = await getMissingIngredients(recipes[0].id, users[1].email);
      expect(res1.length).equal(1);
    });
  });
});
