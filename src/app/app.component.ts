import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { PulsePage } from '../pages/pulse/pulse';
import { PulseVariabilityPage } from '../pages/pulse-variability/pulse-variability';
import { DevicesPage } from '../pages/devices/devices';

import { AuthProvider} from '../providers/auth';
import { RequestsProvider } from '../providers/requests';
import { AccountPage } from '../pages/account/account';
import { CorrectionsPage } from '../pages/corrections/corrections';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  toast: any;
  isDeviceSyncing: boolean = false;
  queryParamsObj: any = {};

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public toastCtrl: ToastController,
    public authProvider: AuthProvider,
    public requestsProvider: RequestsProvider
  ) {
    this.initializeApp();
    this._initQueryParams();

    this.toast = this.toastCtrl.create({
      duration: 3000
    });

    this.authProvider.checkToken().then(token => {
      return new Promise((resolve, reject) => {
        if (token) {
          this.authProvider.checkAuth(token)
            .subscribe(data => {
              if (data.valid) {
                this.authProvider.token = token;
                resolve('ok');
                return;
              }
              // если авторизация не валидна - ошибка 401
            }, err => {
              this._requestTokenSubscribe(resolve, reject);
            });
        } else {
          this._requestTokenSubscribe(resolve, reject);
        }
      });
    })
    .then(() => {
      console.log("After successfull login");
      let val = this.queryParamsObj['sessionId'];
      if (!val) {
        return;
      }
      console.log('called api/sync/session/token: '  + this.authProvider.token + '/' + val);
      this.requestsProvider.putSessionUserSync(this.authProvider.token, val)
        .subscribe(ok => {
          this._presentSyncDeviceToast(true);
        }, err => {
          this._presentSyncDeviceToast(false);
        });
    })
    .catch(err => {
      if (this.queryParamsObj['sessionId']) {
        this._presentSyncDeviceToast(false);
      }
      console.log('error in auth promise chain', err);
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Главная', component: HomePage },
      { title: 'Приборы', component: DevicesPage },
      { title: 'Коррекции', component: CorrectionsPage },
      { title: 'О приложении', component: AboutPage },
      { title: 'Аккаунт', component: AccountPage },
      { title: 'Пульс', component: PulsePage },
      { title: 'ВСР', component: PulseVariabilityPage }
    ];

    console.log(location);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  _requestToken() {
    return this.authProvider.getAuth();
  }

  _requestTokenSubscribe(resolve, reject) {
    this._requestToken().subscribe(data => {
      this.authProvider.token = data.jwtToken;
      this.authProvider.saveToken(data.jwtToken);
      resolve('ok');
    }, err => {
      console.log(err, 'Error getting token');
      reject(err);
    });
  }

  _presentSyncDeviceToast(sucess: boolean) {
    if (sucess) {
      this.toast.setMessage("Прибор успешно синхронизирован!")
    } else {
      this.toast.setMessage("Не удалось подключить устройство!");
    }
    this.toast.present();
  }

  _initQueryParams() {
    let queryParams = location.href.split('?')[1];
    if (!queryParams) {
      return;
    }

    queryParams.split('&').forEach(q => {
      let splitted = q.split('=');
      let attr = splitted[0];
      let val = splitted[1];

      this.queryParamsObj[attr] = val;
    });
  }
}
