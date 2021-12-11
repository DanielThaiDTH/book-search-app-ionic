import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'work-detail',
    loadChildren: () => import('./work-detail/work-detail.module').then( m => m.WorkDetailPageModule)
  },
  {
    path: 'edition-list',
    loadChildren: () => import('./edition-list/edition-list.module').then( m => m.EditionListPageModule)
  },
  {
    path: 'edition-detail',
    loadChildren: () => import('./edition-detail/edition-detail.module').then( m => m.EditionDetailPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
