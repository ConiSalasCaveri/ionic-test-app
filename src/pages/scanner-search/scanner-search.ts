import { DataService } from '../../providers/data-service/data-service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Component } from '@angular/core';
import { BarCode } from '../shared/model';
import { NavController, NavParams, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-scanner-search',
  templateUrl: 'scanner-search.html'
})
export class ScannerSearchPage {
  public products: BarCode[] = [];
  public selectedProduct: BarCode;
  public productFound: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    private alertCtrl: AlertController,
    private dataService: DataService
  ) {}

  ionViewDidEnter() {
    this.dataService.getProducts().subscribe(response => {
      this.products = JSON.parse(response);
    });
  }

  scan() {
    this.selectedProduct = new BarCode();

    this.barcodeScanner.scan().then(barcodeData => {
      this.selectedProduct = this.products.find(
        product => product.text === barcodeData.text
      );
      if (this.selectedProduct !== undefined) {
        this.productFound = true;
      } else {
        this.productFound = false;
        this.presentAlert(
          'Producto no encontrado',
          'El producto escaneado no fue encontrado, por favor registre el producto.'
        );
      }
    });
  }

  presentAlert(title: string, subTitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Acepto']
    });
    alert.present();
  }
}
