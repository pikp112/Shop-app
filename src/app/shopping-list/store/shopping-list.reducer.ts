import { Action, createReducer } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

export interface AppState{
    shoppingList: State;
}

export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

const initialState : State = { 
    ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
    ],
    editedIngredient: null,
    editedIngredientIndex: -1 
};

export function shoppingListReducer( state : State = initialState, action : ShoppingListActions.ShoppingListActions){ 
    switch(action.type){
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,  // YOU MUST NOT MUTATE THE STATE, YOU MUST RETURN A NEW STATE because of the immutability of the state (NEVER toch the existing state) -> we copy the state operator
                ingredients: [...state.ingredients, action.payload]
            };
        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,  // Recommended to always keep the old state
                ingredients: [...state.ingredients, ...action.payload] // we spread the old ingredients and then we spread the new ingredients
            };
        case ShoppingListActions.UPDATE_INGREDIENT:
            const ingredient = state.ingredients[state.editedIngredientIndex];
            const updatedIngredient = {
                ...ingredient, // we copy the old ingredient
                ...action.payload // we overwrite the old ingredient with the new ingredient
            };
            const ingredients = [...state.ingredients]; // we copy the old ingredients
            ingredients[state.editedIngredientIndex] = updatedIngredient; // we overwrite the old ingredient with the new ingredient
            return {
                ...state,
                ingredients: ingredients,
                editedIngredient: null,
                editedIngredientIndex: -1
            };
        case ShoppingListActions.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter((ingredient, ingredientIndex) => {
                    return ingredientIndex !== state.editedIngredientIndex;
                })
            };
        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedIngredientIndex: action.payload,
                editedIngredient: {...state.ingredients[action.payload]}
            };
        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1
            };
        default:
            return state;
    }
};