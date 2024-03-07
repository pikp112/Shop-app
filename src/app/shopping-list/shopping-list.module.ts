import { NgModule } from "@angular/core";
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { LoggingService } from "../logging.service";

@NgModule({
    declarations: [
        ShoppingListComponent,
        ShoppingEditComponent,    
    ],
    imports: [
        FormsModule,
        RouterModule.forChild([
            { path: '', component: ShoppingListComponent} // we don't use the / in the path because we are already in the root path
        ]),
        SharedModule
    ]
    //providers: [LoggingService]
})
export class ShoppingListModule{}