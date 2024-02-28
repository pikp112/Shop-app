import { HttpClient } from "@angular/common/http";
import { RecipeService } from "../recipes/recipe.service";
import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";
import { Recipe } from "../recipes/recipe.model";

@Injectable({ providedIn: 'root' }) // alternative to adding to providers[] in app.module.ts
export class DataStorageService {
    constructor(private http: HttpClient, 
                private recipeService: RecipeService) { }
    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http
            .put(
                'https://ng-recipe-book-c2ae2-default-rtdb.firebaseio.com/recipes.json',
                recipes
            )
            .subscribe(response => {
                console.log(response);
            });
    }
    fetchRecipes() {
        return this.http
            .get<Recipe[]>(
                'https://ng-recipe-book-c2ae2-default-rtdb.firebaseio.com/recipes.json'
            )
            .pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return {
                            ...recipe,
                            ingredients: recipe.ingredients ? recipe.ingredients : []
                        };
                    });
                }),
                tap(recipes => {
                    this.recipeService.setRecipes(recipes);
                })
            );
    }
}