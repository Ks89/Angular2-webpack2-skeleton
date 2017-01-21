import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './lazy.routes';
import { LazyComponent } from './lazy.component';

console.log('`Lazy` bundle loaded asynchronously');

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    LazyComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class LazyModule {
  public static routes = routes;
}