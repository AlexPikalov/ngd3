import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { D3CallDirective } from './d3-call.directive';
import { D3TransitionDirective } from './d3-transition.directive';

@NgModule({
  declarations: [
    AppComponent,
    D3CallDirective,
    D3TransitionDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
