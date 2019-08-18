import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule, Injectable  } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TestInfoPage } from '../pages/test-info/test-info';
import { AboutPage } from '../pages/about/about';
import { PulsePage } from '../pages/pulse/pulse';
import { PulseVariabilityPage } from '../pages/pulse-variability/pulse-variability';
import { StubPage } from '../pages/stub/stub';
import { SimpleTestPage } from '../pages/simple-test/simple-test';
import { SanTestPage } from '../pages/san-test/san-test';
import { SimpleTestFinishPage } from '../pages/simple-test-finish/simple-test-finish';
import { SanTestFinishPage } from '../pages/san-test-finish/san-test-finish';
import { LusherTestPage } from '../pages/lusher-test/lusher-test';
import { LusherTestFinishPage } from '../pages/lusher-test-finish/lusher-test-finish';

import { IonicStorageModule } from '@ionic/storage';
import { ComponentsModule } from '../components/components.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Flashlight } from '@ionic-native/flashlight';

import { PsyTestDataProvider } from '../providers/psy-test-datas';
import { AuthProvider } from '../providers/auth';
import { RequestsProvider } from '../providers/requests';
import { BaseUrlInterceptor } from '../providers/base-interceptor';

import { environment as ENV } from '../environments/environment';

// import * as Sentry from '@sentry/browser';

// Sentry.init({
//   dsn: 'https://45789722db9341d8a6cbe76569c07db3@sentry.io/1428740'
// });

// @Injectable()
// export class SentryErrorHandler implements ErrorHandler {
//   constructor() {}
//   handleError(error) {
//     Sentry.captureException(error.originalError || error);
//     throw error;
//   }
// }
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TestInfoPage,
    AboutPage,
    SimpleTestPage,
    PulsePage,
    PulseVariabilityPage,
    StubPage,
    SanTestPage,
    SimpleTestFinishPage,
    SanTestFinishPage,
    LusherTestPage,
    LusherTestFinishPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TestInfoPage,
    AboutPage,
    SimpleTestPage,
    PulsePage,
    PulseVariabilityPage,
    StubPage,
    SanTestPage,
    SimpleTestFinishPage,
    SanTestFinishPage,
    LusherTestPage,
    LusherTestFinishPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    PsyTestDataProvider,
    AuthProvider,
    RequestsProvider,
    HttpClientModule,
    Flashlight,
    //{ provide: ErrorHandler, useClass: SentryErrorHandler },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true }, 
    { provide: 'BASE_API_URL', useValue: ENV.apiUrl }
  ]
})
export class AppModule {}
