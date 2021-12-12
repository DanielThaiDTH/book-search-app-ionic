import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ByAuthorPageRoutingModule } from './by-author-routing.module';

import { ByAuthorPage } from './by-author.page';
import { NullStringPipe } from '../null-string.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ByAuthorPageRoutingModule
  ],
  declarations: [ByAuthorPage, NullStringPipe]
})
export class ByAuthorPageModule {}
