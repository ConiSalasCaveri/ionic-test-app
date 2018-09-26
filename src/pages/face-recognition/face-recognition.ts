import { FaceRecognitionService } from "./../../providers/face-recognition-service/face-recognition-service";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";

@Component({
  selector: "page-face-recognition",
  templateUrl: "face-recognition.html"
})
export class FaceRecognitionPage {
  public image: string;
  public error: string;
  public loading: boolean;
  public analysis: Array<any> = [];

  private options: CameraOptions = {
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    targetWidth: 600,
    targetHeight: 600,
    saveToPhotoAlbum: false,
    allowEdit: true,
    sourceType: 1,
    correctOrientation: false,
    cameraDirection: 1
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private faceRecognitionService: FaceRecognitionService
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad FaceRecognitionPage");
  }

  public takePhoto(taken: Function = null, notTaken: Function = null): void {
    this.camera.getPicture(this.options).then(
      imageData => {
        // For the sake of displaying our image, we have to add a
        // data type to our base64 encoding. We'll snip this out later
        // when retrieving a link from Imgur.
        let base64Image: string = "data:image/jpeg;base64," + imageData;
        if (taken != null) taken(base64Image);
      },
      e => {
        if (notTaken != null) notTaken(e);
      }
    );
  }

  public analyzeFaceDetails(response: object): void {
    // Clear analysis array.
    this.analysis = [];

    // Retrieved face attributes object from response.
    let attributes = response[0]["faceAttributes"];

    // Convert two strings into a key-value pair for our
    // analysis list.
    let getAnalysisObject = (feature, value) => {
      return { feature: feature, value: value };
    };

    // Converts 'john' into 'John'
    let capitalizeFirstLetter = str =>
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    //
    // ~ Analysis Time ~
    //

    // Get age
    this.analysis.push(getAnalysisObject("Age", attributes["age"]));

    // Get age
    this.analysis.push(
      getAnalysisObject("Gender", capitalizeFirstLetter(attributes["gender"]))
    );

    // Get smiling (person is smiling if value is over 0.5)
    this.analysis.push(
      getAnalysisObject("Smiling?", attributes["smile"] > 0.5 ? "Yes" : "No")
    );

    // Check if bald, if so, output that.
    // If not, give the person's hair color.
    if (attributes["hair"]["bald"] > 0.8) {
      this.analysis.push(getAnalysisObject("Is Bald?", "Yes"));
    } else if (
      attributes["hair"]["hairColor"] &&
      attributes["hair"]["hairColor"].length > 0
    ) {
      this.analysis.push(
        getAnalysisObject(
          "Hair Color",
          capitalizeFirstLetter(attributes["hair"]["hairColor"][0]["color"])
        )
      );
    }

    // Get person's emotion by looping through emotion object and grabbing the greatest value
    let moods = attributes["emotion"];
    var greatestEmotion, greatestEmotionValue;
    for (var mood in moods) {
      if (
        moods[mood] &&
        (!greatestEmotion || moods[mood] > greatestEmotionValue)
      ) {
        greatestEmotion = mood;
        greatestEmotionValue = moods[mood];
      }
    }
    this.analysis.push(
      getAnalysisObject("Emotion", capitalizeFirstLetter(greatestEmotion))
    );
  }

  // Perform our steps to facial analysis in asynchronous order
  // 1. Takes the photo
  // 2. Gets a photo link from imgur
  // 3. Analyzes face data from imgur link
  // If an error occurs in any of the steps, it is shown on the screen
  // and the asynchronous calls terminate.
  public analyzeFace(): void {
    this.error = null;
    this.takePhoto(
      // If photo was taken
      photo => {
        this.image = photo;
        this.loading = true;
        this.faceRecognitionService.sendToImgur(
          photo,
          // If Imgur returned an image link
          link => {
            this.faceRecognitionService.analyzeViaAzure(
              link,
              // If analysis worked
              response => {
                this.loading = false;
                this.analyzeFaceDetails(response);
              },
              // If analysis didn't work
              () => {
                this.loading = false;
                this.error = "Error: Azure couldn't analyze the photo.";
              }
            );
          },
          // If Imgur didn't return an image link
          () => {
            this.error = "Error: Imgur couldn't return a link.";
          }
        );
      },
      // If photo wasn't taken
      () => {
        this.error = "Error: Phone couldn't take the photo.";
      }
    );
  }

  goToHome() {
    this.navCtrl.popToRoot();
  }
}
