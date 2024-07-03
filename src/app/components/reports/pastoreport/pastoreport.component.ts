import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralService } from 'src/app/services/general.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from '../../alert/alert.service';
import { DialogComponent } from '../../dialog/dialog.component';

export interface pastorRptInt {
  SN: number;
  pastorname: string;
  phoneno: number;
  gender: string;
  desig: string;
  pastorReportUrl: string;
}

@Component({
  selector: 'app-pastoreport',
  templateUrl: './pastoreport.component.html',
  styleUrls: ['./pastoreport.component.scss'],
  providers: [DatePipe],
})
export class PastoreportComponent implements OnInit {
  minDate: Date;
  maxDate: Date = new Date();

  sdate: any;
  edate: any;
  error: any = { isError: false, errorMessage: '' };
  accountRptForm: FormGroup;
  userData: pastorRptInt;
  pastorReportData: any;
  dataSource1: MatTableDataSource<pastorRptInt>;
  myData: Array<any>;
  actID: string;
  currentCareCellName: string;
  resStringReprot: any;
  resReport: any;
  currentNumReport = 0; // number of reports in current carecell
  pastorReportUrl: any;
  startDate1: any;
  pData: any;

  constructor(
    private http: HttpClient,
    private gen: GeneralService,
    private datePipe: DatePipe,
    protected alertService: AlertService,
    private dialog: MatDialog
  ) {
    const storedData = localStorage.getItem('aminUserInfo');
    this.pData = storedData ? JSON.parse(storedData) : null;
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.accountRptForm = new FormGroup({
      startDate: new FormControl(),
      endDate: new FormControl(),
      date: new FormControl(),
    });

    this.accountRptForm.get('startDate').valueChanges.subscribe((value) => {
      this.sdate = this.datePipe.transform(value, 'yyyy-MM-dd');
      this.startDate1 = this.sdate;
    });

    this.accountRptForm.get('endDate').valueChanges.subscribe((value) => {
      this.edate = this.datePipe.transform(value, 'yyyy-MM-dd');
      this.checkRange(this.sdate, this.edate);
    });
  }

  doRefresh(event: any) {
    this.getPastorReport(event);
  }

  checkRange(sdate: string, edate: string) {
    if (sdate != null && edate != null && edate < sdate) {
      this.error = {
        isError: true,
        errorMessage: 'End Date can not be earlier than Start Date',
      };
      this.alertService.success('End Date can not be earlier than Start Date', {
        autoClose: false,
        keepAfterRouteChange: false,
      });
    } else {
      this.reportUrl(this.sdate, this.edate);
      this.getPastorReport();
    }
  }

  reportUrl(sdate: string, edate: string) {
    this.pastorReportUrl =
      'https://apag.digitalchurch.tech/dateWiseIncome?startDate=' +
      sdate +
      '&endDate=' +
      edate +
      '&uid=' +
      this.pData.user.uid;
  }

  length = 10;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10];

  getPastorReport(event?: any) {
    this.http.get(this.pastorReportUrl).subscribe((res: any) => {
      this.resStringReprot = JSON.stringify(res);
      this.resReport = JSON.parse(
        this.gen.getDecodedString(this.resStringReprot)
      );
      this.pastorReportData = this.resReport;
      this.dataSource1 = new MatTableDataSource<pastorRptInt>(
        this.pastorReportData
      );
      this.dataSource1.paginator = this.paginator;
      this.dataSource1.sort = this.sort;

      if (this.currentNumReport > 0) {
        if (event && event.type == 'ionRefresh') {
          event.target.complete();
        }
      }
    });
  }

  displayedColumns: string[] = ['pastorname', 'date', 'amt', 'type'];

  doFilter(filterValue?: string) {
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

  // Converts date in dd-mm-yyyy to dd/mm/yy
  formatDate(inputDate: string): string {
    const parts = inputDate.split('-'); // split the input date string into an array
    const year = parts[2].slice(-2); // get the last two digits of the year
    const month = parts[1];
    const day = parts[0];
    return `${day}/${month}/${year}`; // concatenate the parts into the desired format
  }

  // Returns First Letter of each word in the sentece
  getFirstLetters(words: string): string {
    const wordsArray = words.split(' '); // split the string into an array of words
    const firstLetters = wordsArray.map((word) => word.charAt(0)); // get the first letter of each word
    return firstLetters.join(''); // join the first letters together into a new string
  }

  openDialog(desig: any): void {
    this.dialog.open(DialogComponent, {
      data: desig,
    });
  }

  onFormSubmit() {}
}
