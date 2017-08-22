import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { D3Module } from 'ngd3';

import { SharedModule } from './shared/shared.module';
import { BarChartsComponent } from './bar-charts/bar-charts.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    BarChartsComponent
  ],
  imports: [
    BrowserModule,
    D3Module,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
