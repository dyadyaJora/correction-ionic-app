import { Component } from '@angular/core';
import { NavController, NavParams,  AlertController, LoadingController, ModalController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth';
import { RequestsProvider } from '../../providers/requests';

import { LusherTestFinishPage } from '../lusher-test-finish/lusher-test-finish';

import * as lusher from '../../lib/dist/psy_lusher.js';

@Component({
  selector: 'page-lusher-test',
  templateUrl: 'lusher-test.html',
})
export class LusherTestPage {
  currentQuestion: string;
  questionNumber: number;
  // серого (условный номер — 0), тёмно-синего (1), сине-зелёного (2), красно-жёлтого (3), жёлто-красного (4), красно-синего или фиолетового (5), коричневого (6) и чёрного (7)
  colors: Array<any> = lusher.getColors();
  currentColors: Array<any> = [];
  stepOneQuestion: string = 'Выберите из предложенных вариантов цвет, который Вам меньше всего нравиться сейчас';
  stepTwoQuestion: string = 'Выберите цвет, который Вам БОЛЬШЕ всего нравиться сейчас';
  // TRUE - step one
  // FALSE - step two
  step: boolean;
  stepOneAnswers: Array<any> = [];
  stepTwoAnswers: Array<any> = [];
  waiting: boolean = false;
  tryAgainButton: boolean = false;
  load: any;
  alert: any;
  modal: any;

  // calculated results
  anxiety: number;
  conflict: number;
  performance: number;
  fatigue: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public req: RequestsProvider,
    public auth: AuthProvider,
    public ac: AlertController,
    public lc: LoadingController,
    public mc: ModalController
  ) {
    this._runStep(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LusherTestPage');
  }

  onChoosen(data) {
    this._saveCurrentAnswer(data);
    this._clearChoosenElement(data);

    if (this.currentColors.length == 1) {
      this._saveCurrentAnswer(this.currentColors[0]);

      if (this.step){
        this._finishStep();
      } else {
        this._finishTest();
      }
    } else {
      this._loadNextQuestion();
    }
  }

  onRunNext() {
    this.waiting = false;
    this._runStep(false);
  }

  send() {
    this._createLoad();
    this.load.present();
    this.req.postLusher({
      oneArr: this.stepOneAnswers,
      twoArr: this.stepTwoAnswers
    }, this.auth.token)
      .subscribe(data => {
        console.log(data);
        this.load.dismiss();

        this._createModal(data.data.id);
        this.modal.present();
      }, err => {
        console.log(err);
        this.tryAgainButton = true;
        this.load.dismiss();
        // popup with error
        this._createAlert();
        this.alert.present();
      });
  }

  _finishTest() {
    console.log(lusher.calcAxiety);
    this.anxiety = lusher.calcAnxiety(this.stepOneAnswers, this.stepTwoAnswers).percent;
    this.conflict = lusher.calcConflict(this.stepOneAnswers, this.stepTwoAnswers).percent;
    this.performance = lusher.calcPerformance(this.stepOneAnswers, this.stepTwoAnswers).percent;
    this.fatigue = lusher.calcFatigue(this.stepOneAnswers, this.stepTwoAnswers).percent;
    this.send();  
  }

  _finishStep() {
    this.waiting = true;
  }

  _runStep(step: boolean) {
    this.step = step;
    this.questionNumber = 1;

    if (step) {
      this.currentQuestion = this.stepOneQuestion;
    } else {
      this.currentQuestion = this.stepTwoQuestion;
    }

    this.currentColors = this._copyArray(this.colors);
    this._randomizeColors();
  }

  _saveCurrentAnswer(ans) {
    if (this.step) {
      this.stepOneAnswers.push(ans);
    } else {
      this.stepTwoAnswers.unshift(ans);
    }
  }

  _loadNextQuestion() {
    this._randomizeColors();
    this.questionNumber++;
    // emit bounce animation
  }

  _clearChoosenElement(ans) {
    let ind = this.currentColors.findIndex(item => item.name == ans.name);

    this.currentColors.splice(ind, 1);
  }

  _randomizeColors() {
    let n = this.currentColors.length;
    let randIndex;
    let tmp;

    for (let i = n - 1; i > 1; i--) {
      randIndex = Math.floor(Math.random() * i);
      tmp = this.currentColors[i];
      this.currentColors[i] = this.currentColors[randIndex];
      this.currentColors[randIndex] = tmp;
    }
  }

  _copyArray(array): Array<any> {
    return array.map(item => Object.assign({}, item));
  }


  _createModal(id) {
    this.modal = this.mc.create(LusherTestFinishPage, {
      anxiety: this.anxiety,
      conflict: this.conflict,
      performance: this.performance,
      fatigue: this.fatigue,
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

}
