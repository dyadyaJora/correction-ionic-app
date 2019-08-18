import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth';
import { RequestsProvider } from '../../providers/requests';
import { SanTestFinishPage } from '../san-test-finish/san-test-finish';

import * as san from '../../lib/dist/psy_san.js';

@Component({
  selector: 'page-san-test',
  templateUrl: 'san-test.html',
})
export class SanTestPage {
  points: Array<number> = [];
  results: any = {};
  data: Array<any> = [];
  len: number = 7;
  load: any;
  alert: any;
  modal: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public req: RequestsProvider,
    public auth: AuthProvider,
    public ac: AlertController,
    public lc: LoadingController,
    public mc: ModalController
  ) {
    let borderVal = Math.floor(this.len/2);
    for (let i = -borderVal; i <= +borderVal; i++) {
      this.points.push(i);
    }

    this.data = san.getTestValues();

    this.data.forEach(item => {
      this.results[item.id] = 0;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SanTestPage');
  }

  send() {
    this._createLoad();
    this.load.present();
    this.req.postSan(this.results, this.auth.token)
      .subscribe(
        data => {
          let res = san.calcResults(this.results);
          let resStr = {};
          res.diff.s += 40;
          res.diff.a += 40;
          res.diff.n += 40;
          resStr['s'] = san.checkResult(res.diff.s);
          resStr['a'] = san.checkResult(res.diff.a);
          resStr['n'] = san.checkResult(res.diff.n);

          this.load.dismiss();

          this._createModal(res, resStr, data.data.id);
          this.modal.present();
        },
        err => {
          this.load.dismiss();
          // popup with error
          this._createAlert();
          this.alert.present();
        }
      );
  }

  _createModal(res, resStr, id) {
    this.modal = this.mc.create(SanTestFinishPage, {
      points: res.diff,
      strs: resStr,
      id: id
    });
    this.modal.onDidDismiss(() => {
      this.navCtrl.popToRoot();
    });
  }

  _createAlert() {
    this.alert = this.ac.create({
      title: 'Ошибка!',
      subTitle: 'Произошла ошибка во время подсчета результатов',
      buttons: ['OK']
    });
  }

  _createLoad() {
    this.load = this.lc.create({
      content: 'Завершение тестирования...',
    });
  }

  triggerClick(event) {
    console.log(event.target);
  }

}
