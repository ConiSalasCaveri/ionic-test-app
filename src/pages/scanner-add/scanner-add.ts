import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Component } from '@angular/core';
import { BarCode } from '../shared/model';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Vibration } from '@ionic-native/vibration';

@Component({
  selector: 'page-scanner-add',
  templateUrl: 'scanner-add.html'
})
export class ScannerAddPage {
  public barCodes: BarCode[];
  public productName: any;
  public productBrand: any;
  public productPrice: any;
  public productDetail: any;
  private i: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    private alertCtrl: AlertController,
    private toast: Toast,
    private vibration: Vibration,
    private localNotifications: LocalNotifications
  ) {}

  goToHome() {
    this.navCtrl.popToRoot();
  }

  scan() {
    this.barCodes = new Array<BarCode>();
    if (this.productName.lenght) {
      this.toast.show(
        `Ingrese el nombre del producto`,
        '5000',
        'bottom'
      );
    }

    this.i++;
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        if (this.barCodes.some(x => x.text === barcodeData.text)) {
          this.presentAlert(
            'Producto duplicado',
            'El producto escaneado ya fue ingresado previamente, por favor escanee otro producto.'
          );
          this.productName = '';
          return;
        }
        this.barCodes.push(<BarCode>{
          id: this.i,
          canceled: barcodeData.cancelled,
          text: barcodeData.text,
          format: barcodeData.format,
          name: this.productName,
          brand: this.productBrand,
          price: this.productPrice,
          description: this.productDetail
        });
        this.productName = '';
      })
      .catch(err => {
        console.log('Error', err);
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

  sendNotification() {
    this.vibration.vibrate(1000);
    this.localNotifications.schedule({
      title: 'Jaran',
      text: 'Se ha agregado un producto exitosamente.'
    });
  }
}
