import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Flashlight } from '@ionic-native/flashlight';

import { AuthProvider } from '../../providers/auth';
import { RequestsProvider } from '../../providers/requests';

import * as d3 from 'd3';

@Component({
  selector: 'page-pulse-variability',
  templateUrl: 'pulse-variability.html',
})
export class PulseVariabilityPage {
  isEnd: boolean = false;
  hasFlashlight: boolean = false;
  hasCamera: boolean = false;
  cameraInUse: string = '';
  fps: any = 0;
  running: boolean = false;
  canvas: any;
  _track: any;
  d: number;
  interval: any;
  results: Array<any> = [];
  csvResData: string = '';
  loader: any;
  timeCounter: number = 60;
  counterTimer: any;
  id: string;
  sex: string;
  age: number;
  comment: string;

  chartProps: any;
  chartData: Array<any> = [];

  @ViewChild('chart') chartElement: ElementRef;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public flashLight: Flashlight,
    private lc: LoadingController,
    public auth: AuthProvider,
    public req: RequestsProvider,
    public ac: AlertController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PulseVariabilityPage');
    this.flashLight.available()
      .then(val => {
        if (!val) {
          this._showNoFlashlightToast();
        }
      })
      .catch(err => {

      });

    navigator.mediaDevices.enumerateDevices()
      .then(data => {
        data.forEach(item => {
          if (item.kind == 'videoinput') {
            this.hasCamera = true;
          }

          if (item.label != '') {
            this.cameraInUse = item.label;
          }
        });
      })
      .catch(err => {
        throw new Error('Cannot enumerate devices: ' + err);
      });

