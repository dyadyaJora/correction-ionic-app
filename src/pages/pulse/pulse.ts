import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-pulse',
  templateUrl: 'pulse.html',
})
export class PulsePage {

  text: string = '--';
  running: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PulsePage');
  }

  runPulse() {
    this.running = true;

    (<any>window).heartbeat.take({
      seconds: 10
    }, (data) => {
      console.log(data);
      this.text = data;
      this.running = false;
    }, (err) => {
      console.log(err);
      this.text = '=';
      this.running = false;
    });
  }

}
