import { Geolocation } from '@ionic-native/geolocation';
//OTHERS
import { FingerprintAuthenticationPage } from '../pages/fingerprint-authentication/fingerprint-authentication';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, AlertController, LoadingController } from 'ionic-angular';
import { AgmCoreModule } from '@agm/core'
import { DataService } from '../providers/data-service/data-service';
import { HttpClientModule } from '@angular/common/http';
//PAGES
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ScannerPage } from '../pages/scanner/scanner';
import { ScannerSearchPage } from '../pages/scanner-search/scanner-search';
import { ScannerAddPage } from '../pages/scanner-add/scanner-add';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { CameraPage } from '../pages/camera/camera';
//IONIC-NATIVE
import { Vibration } from '@ionic-native/vibration';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Toast } from '@ionic-native/toast';
import { LocalNotifications } from '@ionic-native/local-notifications';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    CameraPage,
    MapPage,
    ScannerPage,
    FingerprintAuthenticationPage,
    LoginPage,
    ScannerAddPage,
    ScannerSearchPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({apiKey: 'AIzaSyCr9WJZgHkKt__jHyNlP1YeNG4M5ZhcDEM'}),
    HttpClientModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    CameraPage,
    MapPage,
    ScannerPage,
    FingerprintAuthenticationPage,
    LoginPage,
    ScannerAddPage,
    ScannerSearchPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    BarcodeScanner,
    AlertController,
    DataService,
    Toast,
    Vibration,
    LoadingController,
    LocalNotifications,
    Geolocation
  ]
})
export class AppModule {}
