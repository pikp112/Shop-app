import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
  providers: [RecipeService]
})
export class RecipesComponent implements OnInit, OnDestroy{

  constructor() {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
