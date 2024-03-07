import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const appRoutes : Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full'},
    { 
        path: 'recipes',     // this lazy loading is to load the recipes module only when the user navigates to the recipes page
        loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule)
    },
    { 
        path: 'shopping-list', 
        loadChildren: () => import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule)
    },
    { 
        path: 'auth', 
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    }
];

//How it's working lazy loading?
// when the user navigates to the recipes page, the recipes module will be loaded and the recipes-routing.module.ts will be executed

@NgModule({
    imports: [ RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules}) ], // preloadingStrategy: PreloadAllModules is to load all the lazy loading modules in the background
    exports: [ RouterModule ]
})
export class AppRoutingModule { }