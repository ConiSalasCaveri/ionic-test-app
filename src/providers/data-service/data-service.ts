import { HttpClient } from '@angular/common/http';
import { BarCode } from '../../pages/shared/model';
import { Injectable } from '@angular/core';

@Injectable()
export class DataService {

  constructor(public http: HttpClient) {}

  getProducts() {
    return this.http.get<BarCode>('../../assets/products.json')
      .map((response: BarCode) => JSON.stringify(response));
  }

}
