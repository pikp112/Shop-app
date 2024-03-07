import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs/internal/Observable";
import { AuthService } from "./auth.service";
import { map, take } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {  // the goal of this auth guard is to protect the recipes route from unauthorized access
    constructor(private authService: AuthService, private router: Router) { }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
        return this.authService.user.pipe(
            take(1), // this will take the latest user and then it will automatically unsubscribe
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