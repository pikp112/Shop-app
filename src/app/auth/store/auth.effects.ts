import { Actions, createEffect, ofType,  } from "@ngrx/effects";
import { catchError, ignoreElements, map, switchMap, tap } from "rxjs/operators";
import * as AuthActions from "./auth.actions";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs/internal/observable/of";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../user.model";
import { AuthService } from "../auth.service";

export interface AuthResposeData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    kind: string;
    registered?: boolean;
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));

    return new AuthActions.AuthenticateSuccess({
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate
    })
};

const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
        return of(new AuthActions.AuthenticateFail(errorMessage)); // we need to return a new observable, we can use the of() function to create a new observable that will emit data immediately
    }
    switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = 'This email already exists!';
            break;
        case 'OPERATION_NOT_ALLOWED':
            errorMessage = 'Password sign-in is disabled for this project';
            break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
            errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
            break;
    }
    return of( new AuthActions.AuthenticateFail(errorMessage)); 

};

@Injectable()
export class AuthEffects {
    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {}

    authSignup = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.SIGNUP_START),
            switchMap((signupAction: AuthActions.SignupStart) => {
                return this.http
                    .post<AuthResposeData>(
                        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCg7rw6YUra3OHzVziAjFd42pcZ_9dKKPw',
                    {
                        email: signupAction.payload.email,
                        password: signupAction.payload.password,
                        returnSecureToken: true
                    })
                    .pipe(
                        tap(resData => {
                            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                        }),
                        map(resData => {
                            return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
                            }),
                        catchError(errorRes => {  // this is to handle errors from THE INTERNAL OBSERVABLE (hhtp.post), not from the general one (actions$)
                            return handleError(errorRes);
                        }));
            })
        )
    });

    authLogin = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.LOGIN_START), // it's a filter that only allows actions of a certain type to continue
            switchMap((authData: AuthActions.LoginStart, ) => {   // allows us to create a new observable, based on the old observable
                return this.http
                .post<AuthResposeData>(
                    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCg7rw6YUra3OHzVziAjFd42pcZ_9dKKPw',
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }).pipe(
                    tap(resData => {
                        this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                    }),
                    map(resData => {
                        return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
                        }),
                    catchError(errorRes => {  // this is to handle errors from THE INTERNAL OBSERVABLE (hhtp.post), not from the general one (actions$)
                        return handleError(errorRes);
                    }));
            }));
    });

    authRedirect = createEffect(() => {
        return this.actions$.pipe(
          ofType(AuthActions.AUTHENTICATE_FAIL),
          tap(() => {
            this.router.navigate(['/']);
          })
        )
      }, {dispatch : false});// this is to tell ngrx that we don't want to dispatch a new action at the end of this effect

      autologout = createEffect(() => {
        return this.actions$.pipe(
          ofType(AuthActions.LOGOUT),
          tap(() => {
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
          }),
          ignoreElements() // Ignore events and return an observable that never emits
        );
      }, { dispatch: false });

      autoLogin = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.AUTO_LOGIN),
            switchMap(() => {
            const userData: {
                email: string;
                id: string;
                _token: string;
                _tokenExpirationDate: string;
            } = JSON.parse(localStorage.getItem('userData'));
            if (!userData) {
                return of({ type: 'DUMMY' });
            }
            const loadedUser = new User(
                userData.email,
                userData.id,
                userData._token,
                new Date(userData._tokenExpirationDate)
            );
            if (loadedUser.token) {
                this.authService.setLogoutTimer(
                new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
                );
                return of(
                new AuthActions.AuthenticateSuccess({
                    email: userData.email,
                    userId: userData.id,
                    token: userData._token,
                    expirationDate: new Date(userData._tokenExpirationDate),
                })
                );
            }
            return of({ type: 'DUMMY' });
            })
        )
    );
}