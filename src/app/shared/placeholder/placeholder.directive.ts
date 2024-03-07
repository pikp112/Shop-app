import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[appPlaceholder]'
})
export class PlaceHolderDirective {
    constructor(public viewContainerRef : ViewContainerRef) { // this gives us access to the place where this directive is being used
        
    }
}