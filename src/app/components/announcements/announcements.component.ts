import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { register } from 'swiper/element/bundle';
// import {register} from 'swiper/element/'
register();


@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss'],
})

  
export class AnnouncementsComponent implements OnInit {
  showSplash = true;
  slides: any[] = [];
  color = 'accent';
  mode: any = 'indeterminate';
  value = 50;
  gotResponse = false;
  // isLoggedIn='true';
  // slidesUrl = 'https://app.newlifeag.in/app/appBannerList';
  // slidesUrl = 'http://app.newlifeag.in/app/appBannerList';//https://apag.digitalchurch.tech/app/appBannerList
  slidesUrl = 'https://apag.digitalchurch.tech/app/appBannerList';
  @ViewChild('swiper')  swiperRef: ElementRef | undefined;

  constructor(private httpClient: HttpClient) {
    this.getSlideUpdates();
  }

  ngOnInit() { /* TODO document why this method 'ngOnInit' is empty */ 
  setTimeout(() => {
    // Hide the splash screen after the async operation
    this.showSplash = true;
  }, 300000000);
}

  doRefresh(event: any) {
    this.getSlideUpdates(event);
  }

  getSlideUpdates(event?: any) {
    this.httpClient.get(this.slidesUrl).subscribe((res: any) => {
      console.log(res);
      this.slides = res;
      this.gotResponse = true;
      if (event && event.type == 'ionRefresh') {
        event.target.complete();
      }
    });
  }
}
