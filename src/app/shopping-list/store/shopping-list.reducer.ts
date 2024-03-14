import { Action, createReducer } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

const initialState = { 
    ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ] };

export function shoppingListReducer( state = initialState, action : ShoppingListActions.AddIngredient){ 
    switch(action.type){
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,  // YOU MUST NOT MUTATE THE STATE, YOU MUST RETURN A NEW STATE because of the immutability of the state (NEVER toch the existing state) -> we copy the state operator
                ingredients: [...state.ingredients, action.payload]
            };
        default:
            return state;
    }
};