import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.css'
})
export class ShoppingEditComponent implements OnInit, OnDestroy{
  @ViewChild('f') slForm: NgForm; // get access to the form using ViewChild
  substription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(private store : Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.substription = this.store.select('shoppingList')
    .subscribe(stateData => {
      const index = stateData.editIndex;
      if (index > -1) {
        this.editMode = true;
        this.editedItem = stateData.ingredients[index];
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    });
    // this.substription = this.slService.startedEditing
    // .subscribe(
    //   (index: number) => {
    //     this.editMode = true;
    //     this.editedItemIndex = index;
    //     this.editedItem = this.slService.getIngredient(index);
    //     this.slForm.setValue({  // populate the form with the selected item
    //       name: this.editedItem.name,
    //       amount: this.editedItem.amount
    //     });

    //     console.log('Edited item' + index);
    //   }
    // );
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      //this.slService.updateIngredient(this.editedItemIndex, newIngredient);
      this.store.dispatch( ShoppingListActions.updateIngredient({ingredient: newIngredient}));
    } else {
      //this.slService.addIngredient(newIngredient);
      this.store.dispatch( ShoppingListActions.addIngredient({ingredient:newIngredient})); // in this way we dispatch the action to the store and the reducer will handle the action
    }
    this.editMode = false;
    form.reset();
  }

  ngOnDestroy(): void {
    this.substription.unsubscribe(); // clean up the subscription
    this.store.dispatch( ShoppingListActions.stopEdit()); 
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch( ShoppingListActions.stopEdit()); // why? because we want to reset the form
  }

  onDelete() {
    //this.slService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch( ShoppingListActions.deleteIngredient());
    this.onClear();
  }
}
