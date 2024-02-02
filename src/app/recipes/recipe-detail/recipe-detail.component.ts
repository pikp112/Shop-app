import { Component, EventEmitter } from '@angular/core';
import { Recipe } from '../recipe.model';
import { Ingredient } from '../../shared/ingredient.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css'
})
export class RecipeDetailComponent {
  recipe: Recipe;
  id : number;

  constructor(private recipeService : RecipeService,
              private route : ActivatedRoute,
              private router: Router){}


  ngOnInit(){
    // this.id = +this.route.snapshot.params['id']; // this is not reactive
    this.route.params.subscribe(
      (params) => {
        this.id = +params['id'];
        this.recipe = this.recipeService.getRecipe(this.id);
      }
    );
  }

  onAddToShoppingList(){
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.route}); // working fine
    // this.router.navigate(['../', this.id, 'edit', {relativeTo: this.route}]); // working fine also
}
}