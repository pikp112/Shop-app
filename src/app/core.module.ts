import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AuthInterceptorService } from "./auth/auth-interceptor.service";
import { RecipeService } from "./recipes/recipe.service";
import { ShoppingListService } from "./shopping-list/shopping-list.service";

@NgModule({
    providers: [ // we don't need to export these services, we only need to provide them (only directive and modules should be exported)
        ShoppingListService, 
        RecipeService, 
        {
            provide: HTTP_INTERCEPTORS, 
            useClass: AuthInterceptorService,  
            multi: true // we can use the multi property to tell Angular that we are providing multiple interceptors
        }] 
})
export class CoreModule{}