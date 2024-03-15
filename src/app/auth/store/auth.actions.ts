import { Action } from "@ngrx/store";

export const LOGIN_START = '[Auth] Login Start';
export const AUTHENTICATE_SUCCES = '[Auth] Login'; // this is a convention to name the action type, it's a string that describes the action in square brackets
export const AUTHENTICATE_FAIL = '[Auth] Login Fail';
export const LOGOUT = '[Auth] Logout';
export const SIGNUP_START = '[Auth] Signup Start';
export const SIGNUP = '[Auth] Signup';
export const CLEAR_ERROR = '[Auth] Clear Error';
export const AUTO_LOGIN = '[Auth] Auto Login';

export class AuthenticateSuccess implements Action {
    readonly type = AUTHENTICATE_SUCCES;

    constructor(public payload: {
        email: string,
        userId: string,
        token: string,
        expirationDate: Date
    }) {}
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class LoginStart implements Action {
    readonly type = LOGIN_START;
    constructor(public payload: {email: string, password: string}) {}
}

export class AuthenticateFail implements Action {
    readonly type = AUTHENTICATE_FAIL;
    constructor(public payload: string) {}
}

export class SignupStart implements Action {
    readonly type = SIGNUP_START;
    constructor(public payload: {email: string, password: string}) {}
}

export class Signup implements Action {
    readonly type = SIGNUP;
}

export class ClearError implements Action {
    readonly type = CLEAR_ERROR;
}

export class AutoLogin implements Action {
    readonly type = AUTO_LOGIN;
}

export type AuthActions = // this is a union type, it means that the AuthActions type can be either a Login or a Logout action
    | LoginStart
    | AuthenticateFail
    | AuthenticateSuccess 
    | Logout
    | SignupStart
    | Signup
    | ClearError
    | AutoLogin; 