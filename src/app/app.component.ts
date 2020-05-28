import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { StubPage } from '../pages/stub/stub';
import { PulsePage } from '../pages/pulse/pulse';
import { PulseVariabilityPage } from '../pages/pulse-variability/pulse-variability';

import { AuthProvider} from '../providers/auth';
  
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public authProvider: AuthProvider
  ) {
    this.initializeApp();

    this.authProvider.checkToken().then(token => {
      if (token) {
        this.authProvider.checkAuth(token)
          .subscribe(data => {
            if (data.valid) {
              this.authProvider.token = token;
            } else {
              // если авторизация не валидна прилетает ошибка 401, обработчик ниже
            }
          }, err => {
            this._requestToken();
          });
      } else {
        this._requestToken();
      }
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Главная', component: HomePage },
      { title: 'О приложении', component: AboutPage },
      { title: 'Вход в аккаунт', component: StubPage },
      { title: 'Пульс', component: PulsePage },
      { title: 'ВСР', component: PulseVariabilityPage }
    ];

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
    this.authProvider.getAuth()
      .subscribe(
        data => {
          this.authProvider.token = data.jwtToken;
          this.authProvider.saveToken(data.jwtToken);
        },
        err => {
          console.log(err, 'Error getting token');
        });
  }
}
