import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScratchPadComponent } from './scratch-pad/scratch-pad.component'
import { ViewerComponent } from './viewer/viewer.component'

const routes: Routes = [
    {
        path: '',
        component: ScratchPadComponent
    },
    {
        path: 'viewer',
        component: ViewerComponent
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
