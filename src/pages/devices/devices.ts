import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeviceModel } from '../../providers/device-model';
import { RequestsProvider } from '../../providers/requests';
import { AuthProvider } from '../../providers/auth';
import { DeviceInfoPage } from '../device-info/device-info';

import * as moment from 'moment';

@IonicPage({
  name: 'devices-page',
  segment: 'devices'
})
@Component({
  selector: 'page-devices',
  templateUrl: 'devices.html',
})
export class DevicesPage {
  devices: Array<DeviceModel> = [];
  newDeviceId: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public requestsProvider: RequestsProvider,
    public authProvider: AuthProvider
  ) {
    this.newDeviceId = navParams.get('id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DevicesPage');
    this.requestsProvider.getDevicesMock(this.authProvider.token)
      .subscribe(data => {
        this.devices = data.map(item => {
          item['moment'] = moment(item.lastSeen).locale('ru').fromNow();
          if (item.lastSeen.getTime() < new Date().getTime() + 1 * 60 * 1000) {
            item['status'] = 'offline';
          } else {
            item['status'] = 'online'
          }
          return item;
        });
      }, err => {
        console.log("error loading devices list", err);
      });
    
    console.log(this.authProvider.storage, this.newDeviceId);
  }

  openDeviceInfo(index: number) {
    console.log(index);
    this.navCtrl.push(DeviceInfoPage, {
      item: this.devices[index]
    });
  }
}
