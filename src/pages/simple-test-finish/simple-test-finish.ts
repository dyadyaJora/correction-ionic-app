import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-simple-test-finish',
  templateUrl: 'simple-test-finish.html',
})
export class SimpleTestFinishPage {

  errors: number;
  right: number;
  lost: number;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.errors = navParams.get('errors');
    this.right = navParams.get('right');
    this.lost = navParams.get('lost');
  }

  close() {
  	this.viewCtrl.dismiss();
  }

}
