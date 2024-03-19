import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { LoggingService } from './logging.service';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  constructor(private store: Store<fromApp.AppState>, private loggingService : LoggingService) { }
  
  ngOnInit(): void {
    //this.authService.autoLogin();  
    this.store.dispatch(AuthActions.autoLogin());
    this.loggingService.printLog('Hello from AppComponent ngOnInit');
  }
}
