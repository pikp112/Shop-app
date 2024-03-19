import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs/internal/Observable";
import { Router } from "@angular/router";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceHolderDirective } from "../shared/placeholder/placeholder.directive";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    @ViewChild(PlaceHolderDirective, {static: false}) alertHost: PlaceHolderDirective;

    private closeSub: Subscription;
    private storeSub: Subscription;

    constructor(private authService: AuthService, 
        private router: Router, 
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<fromApp.AppState>) { }
    
    ngOnInit() {
        this.storeSub = this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading;
            this.error = authState.authError;
            if (this.error) {
                this.showErrorAlert(this.error);
            } 
        });
    }
    onSwithMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form : NgForm) {
        if (!form.valid) {
            return;
        }
        const email = form.value.email;
        const password = form.value.password;
        //this.isLoading = true;
        //let authObs: Observable<AuthResposeData>;

        if (this.isLoginMode) {
            //authObs = this.authService.login(email, password);
            this.store.dispatch( AuthActions.loginStart({email: email, password: password}));
        } else {
            // authObs = this.authService.signup(email, password);
            this.store.dispatch( AuthActions.signupStart({email: email, password: password}));
        }



        // authObs.subscribe(
        //     resData => {
        //         console.log(resData);
        //         this.isLoading = false;
        //         this.router.navigate(['/recipes']); // because we are using the same component for login and signup, we can use the same component to navigate to the recipes page
        //     },
        //     error => {
        //         console.log(error);
        //         this.error = error;
        //         this.showErrorAlert(error);
        //         this.isLoading = false;
        //     }
        // );
        form.reset();
    }
    
    onHandleError() {
        //this.error = null;
        this.store.dispatch( AuthActions.clearError());
    }

    ngOnDestroy() {
        if (this.closeSub) {
            this.closeSub.unsubscribe();
        }

        if (this.storeSub) {
            this.storeSub.unsubscribe();
        }
    }

    private showErrorAlert(message: string) { //this is dinamically programatically creating a new component
        //const alertComp = new AlertComponent(); // this is not the way to create a new component by Angular, WILL NOT WORK
        const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear(); // this is to clear any other components that might be there before we create a new one (if we have an error, we want to clear the previous error before showing the new one)
        
        const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);

        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        });
    }
}