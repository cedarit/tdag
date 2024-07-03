import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe, formatDate } from "@angular/common";
import { MatSnackBar } from "@angular/material/snack-bar";
import { GeneralService } from "../../../services/general.service";
// import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatSort } from '@angular/material';
import { AlertService } from "../../alert/alert.service";
import { DialogComponent } from "../../dialog/dialog.component";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

export interface pastorRptInt {
  SN: number;
  pastorname: string;
  phoneno: number;
  gender: string;
  desig: string;
  pastorReportUrl: string;
}

@Component({
  selector: "app-expense-reports",
  templateUrl: "./expense-reports.component.html",
  styleUrls: ["./expense-reports.component.scss"],
})
export class ExpenseReportsComponent implements OnInit {
  sdate: any; // the startdate to pass to renge Validation
  edate: any;
  error: any = { isError: false, errorMessage: "" };
  accountRptForm: FormGroup;

  pastorReportData: pastorRptInt[] = [];
  dataSource1: MatTableDataSource<pastorRptInt>;
  myData: Array<any>;

  actID: string;
  currentCareCellName: string;
  //currentCareCellID = '';
  resStringReprot: string;
  resReport: pastorRptInt[];
  currentNumReport = 0; // number of reports in current carecell
  pastorReportUrl: any;
  startDate1: any;
  pData: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private router: Router,
    private gen: GeneralService,
    private datePipe: DatePipe,
    protected alertService: AlertService,
    private dialog: MatDialog
  ) {
    const storedData = localStorage.getItem("aminUserInfo");
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

    this.accountRptForm.get("startDate").valueChanges.subscribe((value) => {
      console.log(value);
      // this.sdate = value;
      this.sdate = this.datePipe.transform(value, "yyyy-MM-dd");
      console.log("sdate is ", this.sdate);
      this.startDate1 = this.sdate;
    });
    this.accountRptForm.get("endDate").valueChanges.subscribe((value) => {
      console.log(value);
      this.edate = this.datePipe.transform(value, "yyyy-MM-dd");

      this.checkRange(this.sdate, this.edate);
    });
  }

  doRefresh(event: any) {
    this.getPastorReport(event);
  }

  checkRange(sdate: string, edate: string) {
    console.log("checkRange called, end Date:", edate);
    // if( (this.datePipe.transform(sdate, 'yyyy-MM-dd') > this.datePipe.transform(edate, 'yyyy-MM-dd')))
    // {
    //   console.log("StartDate is bigger than End date");
    // } else{
    //   console.log(" else");
    // }

    if (sdate != null && edate != null && edate < sdate) {
      console.log("StartDate is less than End date");
      this.error = {
        isError: true,
        errorMessage: "End Date can not be earlier than Start Date",
      };
      this.alertService.success("End Date can not be earlier than Start Date", {
        autoClose: false,
        keepAfterRouteChange: false,
      });
    } else {
      this.reportUrl(this.sdate, this.edate);
      this.getPastorReport();
    }
  }

  reportUrl(sdate: string, edate: string) {
    //this.pastorReportUrl = 'http://192.168.1.44/trola/dateWiseIncome?startDate=' + sdate + '&endDate=' + edate ;
    // this.pastorReportUrl = 'https://apag.digitalchurch.tech/dateWiseIncome?startDate=' + sdate + '&endDate=' + edate ;
    // this.pastorReportUrl = 'https://apag.digitalchurch.tech/dateWiseIncome?startDate=' + sdate + '&endDate=' + edate + '&uid=' + this.pData.user.uid;

    this.pastorReportUrl =
      "http://192.168.1.44/trola/dateWiseExpenseReport?startDate=" +
      sdate +
      "&endDate=" +
      edate +
      "&uid=" +
      this.pData.user.uid;
  }

  length = 10;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 20];

  // tslint:disable-next-line:member-ordering

  getPastorReport(event?: any) {
    this.http.get(this.pastorReportUrl).subscribe((res) => {
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

      //  console.log('The  CareCell Name is ', this.carecellReportData[0]['Carecell']);

      //   this.currentNumReport = this.carecellReportData.length
      // console.log('The number of reports: ', this.currentNumReport)

      if (this.currentNumReport > 0) {
        // //   this.currentCareCellName = this.carecellReportData[0]['Carecell'];

        console.log("Refresh event", event);
        if (event && event.type == "ionRefresh") {
          console.log("Event it is Refresh");
          event.target.complete();
        }
      }

      // return res;
    });
  }

  displayedColumns: string[] = ["pastorname", "date", "amt", "type"];

  doFilter(filterValue: string) {
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

  // Converts date in dd-mm-yyyy to dd/mm/yy
  formatDate(inputDate: string): string {
    const parts = inputDate.split("-"); // split the input date string into an array
    const year = parts[2].slice(-2); // get the last two digits of the year
    const month = parts[1];
    const day = parts[0];
    return `${day}/${month}/${year}`; // concatenate the parts into the desired format
  }

  // Returns First Letter of each word in the sentece
  getFirstLetters(words: string): string {
    const wordsArray = words.split(" "); // split the string into an array of words
    const firstLetters = wordsArray.map((word) => word.charAt(0)); // get the first letter of each word
    return firstLetters.join(""); // join the first letters together into a new string
  }

  openDialog(desig: any): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: desig,
    });
  }

  onFormSubmit() {}
}
