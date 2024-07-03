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
  selector: 'app-church-pastor-form',
  templateUrl: './church-pastor-form.component.html',
  styleUrls: ['./church-pastor-form.component.scss'],
})
export class ChurchPastorFormComponent implements OnInit {
  pastorForm: FormGroup;
  sdate: any; // the startdate to pass to renge Validation
  edate: any;
  error: any = { isError: false, errorMessage: '' };
  churches: Church[];
  selectedChurchObj = new FormControl(null, Validators.required);
  filteredOptions: Observable<Church[]>;
  httpClient: any;
  resStringPay: string;
  inlineRange: any;
  maxDate: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private router: Router,
    private gen: GeneralService,
    private datePipe: DatePipe
  ) {
    this.maxDate = this.getMaxDate();
  }
  myControl = new FormControl();
  ChurchNameList: any[] = [];
  submitted = false;
  uid: any;
  resStringChurch: any;

  getMaxDate(): Date {
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return eighteenYearsAgo;
  }
  ngOnInit() {
    this.pastorForm = new FormGroup({
      email: new FormControl(),
      phone: new FormControl(),
      firstName: new FormControl(),
      lastName: new FormControl(),
      gender: new FormControl(),
      DOB: new FormControl(),
      churchName: new FormControl(),
      rangePicker: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
      date: new FormControl(),
      selectedChurchObj: this.selectedChurchObj,
    });

    this.getChurchData();
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

  onFormSubmit() {
    this.router.navigate(['/home']);
    let $qString: string =
      'firstName=' +
      this.undefinedToEmpty(this.pastorForm.value.firstName) +
      '&lastName=' +
      this.undefinedToEmpty(this.pastorForm.value.lastName) +
      '&gender=' +
      this.undefinedToEmpty(this.pastorForm.value.gender) +
      '&dob=' +
      formatDate(this.pastorForm.value.DOB, 'yyyy-MM-dd', 'en') +
      '&phone=' +
      this.undefinedToEmpty(this.pastorForm.value.phone) +
      '&email=' +
      this.undefinedToEmpty(this.pastorForm.value.email) +
      '&churchName=' +
      this.undefinedToEmpty(this.pastorForm.value.selectedChurchObj.churchName);

    // tslint:disable-next-line:max-line-length
    /// http://192.168.1.44/trola/churchPastorConCreate?firstName=danny&lastName=toff&gender=Male&dob=25-10-1980&phone=9909090909&email=danny@gmail.com&churchNameId=66

    // console.log("submitted value URL:" + "http://192.168.1.44/trola/churchPastorConCreate?",$qString );

    console.log(
      'submitted value URL:' +
        'https://apag.digitalchurch.tech/churchPastorConCreate?',
      $qString
    );

    //let churchPastorURL: string=encodeURI("http://192.168.1.44/trola/churchPastorConCreate?"+$qString);
    let churchPastorURL: string = encodeURI(
      'https://apag.digitalchurch.tech/churchPastorConCreate?' + $qString
    );

    console.log('This is to be put as churchPastorURL', churchPastorURL);
    this.putPastorDataHttp(churchPastorURL);
  }

  // Also observe the response on visiting the url, read https://angular.io/guide/http#reading-the-full-response

  putPastorDataHttp(theCPastorURL: string) {
    this.http.get(theCPastorURL, { observe: 'response' }).subscribe((res) => {
      console.log('response printing::', res);

      if (res.status == 200) {
        // tslint:disable-next-line:max-line-length
        let message = `Submitted Pastor's Name:  ${this.pastorForm.value.firstName}, Phone no: ${this.pastorForm.value.phone}, Church : ${this.pastorForm.value.selectedChurchObj.churchName}`;
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
    this.pastorForm.reset();
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
