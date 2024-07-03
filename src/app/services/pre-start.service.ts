import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {appVersion} from './appVersion'; 
import {Router} from '@angular/router';
import { Platform } from '@ionic/angular';
import { GeneralService } from './general.service';


@Injectable({
  providedIn: 'root'
})
export class PreStartService {
  
  thisReleaseVersion = appVersion.android; // appVerions.iOS for ios
  isLatest = true;
  thePlatform:any;
  theAndroidURL: any;
  theIosURL: any;

  latestReleaseVersion: any = {};
  latestReleaseURL: string;


  constructor(private httpClient: HttpClient,
              private router: Router,
              public platform: Platform,
              private genServ: GeneralService) {
                this.latestReleaseURL = this.genServ.appBaseURL + '/app/app-version-check';
                this.getSetPlatform();
                this.setLatestReleaseInfo();
   }

   getSetPlatform() {
     if (this.platform.is('android'))
     {
       this.thePlatform = 'android';
     } else if( this.platform.is('ios')) {
       this.thePlatform = 'ios';
     }
     console.log('The paltform is ', this.thePlatform);
   }


   setLatestReleaseInfo(){
     this.genServ.appBaseURL;
    this.httpClient.get(this.latestReleaseURL)
      .subscribe(
        (res: any) => {
          this.latestReleaseVersion = res;
          console.log(`this is latestReleaseVersion: `, this.latestReleaseVersion);
          localStorage.setItem('latestReleaseInfo',JSON.stringify(this.latestReleaseVersion));
          this.theAndroidURL = this.latestReleaseVersion[0].android_url;
          this.theIosURL = this.latestReleaseVersion[0].ios_url;
          // the this version is less and android_update_required="Yes"
          console.log("The ios and android url:",this.theIosURL, this.theAndroidURL)

          // IF ANDROID
          if (this.platform.is('android')) {
            if((this.thisReleaseVersion < this.latestReleaseVersion[0].android_latest_release) && this.latestReleaseVersion[0].android_update_required =="Yes"  ){
              this.router.navigateByUrl('/installUpdate');
              this.isLatest = false;
              console.log('The app verison is old. needs update: is this latest ', this.isLatest);

            } else {
              this.isLatest = true;
              console.log('The app version does not need an update. ', this.isLatest)
            }
          }
          // IF iOS
          if (this.platform.is('ios')) {
            if((this.thisReleaseVersion < this.latestReleaseVersion[0].ios_latest_release) && this.latestReleaseVersion[0].ios_update_required =="Yes"  ){
              this.router.navigateByUrl('/installUpdate');
              this.isLatest = false;
              console.log('The app verison is old. needs update: is this latest ', this.isLatest);

            } else {
              this.isLatest = true;
              console.log('The app version does not need an update. ', this.isLatest)
            }
          }
          this.getSetPlatform();
        });
   }

   // this is used by Version check directly instead of reading from local storage
   getLatestReleaseInfo() {
    return this.httpClient.get(this.latestReleaseURL);
   }
} 
