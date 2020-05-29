import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeviceModel } from '../../providers/device-model';

@IonicPage()
@Component({
  selector: 'page-device-info',
  templateUrl: 'device-info.html',
})
export class DeviceInfoPage {
  device: DeviceModel;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.device = navParams.get('item');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeviceInfoPage');
  }

}
