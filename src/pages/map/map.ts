import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  public map: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidEnter() {
    this.loadMap();
  }

  loadMap() {
    const location = this.navParams.data;
    return (this.map = {
      latitude: location.latitude,
      longitude: location.longitude,
      zoom: 18
    });
  }
}
