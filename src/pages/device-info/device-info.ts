import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeviceModel } from '../../providers/device-model';

import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-device-info',
  templateUrl: 'device-info.html',
})
export class DeviceInfoPage {
  device: DeviceModel;
  lastUpdateString: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.device = navParams.get('item');
    this.lastUpdateString = moment(this.device.lastSeen).locale('ru').fromNow();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeviceInfoPage');
  }

}
