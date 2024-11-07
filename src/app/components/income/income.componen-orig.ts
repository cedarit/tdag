import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GeneralService } from 'src/app/services/general.service';

export interface Donor {
  displayName: string;
  id: number;
 // contactID: number;
}
export interface Contact {
  displayName: string;
  FirstName: string;
  last_name: string;
  Desig: string;
  ContactId: string;
}

export interface Church {
  churchName: any;
  displayName: string;
  id: number;
}

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
})
export class IncomeComponent implements OnInit {
  @ViewChild('inputField') inputField: ElementRef;
  minDate: Date; // Optionally, set a minimum date if needed
  maxDate: Date = new Date();
  incomeForm: FormGroup;
  submitted = false;
  uid: any;
  PayModeList: any;
  donorList: any[];
  ContributionStatusList: any;
  FinTypeList: any;
  resStringPay: any;
  resStringCID: any;
  resStringConStatus: any;
  resStringFinType: any;
  control: any;
  donors: Donor[];
  contactObj: Contact[];
  mName: string;
  psDisplayName: string
  myId: any;
  contactID: string;

  // selectedDonorObj = new FormControl(null, Validators.required);
  selectedDonorObj = new FormControl(null);

  filteredOptions: Observable<Donor[]>;
  httpClient: any;
  genServ: any;
  churches: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private router: Router,
    private gen: GeneralService
  ) {
    this.getPayModeData();
    this.getFinType();
    this.getContributionStatus();
  }

  myControl = new FormControl();
  ChurchNameList: any[] = [];
  donorListList: any[] = [];
  // tslint:disable-next-line:ban-types
  //donorList = new FormControl();

  //contactId  = 51 is for Telugu Dist contact Id
  //http://192.168.1.44/trola/addIncome?amt=201&conId=52&recDate=23-05-2021&payMode=Cash&inStatus=Completed

  ngOnInit() {
    const storedData = localStorage.getItem('aminUserInfo');
    const pData = storedData ? JSON.parse(storedData) : null;


    // localStorage psReport
    const pStoredData = localStorage.getItem("psReport");
    const psData = pStoredData ? JSON.parse(pStoredData) : null;


    const myName = pData.user.name;
    this.myId = pData.user.uid;

    console.log('Logged in User Id:', this.myId);
    // this is username
    if (pData && pData.user) {
      this.mName = pData.user.name;
    }

    // this is DisplayName
    if (psData && psData.length > 0 && psData[0].displayName) {
      this.psDisplayName = psData[0].displayName;
    } else {
      this.psDisplayName = null;
    }

    this.incomeForm = new FormGroup({
      amt: new FormControl(),
      churchName: new FormControl(),
      // conId: new FormControl(),
      recDate: new FormControl(),
      payMode: new FormControl(),
      inStatus: new FormControl(),
      finType: new FormControl(),
      checkNo: new FormControl(),
      transNo: new FormControl(),
      donorList: new FormControl(),
      selectedDonorObj: this.selectedDonorObj,
    });
    this.getdonorData();
    this.getContactID(this.myId);
  }

  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  // filterDonor() { // commenting out the autufuilter
  //   console.log('Filtered Donors: ', this.filterDonor.valueChanges);
  //   this.filteredOptions = this.selectedDonorObj.valueChanges.pipe(
  //     startWith(''),
  //     map((value) => (typeof value === 'string' ? value : value.displayName)),
  //     map((name) => (name ? this._filter(name) : this.donors.slice()))
  //     // map(value => this._filter(value))
  //   );
  // }
  filterDonor() {
    console.log('Filtered Donors: ', this.selectedDonorObj.valueChanges);
    this.filteredOptions = this.selectedDonorObj.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.displayName)),
      map((name) => (name ? this._filter(name) : this.donors.slice()))
      // map(value => this._filter(value))
    );
  }

  filterChurch() {
    this.filteredOptions = this.selectedDonorObj.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.displayName)),
      map((name) => (name ? this._filter(name) : this.churches.slice()))
      // map(value => this._filter(value))
    );
  }

  private _filter(value: string): Donor[] {
    const filterValue = value.toLowerCase();

    return this.donors.filter((donor) =>
      donor.displayName.toLowerCase().includes(filterValue)
    );
  }

  donorListUrl = 'https://apag.digitalchurch.tech/totalMemberList';
  getdonorData() {
    this.http.get(this.donorListUrl).subscribe((res: any) => {
      this.resStringPay = JSON.stringify(res);
      this.donors = JSON.parse(this.gen.getDecodedString(this.resStringPay));
      console.log('This is Donors list: ', this.donors);
      this.filterDonor();
      // this.filterChurch();
    });
  }
  uidToContactIDUrl = "https://apag.digitalchurch.tech/getContactIdfromUid?uid=";
  getContactID(uid:any){
    this.http.get(this.uidToContactIDUrl+uid).subscribe((res: any) => {
    this.resStringCID = JSON.stringify(res);
    this.contactObj = JSON.parse(this.gen.getDecodedString(this.resStringCID));  
    console.log("this is contactId:", this.contactObj[0].ContactId )
    this.contactID = this.contactObj[0].ContactId;
  });
}

  churchListUrl = ' https://apag.digitalchurch.tech/churchlist';
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
      this.donorListList.filter((dList: any) =>
        dList.displayName.toLowerCase().includes(filterValue)
      )[0].id
    );
    return this.donorListList.filter((dList: any) =>
      dList.displayName.toLowerCase().includes(filterValue)
    );
  }

  displayFn(donor: any): string {
    return donor && donor.displayName ? donor.displayName : '';
  }

  displayChFn(church: any): string {
    return church && church.churchName ? church.churchName : '';
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

  payModeUrl = 'https://apag.digitalchurch.tech/getPayMode';
  getPayModeData() {
    this.http.get(this.payModeUrl).subscribe((res: any) => {
      console.log(res);
      this.resStringPay = JSON.stringify(res);
      this.PayModeList = JSON.parse(
        this.gen.getDecodedString(this.resStringPay)
      );
    });
  }

  undefinedToEmpty($theStr: any) {
    if ($theStr) {
      return $theStr;
    } else {
      return '';
    }
  }

  onFormSubmit() {
    this.router.navigate(["/membership-card"]);
    console.log("Giver : ", this.incomeForm.value.selectedDonorObj);
    console.log("Givings Form Submitted: ", this.incomeForm);
    // console.log(
    //   'Selected Donor Id:',
    //   this.incomeForm.value.selectedDonorObj.id
    // );
    console.log(
      'Selected Donor Id:',
      this.myId
    );
    

    const $qString: string =
      'amt=' +
      this.undefinedToEmpty(this.incomeForm.value.amt) +
      '&conId=' +
      // this.undefinedToEmpty(this.incomeForm.value.selectedDonorObj.id) +
       this.undefinedToEmpty(this.contactID) +
      '&recDate=' +
      formatDate(this.incomeForm.value.recDate, 'yyyy-MM-dd', 'en') +
      // '&churchName=' +
      // this.undefinedToEmpty(this.incomeForm.value.churchName) +
      '&payMode=' +
      this.undefinedToEmpty(this.incomeForm.value.payMode) +
      // '&inStatus=' +this.undefinedToEmpty(this.incomeForm.value.inStatus)+
      '&inStatus=' +
      this.undefinedToEmpty('Pending') +
      '&finType=' +
      this.undefinedToEmpty(this.incomeForm.value.finType) +
      // tslint:disable-next-line:no-unused-expression
      '&checkNo=' +
      this.undefinedToEmpty(this.incomeForm.value.checkNo) +
      // tslint:disable-next-line:no-unused-expression
      '&transNo=' +
      this.undefinedToEmpty(this.incomeForm.value.transNo);

    console.log(
      'submitted value URL:' + 'https://apag.digitalchurch.tech/addIncome?',
      $qString
    );

    let addIncomeURL: string = encodeURI(
      'https://apag.digitalchurch.tech/addIncome?' + $qString
    );

    console.log('this is to be put as addIncomeURL', addIncomeURL);
    this.putIncomeDataHttp(addIncomeURL);
    // this.incomeForm.reset();
  }

  putIncomeDataHttp(theIncomeURL: string) {
    this.http.get(theIncomeURL, { observe: 'response' }).subscribe((res) => {
      console.log('response printing::', res);

      if (res.status == 200) {
        let message = `Submitted ${formatDate(
          this.incomeForm.value.recDate,
          'yyyy-MM-dd',
          'en'
        )} ,financialType: ${this.incomeForm.value.finType}`;
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
  onCancel() {
    this.incomeForm.reset();
  }
}
