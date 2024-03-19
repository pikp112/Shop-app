import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as RecipesActions from './recipes.actions';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipe.model';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipesEffects {
    constructor(private actions$ : Actions, private http: HttpClient, private store: Store<fromApp.AppState>){}

    fetchRecipes$ = createEffect(() => 
    this.actions$.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(() => 
            this.http.get<Recipe[]>(
                'https://ng-recipe-book-c2ae2-default-rtdb.firebaseio.com/recipes.json'
            )
        ),
        map(recipes => 
            recipes.map(recipe => ({
                ...recipe,
                ingredients: recipe.ingredients ? recipe.ingredients : []
            }))
        ),
        map(recipes => new RecipesActions.SetRecipes(recipes))
    )
    );

    storeRecipes$ = createEffect(() => this.actions$.pipe(
        ofType(RecipesActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipesState]) => { // this is a destructuring array (and means that we are only interested in the second element of the array)
            return this.http.put(
                'https://ng-recipe-book-c2ae2-default-rtdb.firebaseio.com/recipes.json',
                recipesState.recipes
            );
        })
    ), {dispatch: false}); // we don't need to dispatch an action here

}