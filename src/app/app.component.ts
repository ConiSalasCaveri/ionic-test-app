import { HomePage } from '../pages/home/home';
import { FingerprintAuthenticationPage } from '../pages/fingerprint-authentication/fingerprint-authentication';
import { ScannerPage } from '../pages/scanner/scanner';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CameraPage } from '../pages/camera/camera';
//import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav)
  nav: Nav;
  rootPage: any = HomePage; //LoginPage
  pages: Array<{ title: string; component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  goToCameraPage() {
    this.nav.push(CameraPage);
  }

  goToScannerPage() {
    this.nav.push(ScannerPage);
  }

  goToFingerprintAuthenticationPage() {
    this.nav.push(FingerprintAuthenticationPage);
  }
}
