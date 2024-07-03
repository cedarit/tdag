import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpUrlEncodingCodec } from '@angular/common/http';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PreStartService } from 'src/app/services/pre-start.service';
import Chart from 'chart.js/auto';
import { Router } from '@angular/router';

export interface DialogData {
  needsUpdate: boolean;
}
export interface Tile {
  text: string;
  cols: number;
  rows: number;
  color: string;
  // icon: string;
  svgIcon: string;
  bgColor: string;
  isize: string;
  image: string;
  routerLink: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent extends HttpUrlEncodingCodec implements OnInit {
  myChart: any;
  // other colors that can be used #d42626,1a91ff, #1a91ff, #f35734, #3a592e, #FF9800, 0225db
  tiles: Tile[] = [
    // LIVE
    // tslint:disable-next-line: max-line-length
    {
      text: 'Income',
      cols: 2,
      rows: 1,
      color: '',
      routerLink: '/pcincome',
      svgIcon: '',
      image: '../../../assets/images/Give1.jpeg',
      bgColor: 'rgb(0,0,0)',
      isize: '200px',
    },
    // {text: 'My Profile',  cols: 2, rows: 1, color: '', routerLink: '/income', svgIcon: '', image: '../../../assets/images/GivingGraph.png', bgColor: 'rgb(0,0,0)', isize: '200px'},

    // Reports
    // tslint:disable-next-line: max-line-length
    {
      text: 'Pastors Reports',
      cols: 1,
      rows: 1,
      color: '',
      routerLink: '/pastors-report',
      svgIcon: 'calendar-month-outline',
      image: '../../../assets/images/Reports1.jpeg',
      bgColor: 'rgb(0,0,0)',
      isize: '200px',
    },

    //  Accounting
    //     // tslint:disable-next-line: max-line-length
    // tslint:disable-next-line:max-line-length
    {
      text: 'Accounting',
      cols: 1,
      rows: 1,
      color: '',
      routerLink: '/account-reports',
      svgIcon: 'calendar-month-outline',
      image: '../../../assets/images/accounts1.jpeg',
      bgColor: 'rgb(0,0,0)',
      isize: '200px',
    },

    // Calendar
    // tslint:disable-next-line: max-line-length
    {
      text: 'Inbox',
      cols: 1,
      rows: 1,
      color: '',
      routerLink: '/church-pastor-form',
      svgIcon: 'calendar-month-outline',
      image: '../../../assets/images/pastorsform1.jpeg',
      bgColor: 'rgb(0,0,0)',
      isize: '200px',
    },

    //Pastorform
    // tslint:disable-next-line:max-line-length
    {
      text: 'Calender',
      cols: 1,
      rows: 1,
      color: '',
      routerLink: '/calendar',
      svgIcon: 'calendar-month-outline',
      image: '../../../assets/images/calendar1.jpeg',
      bgColor: 'rgb(0,0,0)',
      isize: '200px',
    },
  ];

  deviceInfo = '';

  constructor(
    private httpClient: HttpClient,
    public sanitizer: DomSanitizer,
    private preStartService: PreStartService,
    public dialog: MatDialog,
    private deviceService: DeviceDetectorService,
    private router: Router
  ) {
    super();
    console.log('Begining Home Page');
  }

  fetchChartData() {
    return this.httpClient.get('C:projectsAPAG2srcdatagiving-graph.json');
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UpdateAppVersionDialog, {
      width: '250px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
  // @ViewChild('sidenav');
  // spinner
  color = 'accent';
  mode = 'indeterminate';

  ngOnInit() {
    this.myChart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'TDAG Graph',
            backgroundColor: [
              'rgba(99, 99, 132, 0.8)',
              'rgba(200, 99, 99, 0.8)',
              'rgba(99, 140, 132, 0.8)',
              'rgba(150, 99, 132, 0.8)',
              'rgba(150, 9, 132, 0.8)',
              'rgba(99, 99, 32, 0.8)',
            ],
            borderColor: [
              'rgba(99, 99, 132,1)',
              'rgba(99, 99, 99, 1)',
              'rgba(99, 140, 132, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
            data: [],
          },
        ],
      },
    });

    this.httpClient
      .get<any>('http://192.168.1.44/trola/getPastorsCountforGraph')
      .subscribe((data) => {
        const labels = data.map((item: { Category: any }) => item.Category);
        const chartData = data.map((item: { TOTAL: string }) =>
          parseFloat(item.TOTAL)
        );

        // To inter-change rows and columns
        // const labels = data.map((item: { TOTAL: string }) =>
        //   parseFloat(item.TOTAL)
        // ); // Use TOTAL as labels
        // const chartData = data.map((item: { Category: any }) => item.Category);

        // Update chart data
        this.myChart.data.labels = labels;
        this.myChart.data.datasets[0].data = chartData;
        this.myChart.update();
      });
  }

  featuredSafeURL: SafeResourceUrl;
  featuredVideos: any;
  stime: any;
  videoID: any;
  featuredVideosUrl =
    'https://trola.churchgalaxy.com/app/featuredSermonListService';

  getFeaturedVideos() {
    this.httpClient.get(this.featuredVideosUrl).subscribe((res: any) => {
      console.log(res);
      this.featuredVideos = res;
      console.log('This is featured video', this.featuredVideos);

      //using hardcoded iframe with variable video id and time
      this.stime = this.sanitizer.bypassSecurityTrustUrl('70m10s');
      this.videoID = this.sanitizer.bypassSecurityTrustResourceUrl('351850314');
      let unsafeFeaturedURL = res[0].featuredIframeURL
        .replace(/&lt;/g, '<')
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
      this.featuredSafeURL =
        this.sanitizer.bypassSecurityTrustHtml(unsafeFeaturedURL);
      console.log('Featured safe URL: ', this.featuredSafeURL);
    });
  }

  versionCheck() {
    // this.deviceInfo = this.deviceService.getDeviceInfo();
    // THIS SECTION USES THE SUBSCRIBE SERVICE AND WAITS FOR RESPONSE
    this.versionCheckNOW();
  }
  versionCheckNOW() {
    this.preStartService.getLatestReleaseInfo().subscribe((data: any) => {
      //   if(this.deviceInfo.os=="Android"){
      //     if(
      //       (data[0].android_latest_release > appVersion.android ) &&
      //       (data[0].android_update_required=="Yes") ){
      //       this.openDialog();
      //     }
      //   }
      //   else if( this.deviceInfo.os=="iOS"){
      //     if(
      //       (data[0].ios_latest_release > appVersion.iOS ) &&
      //       (data[0].ios_update_required=="Yes") ){
      //         this.openDialog();
      //       }
      //   }
      // });
    });
  }

  isMenuItemVisible(route: string): boolean {
    const routeSnapshot = this.router.config.find(
      (config) => config.path === route
    );
    if (!routeSnapshot || !routeSnapshot.canActivate) {
      return true; // If no guard is specified, show the menu item
    }

    const guard = routeSnapshot.canActivate[0];
    const canActivate = guard.canActivate(null, null);

    return canActivate;
  }
}

@Component({
  selector: 'update-app-version-dialog',
  templateUrl: 'update-app-version-dialog.html',
})
export class UpdateAppVersionDialog {
  constructor(
    public dialogRef: MatDialogRef<UpdateAppVersionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  //   onUpgradeClick(): void {
  //   this.dialogRef.close();
  // }
}
