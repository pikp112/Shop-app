import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, exhaustMap, take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('Request is on its way');
        return this.authService.user.pipe(
            take(1), // take(1) will take the latest user and then automatically unsubscribe
            exhaustMap(user => { // exhaustMap waits for the first observable to complete and then replaces it with the second observable (in this case, the observable returned by the pipe method)
                if (!user) {
                    return next.handle(req); // if there is no user, we don't want to modify the request
                }
                const modifiedReq = req.clone({params: req.params.set('auth', user.token)}); // we can clone the request and modify it before sending it
                return next.handle(modifiedReq); // in this way we can return the observable and subscribe to it in the component
            })); 
    }
}