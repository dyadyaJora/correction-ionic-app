import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';

import { SimpleTestFinishPage } from '../simple-test-finish/simple-test-finish';

@Component({
  selector: 'page-simple-test',
  templateUrl: 'simple-test.html',
})
export class SimpleTestPage {

  deltaE: number = 0.1;
  isRunning: boolean = false;
  startedTime: number;
  alert: any;
  alertPause: any;
  timer: any;
  lastClicked: Array<number> = new Array(3);
  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public lc: LoadingController, public mc: ModalController) {

    this.alert = this.alertCtrl.create({
      title: 'Начать прохождение теста?',
      buttons: [
        {
          text: 'Да',
          handler: () => {
            this._onRun();
          }
        },
        {
          text: 'Отмена',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
  }

  ionViewDidLoad() {

    this.alert.present();
  }

  ionViewCanLeave(): boolean{
    return !this.isRunning;
  }

  onPause() {
    this.isRunning = false;
    clearInterval(this.timer);

    this.alertPause = this.alertCtrl.create({
      title: 'Пауза',
      subTitle: 'Продолжить выполнение тестирования?',
      buttons: [
        {
          text: 'Продолжить',
          role: 'cancel',
          handler: () => {
            this.isRunning = true;
          }
        },
        {
          text: 'Завершить',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });

    this.alertPause.present();
  }

  onFirstClick() {

  }

  onSecondClick() {

  }

  onThirdClick() {

  }

  _onRun() {
    this.isRunning = true;
    this.startedTime = (new Date()).getTime();

    this.timer = setInterval(() => {
      this._onEnd();
    }, 6000);
  }

  _onResume() {
  }

  _onEnd() {
    clearInterval(this.timer);
    this.isRunning = false;

    let load = this.lc.create({
      content: 'Завершение тестирования...',
      duration: 2000
    });

    load.present();

    let modal = this.mc.create(SimpleTestFinishPage, {
      errors: 49,
      right: 60,
      lost: 15
    });

    modal.onDidDismiss(() => {
      this.navCtrl.popToRoot();
    });
    modal.present();

  }
}
