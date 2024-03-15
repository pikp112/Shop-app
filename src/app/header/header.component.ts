import { Component, OnDestroy, OnInit } from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";
import { AuthService } from "../auth/auth.service";
import { Subscription, map } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{
    private userSub: Subscription;
    isAuthenticated = false;

    constructor(private dataStorageService: DataStorageService, private authService: AuthService, private store: Store<fromApp.AppState>) {}
    
    ngOnInit() {
        this.userSub = this.store.select('auth')
        .pipe(
            map(authState => authState.user)) // we are transforming the user object into a boolean value
        .subscribe(user => {
            this.isAuthenticated = !!user; // this is a trick to convert the user object to a boolean (if it is null, it will be false, if it is not null, it will be true)
            console.log(!user);
            console.log(!!user);
        });
    }

    onSaveData(){
        this.dataStorageService.storeRecipes();
    }

    onFetchData(){
        this.dataStorageService.fetchRecipes().subscribe();
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
    onLogout() {
        //this.authService.logout();
        this.store.dispatch(new AuthActions.Logout());
    }
}