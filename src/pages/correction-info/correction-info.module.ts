import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CorrectionInfoPage } from './correction-info';

@NgModule({
  declarations: [
    CorrectionInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(CorrectionInfoPage),
  ],
})
export class CorrectionInfoPageModule {}
