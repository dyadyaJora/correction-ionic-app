import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { PsyTestDataProvider } from '../../providers/psy-test-datas';
import { PsyTest } from '../../providers/psy-test';
import { TestInfoPage } from '../test-info/test-info';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tests: Array<PsyTest>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public psyTestDataProvider: PsyTestDataProvider) {

  }

  ngOnInit() {
    this.psyTestDataProvider.getData().subscribe((data) => {
      this.tests = data;
    });
  }

  openTest(index: number) {
    console.log(index);
    this.navCtrl.push(TestInfoPage, {
      item: this.tests[index]
    });
  }
}
