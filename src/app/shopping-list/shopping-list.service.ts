import { EventEmitter, Injectable } from "@angular/core";
import { Ingredient } from "../shared/ingredient.model";

@Injectable()

export class ShoppingListService {
    ingredientsChanged = new EventEmitter<Ingredient[]>();

    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
      ];

    getIngredients() {
        //return this.ingredients; //it's working too, but it's not a copy of the array, it's a reference to the array
        return this.ingredients.slice();
    }

    addIngredient(ingredient: Ingredient){
        this.ingredients.push(ingredient);
        this.ingredientsChanged.emit(this.ingredients.slice());
    }

    addIngredients(ingredients: Ingredient[]){
        // for(let ingredient of ingredients){
        //     this.addIngredient(ingredient);
        // } //it's working too, but it's not the best way to do it (too much event emitters)

        ingredients.forEach(ingredient => {
            let index = this.ingredients.findIndex(i => i.name === ingredient.name);
            if(index >= 0){
                this.ingredients[index].amount += ingredient.amount;
            } else {
                this.ingredients.push(ingredient);
            }
        }, this);

        this.ingredientsChanged.emit(this.ingredients.slice());
    }
}