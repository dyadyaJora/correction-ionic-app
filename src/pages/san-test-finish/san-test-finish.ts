import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth';
import { RequestsProvider } from '../../providers/requests';

@Component({
  selector: 'page-san-test-finish',
  templateUrl: 'san-test-finish.html',
})
export class SanTestFinishPage {
  points: any;
  score: any;
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
    this.points = navParams.get('points');
    this.score = navParams.get('strs');
    this.id = navParams.get('id');
  }

  close() {
  	this.viewCtrl.dismiss();
  }

  send() {
    let alert;
    this.requests.postObjectMeta({
      type: 'san',
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