    this.canvas = document.querySelector('canvas');
  }

  ionViewWillLeave() {
    this.stopGrabFrame();
  }

  _showNoFlashlightToast() {

  } 

  startGrabFrame() {
    this.isEnd = false;
    this.running = true;
    this.results = [];
    this.timeCounter = 60;
    
    this._buildChart();

    this.loader = this.lc.create({
      content: 'Включаем камеру. Начинаем запись пульсовой волны...' +
        (this.cameraInUse ? '' : 'Если вы в первый раз включаете камеру на данном ресурсе и загрузка идет слишком долго - попробуйте перезагрузить страницу!')
    });

    this.loader.present();

    this.flashLight.switchOn();

    let constraintVideo = {
      frameRate: {min: 30},
      facingMode: 'environment'
    };

    let appVersion = navigator.appVersion.toUpperCase();

    if (appVersion.indexOf('IOS') !== -1 || appVersion.indexOf('MACOS') !== -1) {
      Object.assign(constraintVideo, { width: 320 });
    } else {
      Object.assign(constraintVideo, { width: { max: 5 } });
    }


    navigator.mediaDevices.getUserMedia({ video: constraintVideo })
    .then((stream) => {
      this.loader.dismiss();
      this._gotMedia(stream);
    })
    .catch(err => {
      throw new Error('getUserMedia() failed: ' + err);
      console.error('getUserMedia() failed: ', err)
    });
  }

  stopGrabFrame() {
    if (this.running) {
      this.send();
    }

    this.running = false;
    this.isEnd = true;

    clearInterval(this.interval);
    clearInterval(this.counterTimer);
    if (this._track) {
      this._track.stop();
    }
    this.sortResults()
    //this.csvResData = this.printRes();
    this.flashLight.switchOff();
  }

  _gotMedia(mediastream) {
    this._track = mediastream.getVideoTracks()[0];
    this.fps = this._track.getSettings().frameRate;

    this._startTimer();

    let imageCapture = new window.ImageCapture(this._track);
    this.d = new Date().getTime();
    this.interval = setInterval(() => {
      imageCapture.grabFrame()
        .then((imgData) => {
          this._processFrame(imgData);
        })
        .catch(err => {
          console.error('grabFrame() failed: ', err)
        }); 
    }, 1000 / this.fps);
  }

  _processFrame(imgData) {
    let d1 = new Date().getTime();
    setTimeout(() => {
      this.canvas.width = imgData.width;
      this.canvas.height = imgData.height;
      var ctx = this.canvas.getContext('2d');
      ctx.drawImage(imgData, 0, 0);
      var d2 = new Date().getTime();
      console.log(d2 - d1);
      var imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      var d3 = new Date().getTime();
      console.log(d3 - d1);
      console.log('g: ', (this.d-d3))
      this.sendMessageToServiceWorker({
        timestamp: d1 - this.d,
        imageData: imageData
      })
      .then((data) => {
        console.log('responce calc worker', data);
        this.results.push(data);
        this._updateChart(data);
      })
      .catch((err) => {
        // throw new Error('error recieving responce from worker ' + err);
        console.log('error recieving responce from worker', err)
      });
    }, 1);
  }

  sendMessageToServiceWorker(data) {
    return new Promise(function(resolve, reject) {
      var messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = function(event) {
        if (event.data.error) {
          reject(event.data.error);
        } else {
          resolve(event.data);
        }
      };
      navigator.serviceWorker.controller.postMessage(data,
        [messageChannel.port2]);
    });
  }

  sortResults() {
    this.results.sort(function(a, b) {
      if (+a.timestamp > +b.timestamp)
        return 1;

      if (+a.timestamp == +b.timestamp)
        return 0;

      if (+a.timestamp < +b.timestamp)
        return -1;
    });
  }

  _startTimer() {
    this.counterTimer = setInterval(() => {
      if (this.timeCounter !== 0) {
        this.timeCounter--;
      } else {
        this.stopGrabFrame();
      }
    }, 1000);
  }

  send() {
    this.loader = this.lc.create({
      content: 'Сохраняем результаты ВСР...'
    });

    this.loader.present();
    this.req.postVariability(this.results, this.auth.token)
      .subscribe(
        data => {
          this.loader.dismiss();
          console.log(data);
          this.id = data.data.id;
        },
        err => {
          this.loader.dismiss();
          console.log(err);
        }
      );
  }

  sendMeta() {
    let alert;
    this.req.postObjectMeta({
      type: 'variability',
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

  _buildChart() {
    this.chartProps = {};
    this.chartData = [];

    // Set the dimensions of the canvas / graph
    let margin = { top: 30, right: 20, bottom: 30, left: 50 };
    let width = 600 - margin.left - margin.right;
    let height = 270 - margin.top - margin.bottom;

    // Set the ranges
    this.chartProps.x = d3.scaleTime().range([0, width]);
    this.chartProps.y = d3.scaleLinear().range([height, 0]);

    // Define the axes
    let xAxis = d3.axisBottom(this.chartProps.x);
    let yAxis = d3.axisLeft(this.chartProps.y).ticks(5).tickFormat('');

    let _this = this;

    // Define the line
    let valueline = d3.line<any>()
      .curve(d3.curveBasis)
      .x(function (val) {
        return _this.chartProps.x(val.timestamp);
      })
      .y(function (val) { console.log('Close market'); return _this.chartProps.y(val.sum); });

    d3.selectAll('svg').remove();
    let svg = d3.select(this.chartElement.nativeElement)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .append('g');

    // Scale the range of the data
    this.chartProps.x.domain(
      d3.extent(_this.results, function (d) {
        return d.timestamp;
      }));
    this.chartProps.y.domain([0, d3.max(this.results, function (d) {
      return d.sum;
    })]);

    // Add the valueline path.
    svg.append('path')
      .attr('class', 'line line1')
      .style('stroke', 'red')
      .style('fill', 'none')
      .attr('d', valueline(_this.results));

    // Add the X Axis
    svg.append('g')
      .attr('class', 'x axis')
      .call(xAxis);

    // Add the Y Axis
    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    // Setting the required objects in chartProps so they could be used to update the chart
    this.chartProps.svg = svg;
    this.chartProps.valueline = valueline;
    this.chartProps.xAxis = xAxis;
    this.chartProps.yAxis = yAxis;
  }

  _updateChart(newVal) {
    this.chartData.push(newVal);
    let chartDataLen = this.chartData.length;

    if (this.chartData[chartDataLen - 1].timestamp - this.chartData[0].timestamp > 7000) {
      this.chartData.shift();
    }

    // Scale the range of the data again
    this.chartProps.x.domain(d3.extent(this.chartData, (val) => {
      return val.timestamp
    }));

    this.chartProps.y.domain([
      d3.min(this.chartData, (val) => val.sum ),
      d3.max(this.chartData, (val) => val.sum )
    ]);

    // Select the section we want to apply our changes to
    this.chartProps.svg.transition();

    this.chartProps.svg.select('.x.axis') // update x axis
      .call(this.chartProps.xAxis);

    this.chartProps.svg.select('.y.axis') // update y axis
      .call(this.chartProps.yAxis);

    // Make the changes to the line chart
    this.chartProps.svg.select('.line.line1')
      .attr('d', this.chartProps.valueline(this.chartData));
  }
}
