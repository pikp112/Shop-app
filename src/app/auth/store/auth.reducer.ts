import { User } from "../user.model";
import * as AuthActions from './auth.actions';

export interface State{
    user: User;
    authError : string;
    loading: boolean;
}

const initialState : State = {
    user: null,
    authError: null,
    loading: false
};

export function authReducer(state = initialState, action : AuthActions.AuthActions){
    switch(action.type){
        case AuthActions.AUTHENTICATE_SUCCES:
            const user = new User(    // the values come from the payload property of the action
                action.payload.email, // we are using the payload property to access the data that we passed to the action
                action.payload.userId, 
                action.payload.token,
                action.payload.expirationDate
            );
            return {
                ...state,
                authError: null,
                user: user,
                loading: false
            };
        case AuthActions.LOGOUT:
            return {
                ...state,
                user: null
            };
        case AuthActions.LOGIN_START:
        case AuthActions.SIGNUP_START:
            return {
                ...state,
                authError: null,
                loading: true
            };
        case AuthActions.AUTHENTICATE_FAIL:
            return {
                ...state,
                user: null,
                authError: action.payload,
                loading: false
            };
        case AuthActions.CLEAR_ERROR:
            return {
                ...state,
                authError: null
            };
        default:
            return state;
    }
}