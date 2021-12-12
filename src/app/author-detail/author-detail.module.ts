import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthorDetailPageRoutingModule } from './author-detail-routing.module';

import { AuthorDetailPage } from './author-detail.page';
import { NullStringPipe } from '../null-string.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthorDetailPageRoutingModule
  ],
  declarations: [AuthorDetailPage, NullStringPipe]
})
export class AuthorDetailPageModule {}
