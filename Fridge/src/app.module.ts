import { Module } from "@nestjs/common";
import { UserController } from "./controllers/users/user.controller";
import { AuthController } from "./controllers/auth/auth.controller";
import { RecipeController } from "./controllers/recipes/recipe.controller";
import { FridgeController } from "./controllers/fridges/fridge.controller";
import { ProductController } from "./controllers/products/product.controller";

@Module({
	controllers: [UserController, AuthController, RecipeController, FridgeController, ProductController],
})
export class AppModule {}