import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";

export interface AuthResposeData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    kind: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'}) // recommended to use providedIn instead of adding the service to the providers array in the app.module.ts
export class AuthService implements OnInit{
    user = new BehaviorSubject<User>(null); // this is a special type of Subject, it will hold the user object and will always emit the latest value to all its subscribers
            // give acces to the latest user object emitted by the user subject
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) { }
    ngOnInit() { }

    signup(email: string, password: string) {
        return this.http.post<AuthResposeData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCg7rw6YUra3OHzVziAjFd42pcZ_9dKKPw',
        {
            email: email,
            password: password,
            returnSecureToken: true
        }
      )
      .pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }));
    };

    login(email: string, password: string){
        return this.http.post<AuthResposeData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCg7rw6YUra3OHzVziAjFd42pcZ_9dKKPw',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
    )
    .pipe(catchError(this.handleError), tap(resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }));
    }

    logout() {
        this.user.next(null); // we are setting the user subject to null so that all the subscribers will be notified that the user has been logged out
        this.router.navigate(['/auth']);
        //localStorage.clear(); // we are clearing the local storage but we can also use the removeItem method to remove only the user data
        localStorage.removeItem('userData'); // we are removing the user data from the local storage
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number){ // the goal it's to logout the user after the token expires
        console.log(expirationDuration);
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    autoLogin(){  // the goal it's to retrieve data from local storage and check if the token is still valid
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        if (loadedUser.token) { // we are checking if the token is still valid by comparing the expiration date with the current date
            this.user.next(loadedUser);
            this.autoLogout(new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()); // we are calculating the remaining time until the token expires
        }
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number){
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user)); // we are storing the user data in the local storage
    }

    private handleError(errorRes: HttpErrorResponse){
        let errorMessage = 'An unknown error occurred!';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
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
        return throwError(errorMessage);
    }
} 