import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  substcription: Subscription;
  
  constructor(private recipeService: RecipeService,
              private route : ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>){ }

  ngOnInit(){
    //this.substcription = this.recipeService.recipesChanged
    this.substcription = this.store.select('recipes')
    .pipe(
      map(recipesState => recipesState.recipes))  
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipes = recipes;
        }
      );
    //this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe(){
    this.router.navigate(['new'], {relativeTo: this.route}); // relativeTo is used to navigate to the current route with new like relative path
  }

  ngOnDestroy(){
    this.substcription.unsubscribe();
  }
}
