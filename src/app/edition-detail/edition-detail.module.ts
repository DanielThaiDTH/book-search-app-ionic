import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditionDetailPageRoutingModule } from './edition-detail-routing.module';

import { EditionDetailPage } from './edition-detail.page';
import { NullStringPipe } from '../null-string.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditionDetailPageRoutingModule
  ],
  declarations: [EditionDetailPage, NullStringPipe]
})
export class EditionDetailPageModule {}
