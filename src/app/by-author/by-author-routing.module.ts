import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ByAuthorPage } from './by-author.page';

const routes: Routes = [
  {
    path: '',
    component: ByAuthorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ByAuthorPageRoutingModule {}
