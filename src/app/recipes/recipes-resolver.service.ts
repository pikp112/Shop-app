import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";
import { RecipeService } from "./recipe.service";
import { DataStorageService } from "../shared/data-storage.service";

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]>{ //resolve it's a generic type that will resolve the type of data that we are fetching
    constructor(private recipeService: RecipeService,
                private dataStorageService: DataStorageService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const recipes = this.recipeService.getRecipes();
        if(recipes.length === 0){
            return this.dataStorageService.fetchRecipes();
        } else {
            return recipes;
        }
    }
}