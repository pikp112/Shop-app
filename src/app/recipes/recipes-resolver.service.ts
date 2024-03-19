import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";
import { RecipeService } from "./recipe.service";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipes.actions';
import { Actions, ofType } from "@ngrx/effects";
import { map, of, switchMap, take } from "rxjs";

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<{recipes: Recipe[]}>{ //resolve it's a generic type that will resolve the type of data that we are fetching
    constructor(private recipeService: RecipeService,
                private store: Store<fromApp.AppState>,
                private actions$: Actions){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const recipes = this.recipeService.getRecipes();
            //return this.dataStorageService.fetchRecipes();
        return this.store.select('recipes').pipe(
            take(1),
            map(recipesState => {
                return recipesState.recipes;
            }),
            switchMap(recipes => {
                if(recipes.length === 0){
                    this.store.dispatch( RecipesActions.fetchRecipes());
                    return this.actions$.pipe(ofType(RecipesActions.setRecipes), 
                        take(1));
                } else {
                    return of({recipes});
                }
            }));
    }
}