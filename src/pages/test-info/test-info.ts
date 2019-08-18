import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SimpleTestPage } from '../simple-test/simple-test';
import { SanTestPage } from '../san-test/san-test';
import { LusherTestPage } from '../lusher-test/lusher-test';

@Component({
  selector: 'page-test-info',
  templateUrl: 'test-info.html',
})
export class TestInfoPage {
  selectedTest: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.selectedTest = navParams.get('item');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestInfoPage');
  }

  startTest() {
    switch (this.selectedTest.id) {
      case 0: this.navCtrl.push(SimpleTestPage); break;
      case 3: this.navCtrl.push(SanTestPage); break;
      case 4: this.navCtrl.push(LusherTestPage); break;
      default: console.log('error'); break;
    }
  }

}
