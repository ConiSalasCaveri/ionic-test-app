
import { ScannerSearchPage } from '../scanner-search/scanner-search';
import { ScannerAddPage } from '../scanner-add/scanner-add';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-scanner',
  templateUrl: 'scanner.html'
})
export class ScannerPage {
  public scannerAdd = ScannerAddPage;
  public scannerSearch = ScannerSearchPage;
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  goToHome() {
    this.navCtrl.popToRoot();
  }
}
