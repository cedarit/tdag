import { Component, OnInit } from '@angular/core';
import {  HttpClient } from '@angular/common/http';
import { GeneralService} from '../../services/general.service';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent  implements OnInit {

  calenderEvents: string | any[] = [];
  calendarUrl = '';
  resString: string;


  constructor(private httpClient: HttpClient,
              private gen: GeneralService) {
    this.calendarUrl = gen.appBaseURL + '/app/eventApp';
    this.getCalendar();

   }
   color = 'accent';
   mode = 'indeterminate';
 

    ngOnInit() {}

    doRefresh(event: any) {
      this.getCalendar(event);
    }

    getCalendar(event?: any) {
      console.log('Length of Calendar: ', this.calenderEvents.length);
      this.httpClient.get(this.calendarUrl).subscribe((res) => {
        console.log(res);
        this.resString = JSON.stringify(res);
        this.calenderEvents = JSON.parse(this.gen.getDecodedString(this.resString));
  
        console.log(' The calender Events are', this.calenderEvents);
        console.log('Refresh event', event);
        if (event && event.type == 'ionRefresh') {
        console.log('Event it is Refresh');
        event.target.complete();
      }
   });
  }
}


