import { MapPage } from '../map/map';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Vibration } from '@ionic-native/vibration';

@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html'
})
export class CameraPage {
  public image: any;
  public latitude: any;
  public longitude: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loader: LoadingController,
    private geolocation: Geolocation,
    private vibration: Vibration,
    private camera: Camera,
    private localNotifications: LocalNotifications,
    private alertCtrl: AlertController
  ) {
    this.geolocation = new Geolocation();
  }


  takePicture() {
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      targetHeight: 500,
      targetWidth: 500,
      saveToPhotoAlbum: false
    };
    this.camera.getPicture(options).then(imageUri => {
      this.image = 'data:image/jpeg;base64,' + imageUri;
      this.getGeolocation();
    });
  }

  getGeolocation() {
    let load = this.loader.create({
      content: 'Obteniendo la ubicación de la foto.'
    });
    load.present().then(() => {
      this.geolocation
        .getCurrentPosition()
        .then(position => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          load.dismiss();
          this.sendNotification();
        });
    })
    .catch((error) => {
      load.dismiss();
      this.presentAlert('Error', error)
    });
  }

  sendNotification() {
    this.vibration.vibrate(1000);

    this.localNotifications = new LocalNotifications();
    this.localNotifications.schedule({
      title: 'Jaran',
      text: 'Se ha tomado una imagen desde la aplicación'
    });
  }

  goToMap() {
    this.navCtrl.push(MapPage, {
      latitude: this.latitude,
      longitude: this.longitude
    });
  }

  goToHome() {
    this.navCtrl.popToRoot();
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
