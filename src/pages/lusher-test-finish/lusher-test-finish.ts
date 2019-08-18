import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth';
import { RequestsProvider } from '../../providers/requests';

@Component({
  selector: 'page-lusher-test-finish',
  templateUrl: 'lusher-test-finish.html',
})
export class LusherTestFinishPage {

  anxiety: number;
  conflict: number;
  performance: number;
  fatigue: number;

  id: string;

  sex: string;
  age: number;
  comment: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public auth: AuthProvider,
    public requests: RequestsProvider,
    public ac: AlertController
  ) {
    this.anxiety = navParams.get('anxiety');
    this.conflict = navParams.get('conflict');
    this.performance = navParams.get('performance');
    this.fatigue = navParams.get('fatigue');
    this.id = navParams.get('id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LusherTestFinishPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  send() {
    let alert;
    this.requests.postObjectMeta({
      type: 'lusher',
      id: this.id,
      meta: { sex: this.sex, age: this.age, comment: this.comment }
    }, this.auth.token)
      .subscribe(
        data => {
          alert = this.ac.create({
            title: 'Готово!',
            subTitle: 'Запрос осуществлен успешно',
            buttons: ['OK']
          });
          alert.present();
        },
        err => {
          alert = this.ac.create({
            title: 'Ошибка!',
            subTitle: 'Произошла ошибка во время передачи данных',
            buttons: ['OK']
          });
          alert.present();
        }
      );
  }

}
