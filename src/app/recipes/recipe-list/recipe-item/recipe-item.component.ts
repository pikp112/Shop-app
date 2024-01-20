import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Recipe } from '../../recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrl: './recipe-item.component.css'
})
export class RecipeItemComponent {
  @Input('recipeItem') recipe: Recipe;
  @Output() recipeSelected = new EventEmitter<void>();

  constructor() { }

  onRecipeSelected(){
    this.recipeSelected.emit();
  }
}