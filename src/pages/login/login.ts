import { HomePage } from '../home/home';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public fingerprintAio: FingerprintAIO;
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  verifyFingerprint() {
    this.fingerprintAio = new FingerprintAIO();

    this.fingerprintAio
      .show({
        clientId: 'Fingerprint-Demo',
        clientSecret: 'password',
        disableBackup: true
      })
      .then(() => {
        this.navCtrl.setRoot(HomePage);
      })
      .catch((error: any) => console.log(error));
  }

  openPage() {
    this.navCtrl.popToRoot();
  }
}
