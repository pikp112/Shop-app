import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { LoggingService } from '../logging.service';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css'
})

export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ingredients : Ingredient[]}>; // recommended because you use a Subject and should be stored in a property
  private igChangeSubscription: Subscription;

  constructor( private loggingService: LoggingService,
              private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');  // select is a method that allows you to select a slice of the store
    this.store.select('shoppingList').subscribe(); // this is how you can subscribe to the store
    
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
    //this.slService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }
}
