import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScratchPadComponent } from './scratch-pad/scratch-pad.component';
import { ViewerComponent } from './viewer/viewer.component';
import { Tower3dModelComponent } from './tower3d-model/tower3d-model.component';

@NgModule({
  declarations: [
    AppComponent,
    ScratchPadComponent,
    ViewerComponent,
    Tower3dModelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
