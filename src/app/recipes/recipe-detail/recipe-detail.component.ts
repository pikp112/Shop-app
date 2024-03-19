import { Component, EventEmitter } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import * as RecipesActions from '../store/recipes.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css'
})
export class RecipeDetailComponent {
  recipe: Recipe;
  id : number;

  constructor(private route : ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>){}


  ngOnInit(){
    // this.id = +this.route.snapshot.params['id']; // this is not reactive
    this.route.params
    .pipe(map(params => {
      return +params['id'];
    }), switchMap(id => {
      this.id = id;
      return this.store.select('recipes')
    }),
    map(recipesState => {
      return recipesState.recipes.find((recipe, index) => {
        return index === this.id;
      });
    }))
    .subscribe(recipe => {
      this.recipe = recipe;
    });
  }

  onAddToShoppingList(){
    //this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.store.dispatch( ShoppingListActions.addIngredients({ingredients : this.recipe.ingredients}));
  }

  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.route}); // working fine
    // this.router.navigate(['../', this.id, 'edit', {relativeTo: this.route}]); // working fine also
  }

  onDeleteRecipe(){
    //this.recipeService.deleteRecipe(this.id);
    this.store.dispatch( RecipesActions.deleteRecipe({index: this.id}));
    this.router.navigate(['/recipes']);
  }
}