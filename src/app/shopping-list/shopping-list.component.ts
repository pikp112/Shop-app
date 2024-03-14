import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { LoggingService } from '../logging.service';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css'
})

export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ingredients : Ingredient[]}>; // recommended because you use a Subject and should be stored in a property
  private igChangeSubscription: Subscription;

  constructor(private slService: ShoppingListService, 
              private loggingService: LoggingService,
              private store: Store<{shoppingList: {ingredients: Ingredient[]}}>) {}

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');  // select is a method that allows you to select a slice of the store

    // this.ingredients = this.slService.getIngredients();
    // this.igChangeSubscription = this.slService.ingredientsChanged // recommended because you use a Subject and should be stored in a property
    // .subscribe(
    //   (ingredients: Ingredient[]) => { this.ingredients = ingredients; }
    // );
    // this.loggingService.printLog('Hello from ShoppingListComponent ngOnInit');
  }

  ngOnDestroy(): void {
    this.igChangeSubscription.unsubscribe();  //recommended because you use a Subject, not an EventEmitter (which is automatically unsubscribed)
  }

  onEditItem(index: number) {
    this.slService.startedEditing.next(index);
  }
}
