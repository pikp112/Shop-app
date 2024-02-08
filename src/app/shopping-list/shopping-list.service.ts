import { Ingredient } from "../shared/ingredient.model";
import { Subject } from "rxjs";

export class ShoppingListService {
    ingredientsChanged = new Subject<Ingredient[]>(); // subject is an observable and an observer at the same time

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
        this.ingredientsChanged.next(this.ingredients.slice());  // next because it's a subject instead of emitting an event
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

        this.ingredientsChanged.next(this.ingredients.slice()); 
    }
}