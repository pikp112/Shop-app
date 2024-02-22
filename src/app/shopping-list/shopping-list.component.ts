import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css'
})

export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private igChangeSubscription: Subscription;

  constructor(private slService: ShoppingListService) {}

  ngOnInit() {
    this.ingredients = this.slService.getIngredients();
    this.igChangeSubscription = this.slService.ingredientsChanged // recommended because you use a Subject and should be stored in a property
    .subscribe(
      (ingredients: Ingredient[]) => { this.ingredients = ingredients; }
    );
  }

  ngOnDestroy(): void {
    this.igChangeSubscription.unsubscribe();  //recommended because you use a Subject, not an EventEmitter (which is automatically unsubscribed)
  }

  onEditItem(index: number) {
    this.slService.startedEditing.next(index);
  }
}
