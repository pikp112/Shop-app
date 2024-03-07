import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RecipesComponent } from "./recipes.component";
import { AuthGuard } from "../auth/auth.guard";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipesResolverService } from "./recipes-resolver.service";

const routes: Routes = [
    { path: '', // because we are using lazy loading, we don't need to use /recipes here
    component: RecipesComponent, // not enought to put here but also in the declarations array in the recipes.module.ts (also in the exports array)
    canActivate: [AuthGuard], // this is an array of guards that we want to apply to this route
    children :[
        { path: '', component: RecipeStartComponent, pathMatch: 'full' }, // no reason to add component into the export recipes.module.ts because we are not using it anywhere else
        { path: 'new', component: RecipeEditComponent},
        { path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverService]}, // resolve will run before the component is loaded and it will fetch the data
        { path: ':id/edit', component: RecipeEditComponent, resolve: [RecipesResolverService]}
    ]}
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class RecipesRoutingModule{}