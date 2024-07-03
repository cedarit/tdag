import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralService } from 'src/app/services/general.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// tslint:disable-next-line:class-name
export interface pastorRptInt {
  SN: number;
  pastorname: string;
  phoneno: number;
  gender: string;
  desig: string;
  pastorReportUrl: string;
  img?: string;
}

export interface uDataInt {
  dn: string;
  urrl: string;
  phoneno: string;
  userid: number;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})

export class UserProfileComponent implements OnInit {

  error: any = { isError: false, errorMessage: '' };
  userData: pastorRptInt
  pastorReportData: uDataInt;
  dataSource1: MatTableDataSource<pastorRptInt>;
  resStringReprot: any;
  resReport: any;
  pastorReportUrl: any;
  pData: any;
  uData: uDataInt;
  jsonArray: uDataInt;
  url: string;
  uiid: string;
  displayName: any;
  sanitizedURL: string;
  designation: any;
  phoneNumber: string;




  constructor(
    private http: HttpClient,
    private gen: GeneralService
  ) {
    const storedData = localStorage.getItem('aminUserInfo');
    this.pData = storedData ? JSON.parse(storedData) : null;
    this.uiid = this.pData.user.uid
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  ngOnInit() {
    this.reportUrl(this.uiid);
    this.getPastorReport();
  }


  doRefresh(event: any) {
    this.getPastorReport();

  }

  reportUrl(uid: string) {
    this.pastorReportUrl = 'https://apag.digitalchurch.tech/memberData?uid=' + uid;
  }

  length = 10;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10];

  getPastorReport() {
    this.http.get(this.pastorReportUrl).subscribe((res: any) => {
      this.resStringReprot = JSON.stringify(res);
      this.resReport = JSON.parse(this.gen.getDecodedString(this.resStringReprot));
      this.pastorReportData = this.resReport;
      this.uData = this.pastorReportData;
      this.jsonArray = this.uData;
      this.url = this.resReport[0].URL;
      this.displayName = this.resReport[0].displayName;
      this.designation = this.resReport[0].Designation;
      this.phoneNumber = this.resReport[0].PhoneNumber;
      this.sanitizedURL = encodeURI(this.url);
    });
  }

  displayedColumns: string[] = ['date', 'amt', 'type', 'status'];

  doFilter(filterValue: string) {
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

}