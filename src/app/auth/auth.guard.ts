import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs/internal/Observable";
import { AuthService } from "./auth.service";
import { map, take } from "rxjs/operators";
import * as fromApp from '../store/app.reducer';
import { Store } from "@ngrx/store";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {  // the goal of this auth guard is to protect the recipes route from unauthorized access
    constructor(private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>) { }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
        return this.store.select('auth').pipe(
            take(1), // this will take the latest user and then it will automatically unsubscribe
            map(authState => { // we are transforming the user object into a boolean value
                return authState.user;
            }), 
            map(user => {
                const isAuth = !!user; // this will return true if the user is authenticated and false if the user is not authenticated
                if (isAuth) {
                    return true;
                }
                return this.router.createUrlTree(['/auth']); // if the user is not authenticated, we want to redirect the user to the auth page
        })) 
        // tap (isAuth => {
        //     if (!isAuth) {
        //         this.router.navigate(['/auth']);
        //     }
        // }));
    }
}