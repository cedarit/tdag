import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralService } from '../../services/general.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Church {
  churchName: any;
  displayName: string;
  id: number;
}

@Component({
  selector: 'app-churchincome',
  templateUrl: './churchincome.component.html',
  styleUrls: ['./churchincome.component.scss'],
})
export class ChurchincomeComponent implements OnInit {
  minDate: Date; // Optionally, set a minimum date if needed
  maxDate: Date = new Date();
  churchForm: FormGroup;
  sdate: any; // the startdate to pass to renge Validation
  edate: any;
  error: any = { isError: false, errorMessage: '' };
  churches: Church[];
  selectedChurchObj = new FormControl(null, Validators.required);
  filteredOptions: Observable<Church[]>;
  httpClient: any;
  resStringPay: string;
  inlineRange: any;
  PayModeList: any;
  resStringConStatus: any;
  resStringFinType: any;
  FinTypeList: any;
  psDisplayName: string;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private router: Router,
    private gen: GeneralService,
    private datePipe: DatePipe
  ) {
    this.getPayModeData();
    this.getContributionStatus();
    this.getFinType();
  }

  myControl = new FormControl();
  ChurchNameList: any[] = [];
  submitted = false;
  uid: any;
  resStringChurch: any;
  ContributionStatusList: any;

  ngOnInit() {
    this.churchForm = new FormGroup({
      amt: new FormControl(),
      churchName: new FormControl(),
      conId: new FormControl(),
      recDate: new FormControl(),
      payMode: new FormControl(),
      inStatus: new FormControl(),
      finType: new FormControl(),
      checkNo: new FormControl(),
      transNo: new FormControl(),
      donorList: new FormControl(),
      selectedChurchObj: this.selectedChurchObj,
    });

    this.getChurchData();

    const storedData = localStorage.getItem('aminUserInfo');
    const mData = storedData ? JSON.parse(storedData) : null;


    // localStorage psReport
    const mStoredData = localStorage.getItem('memberProfile');
    const psData = mStoredData ? JSON.parse(mStoredData) : null;


    const myName = mData.user.name;
  
    console.log('Logged in User Id:', mData.user.uid);
    // this is username
    if (mData && mData.user) {
     // this.mName = mData.user.name;
    }


        // this is DisplayName
        if (psData && psData.length > 0 && psData[0].displayName) {
          this.psDisplayName = psData[0].displayName;
        } else {
          this.psDisplayName = null;
          // this.gen.setMemberProfile();
          // console.log("Found memberProfile was missing. Loaded it")
          // this.psDisplayName = mData[0].displayName;
        }
  }

  // Mobile only 10 digit number allowed
  keyMPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  filterChurch() {
    this.filteredOptions = this.selectedChurchObj.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.churchName)),
      map((name) => (name ? this._filter(name) : this.churches.slice()))
      // map(value => this._filter(value))
    );
  }

  private _filter(value: string): Church[] {
    const filterValue = value.toLowerCase();
    // return this.churches.filter(church => church.churchName.toLowerCase().indexOf(filterValue) === 0);
    return this.churches.filter((church) =>
      church.churchName.toLowerCase().includes(filterValue)
    );
  }

  // tslint:disable-next-line:member-ordering

  churchListUrl = ' https://apag.digitalchurch.tech/churchlist';

  // tslint:disable-next-line:adjacent-overload-signatures

  getChurchData() {
    this.http.get(this.churchListUrl).subscribe((res) => {
      this.resStringPay = JSON.stringify(res);
      this.churches = JSON.parse(this.gen.getDecodedString(this.resStringPay));
      this.filterChurch();
    });
  }

  private _filteredOptions(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log(
      'Church name List: ' +
        this.ChurchNameList.filter((dList) =>
          dList.displayName.toLowerCase().includes(filterValue)
        )[0].id
    );
    return this.ChurchNameList.filter((dList) =>
      dList.displayName.toLowerCase().includes(filterValue)
    );
  }

  displayChFn(church: any): string {
    return church && church.churchName ? church.churchName : '';
  }

  inlineRangeChange($event: any) {
    this.inlineRange = $event;
  }
  checkRange(sdate: string, edate: string) {
    console.log('checkRange called:', edate);
    // if( (this.datePipe.transform(sdate.To, 'yyyy-MM-dd') > this.datePipe.transform(edate.To, 'yyyy-MM-dd')))
    // {
    //   console.log("StartDate is bigger than End date");
    // } else{
    //   console.log(" else");
    // }

    if (sdate != null && edate != null && edate < sdate) {
      // this.error= {isError:true,errorMessage:'End date should be grater then start date.'};
      console.log('StartDate is less than End date');
      this.error = {
        isError: true,
        errorMessage: 'End Date can not before start date',
      };
    }
  }

  undefinedToEmpty($theStr: any) {
    if ($theStr) {
      return $theStr;
    } else {
      return '';
    }
  }

  payModeUrl = 'https://apag.digitalchurch.tech/getPayMode';
  getPayModeData() {
    this.http.get(this.payModeUrl).subscribe((res: any) => {
      console.log('Pay Mode:' + res);
      this.resStringPay = JSON.stringify(res);
      this.PayModeList = JSON.parse(
        this.gen.getDecodedString(this.resStringPay)
      );
    });
  }

  contributionStatusUrl = 'https://apag.digitalchurch.tech/getContStatus';
  getContributionStatus() {
    this.http.get(this.contributionStatusUrl).subscribe((res: any) => {
      console.log(res);
      this.resStringConStatus = JSON.stringify(res);
      this.ContributionStatusList = JSON.parse(
        this.gen.getDecodedString(this.resStringConStatus)
      );
    });
  }

  FinTypeUrl = 'https://apag.digitalchurch.tech/getFinType';
  getFinType() {
    this.http.get(this.FinTypeUrl).subscribe((res: any) => {
      console.log(res);
      this.resStringFinType = JSON.stringify(res);
      this.FinTypeList = JSON.parse(
        this.gen.getDecodedString(this.resStringFinType)
      );
    });
  }

  onFormSubmit() {
    this.router.navigate(["/membership-card"]);

    const $qString: string =
      'amt=' +
      this.undefinedToEmpty(this.churchForm.value.amt) +
      '&conId=' +
      this.undefinedToEmpty(this.churchForm.value.selectedChurchObj.id) +
      '&recDate=' +
      formatDate(this.churchForm.value.recDate, 'yyyy-MM-dd', 'en') +
      '&churchName=' +
      this.undefinedToEmpty(this.churchForm.value.churchName) +
      '&payMode=' +
      this.undefinedToEmpty(this.churchForm.value.payMode) +
      // '&inStatus=' +this.undefinedToEmpty(this.churchForm.value.inStatus)+
      '&inStatus=' +
      this.undefinedToEmpty('Pending') +
      '&finType=' +
      this.undefinedToEmpty(this.churchForm.value.finType) +
      // tslint:disable-next-line:no-unused-expression
      '&checkNo=' +
      this.undefinedToEmpty(this.churchForm.value.checkNo) +
      // tslint:disable-next-line:no-unused-expression
      '&transNo=' +
      this.undefinedToEmpty(this.churchForm.value.transNo);

    // tslint:disable-next-line:max-line-length
    /// http://192.168.1.44/trola/churchPastorConCreate?firstName=danny&lastName=toff&gender=Male&dob=25-10-1980&phone=9909090909&email=danny@gmail.com&churchNameId=66

    // console.log("submitted value URL:" + "http://192.168.1.44/trola/churchPastorConCreate?",$qString );

    //let churchPastorURL: string=encodeURI("http://192.168.1.44/trola/churchPastorConCreate?"+$qString);
    let addIncomeURL: string = encodeURI(
      'https://apag.digitalchurch.tech/addIncome?' + $qString
    );

    console.log(
      'submitted value URL:' + 'https://apag.digitalchurch.tech/addIncome?',
      $qString
    );

    console.log('this is to be put as addIncomeURL', addIncomeURL);
    this.putIncomeDataHttp(addIncomeURL);
  }

  putIncomeDataHttp(theIncomeURL: string) {
    this.http.get(theIncomeURL, { observe: 'response' }).subscribe((res) => {
      console.log('response printing::', res);

      if (res.status == 200) {
        let message = `Submitted ${formatDate(
          this.churchForm.value.recDate,
          'yyyy-MM-dd',
          'en'
        )} ,financialType: ${this.churchForm.value.finType}`;
        this.onSuccesfulIncomeFormSubmit(message, 'Done');
        console.log(message);
        this.router.navigate(["./membership-card"]);
      }
    });
  }

  onSuccesfulIncomeFormSubmit(message: string, action: string) {
    //1. show success message

    this._snackBar.open(message, action, {
      duration: 5000,
    });

    //2. route to Report page
  }
  // Also observe the response on visiting the url, read https://angular.io/guide/http#reading-the-full-response

  putPastorDataHttp(theCPastorURL: string) {
    this.http.get(theCPastorURL, { observe: 'response' }).subscribe((res) => {
      console.log('response printing::', res);

      if (res.status == 200) {
        // tslint:disable-next-line:max-line-length
        let message = `Submitted Pastor's Name:  ${this.churchForm.value.firstName}, Phone no: ${this.churchForm.value.phone}, Church : ${this.churchForm.value.selectedChurchObj.churchName}`;
        // let message =  `Submitted ${formatDate(this.incomeForm.value.recDate, "yyyy-MM-dd",'en')} ,financialType: ${this.incomeForm.value.finType}`;

        this.onSuccesfulReportSubmit(message, 'Done');
        console.log(message);
        //this.router.navigate(['carecell-leader-report',this.ccId]);
      }
    });
  }

  onSuccesfulReportSubmit(message: string, action: string) {
    //1. show success message

    this._snackBar.open(message, action, {
      duration: 5000,
    });

    //2. route to Report page
  }

  onCancel() {
    this.churchForm.reset();
  }
}

function undefinedToEmpty($theStr: any) {
  if ($theStr) {
    return $theStr;
  } else {
    return '';
  }
  throw new Error('Function not implemented.');
}
