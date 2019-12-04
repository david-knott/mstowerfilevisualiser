import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScratchPadComponent } from './scratch-pad/scratch-pad.component'
import { ViewerComponent } from './viewer/viewer.component'
import { Tower3dModelComponent } from './tower3d-model/tower3d-model.component';

const routes: Routes = [
    {
        path: 'old',
        component: ScratchPadComponent
    },
{
        path: '',
        component: Tower3dModelComponent 
    },
    {
        path: 'viewer',
        component: ViewerComponent
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
