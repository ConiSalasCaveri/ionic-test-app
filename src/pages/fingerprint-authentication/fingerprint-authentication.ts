import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';

@Component({
  selector: 'page-fingerprint-authentication',
  templateUrl: 'fingerprint-authentication.html'
})
export class FingerprintAuthenticationPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fingerprintAio: FingerprintAIO
  ) {}

  addFingerprint() {
    this.fingerprintAio = new FingerprintAIO();

    this.fingerprintAio
      .show({
        clientId: 'Fingerprint-Demo',
        clientSecret: 'password',
        disableBackup: true
      })
      .then((result: any) => console.log(result))
      .catch((error: any) => console.log(error));
  }

  goToHome() {
    this.navCtrl.popToRoot();
  }
}
