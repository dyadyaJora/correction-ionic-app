import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CorrectionsPage } from './corrections';

@NgModule({
  declarations: [
    CorrectionsPage,
  ],
  imports: [
    IonicPageModule.forChild(CorrectionsPage),
  ],
})
export class CorrectionsPageModule {}
