import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import { LoggingService } from './logging.service';
import { shoppingListReducer } from './shopping-list/store/shopping-list.reducer';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, // crucial for using HttpClient
    SharedModule, // not provide services here, only components, directives, and pipes
    CoreModule // only provide services here
    StoreModule.forRoot({shoppingList: shoppingListReducer}) // this is the structure of the store (key - value pair, key is the name of the slice of the store, value is the reducer that manages this slice of the store)
  ],
  //providers: [LoggingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
