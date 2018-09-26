import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class FaceRecognitionService {

  private imgurEndpoint: string = "https://api.imgur.com/3/image";
  private imgurClientId: string = "373f147909e5b66";
  private azureEndpoint: string = "https://brazilsouth.api.cognitive.microsoft.com/face/v1.0";
  private azureApiKey: string = "d2e7a90d0bf24eb9a77c510302440ea0";

  constructor(public http: HttpClient) {
    console.log('Hello FaceRecognitionServiceProvider Provider');
  }

  public sendToImgur(image: string, urlCallback: Function = null, failureCallback:Function = null): void {
    // Imgur requires that Base64 images be stripped of the
    // string 'data:image/...;base64,' so we snip it out here.
    image = image.substring(image.indexOf('base64,') + 'base64,'.length);

    // Imgur requires this string for authentication
    // It looks like: 'Client-ID XXXXXXXXXXXX' when sent
    let auth: string = `Client-ID ${this.imgurClientId}`;

    // Imgur wants an encoded form-data body
    // So we'll give it to them -> just append a key-value pair
    // with our 'snipped' base64 image.
    let body: FormData = new FormData();
    body.append('image', image);

    // Angular was very annoying in sending out a form-data request
    // using HttpModule (I spent 3 hours trying to solve it). But, instead, we
    // can send a request the old fashioned JavaScript way.

    // Create a POST request and authorize us via our auth variable from above
    var xhr = new XMLHttpRequest();
    xhr.open("POST", this.imgurEndpoint, true);
    xhr.setRequestHeader("Authorization", auth);

    // Once the request is sent, we check to see if it's successful
    xhr.onreadystatechange = () => {
          if (xhr.readyState == XMLHttpRequest.DONE) {
                // 200 is a successful status code, meaning it worked!
                if (xhr.status == 200) {
                      // We can grab the link from our HTTP response and call it back
                      let link = JSON.parse(xhr.response)['data']['link'];
                      if (urlCallback != null && link != null) {
                            urlCallback(link);
                      }
                } else if (xhr.status >= 400 && failureCallback != null) {
                      // If we receive a bad request error, we'll send our failure callback.
                      failureCallback();
                }
          }
    }

    // This synchronously sends our form-data body.
    xhr.send(body);
}

public analyzeViaAzure(link:string, analysisCallback:Function = null, failureCallback:Function = null): void {

  // This is a subfunction that converts an object into a serialized URL format.
  // For instance, { 'foo': 'bar' } becomes 'foo=bar'
  let serialize = (parameters:object) => Object.keys(parameters).map(key => key + '=' + parameters[key]).join('&');

  // Tell the server that we are querying/looking for a specific set of face data,
  // and want it in the appropriate format.
  let faceParameters:object = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
  }

  // We use the above function, serialize, to serialize our face parameters.
  let serializedFaceParameters:string = serialize(faceParameters);

  // Our body contains just one key, 'url', that contains our image link.
  // We must convert our body JSON into a string in order to POST it.
  let body = JSON.stringify({ "url": link });

  // Create a POST request with the serialized face parameters in our endpoint
  // Our API key is stored in the 'Ocp-Apim-Subscription-Key' header
  var xhr = new XMLHttpRequest();
  xhr.open("POST", `${this.azureEndpoint}/detect?${serializedFaceParameters}`, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Ocp-Apim-Subscription-Key", this.azureApiKey);

  // Once the request is sent, we check to see if it's successful
  xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
              // 200 is a successful status code, meaning it worked!
              if (xhr.status == 200) {
                    // We can grab the link from our HTTP response and call it back
                    if (analysisCallback != null) {
                          analysisCallback(JSON.parse(xhr.response));
                    }
              } else if (xhr.status >= 400 && failureCallback != null) {
                    // If we receive a bad request error, we'll send our failure callback.
                    failureCallback();
              }
        }
  }

  xhr.send(body);
}

}
