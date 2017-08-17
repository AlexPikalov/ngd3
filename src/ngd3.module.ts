import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { D3CallDirective } from './d3-call.directive';
import { D3TransitionDirective } from './d3-transition.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        D3CallDirective,
        D3CallDirective
    ]
})
export class D3Module {}
