import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {  HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate} from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralService} from '../../services/general.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatInput } from '@angular/material/input';
import { MatFormField } from "@angular/material/form-field";


export interface Donor {
  displayName: string;
  id: number;
}
@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
})


export class ExpensesComponent implements OnInit {


  expensesForm: FormGroup;
  submitted = false;
  uid: any;
  PayModeList: any = [];
  donorList: any[];
  ContributionStatusList: any = [];
  FinTypeList: any = [];
  resStringPay: string;
  resStringConStatus: string;
  resStringFinType: string;
  displayName: any;
  control: any;
  donors: Donor[];
  maxDate:any;
  minDate:any;
  file:any;
  selectedDonorObj = new FormControl(null, Validators.required);

  filteredOptions: Observable<Donor[]>;
  httpClient: any;
  genServ: any;

  selectedFile: File | null = null;

  constructor( private route: ActivatedRoute, 
    private http:HttpClient,
    private _snackBar: MatSnackBar,   
    private router: Router,
    private gen: GeneralService 
     ) {
  this.getPayModeData();
  this.getFinType();
  this.getContributionStatus();

    }

    myControl = new FormControl();
    donorListList: any[] = [];
    // tslint:disable-next-line:ban-types
    //filteredOptions: Observable<String[]>;
    //donorList = new FormControl();


//contactId  = 51 is for Telugu Dist contact Id
    //http://192.168.1.44/trola/addIncome?amt=201&conId=52&recDate=23-05-2021&payMode=Cash&inStatus=Completed

  ngOnInit() {
    this.expensesForm = new FormGroup({
      amt : new FormControl(),
      // conId : new FormControl(),
      recDate : new FormControl(),
      payMode : new FormControl(),
      inStatus : new FormControl(),
      // finType : new FormControl(),
      // checkNo : new FormControl(),
      desc: new FormControl(),
      // filen: new FormControl(),
      // transNo : new FormControl(),
      // donorList : new FormControl(),
      sourceCon: new FormControl(),
      file2Upload:new FormControl(),
      // selectedDonorObj : new FormControl(null, Validators.required),
  });

  // selectedDonorObj : this.selectedDonorObj,

    this.getdonorData();


  }

  filterDonor(){
    this.filteredOptions = this.selectedDonorObj.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.displayName),
      map(name => name ? this._filter(name) : this.donors.slice())
      // map(value => this._filter(value))
    );

  }
  private _filter(value: string): Donor[] {
    const filterValue = value.toLowerCase();

    // return this.churches.filter(church => church.ChurchName.toLowerCase().indexOf(filterValue) === 0);
    return this.donors.filter(donor => donor.displayName.toLowerCase().includes(filterValue));
  }

 // tslint:disable-next-line:member-ordering
 //donorListUrl = 'http://192.168.1.44/trola/totalMemberList';
 donorListUrl = ' https://apag.digitalchurch.tech/totalMemberList';

getdonorData() {
this.http.get(this.donorListUrl).subscribe((res) => {
  console.log(res);
  this.resStringPay    = JSON.stringify(res);
  this.donors = JSON.parse(this.gen.getDecodedString(this.resStringPay));
  //this.donorListList = res;
  console.log('This is list: ', this.donors);
  this.filterDonor();


 } );
}

private _filteredOptions(value: string): string[] {
  const filterValue = value.toLowerCase();
  console.log (this.donorListList.filter(dList => dList.displayName.toLowerCase().includes(filterValue))[0].id);
  return this.donorListList.filter(dList => dList.displayName.toLowerCase().includes(filterValue));

}

displayFn(donor: any): string {
  return donor && donor.displayName ? donor.displayName : '';
}


//contributionStatusUrl = 'http://192.168.1.44/trola/getContStatus';
// contributionStatusUrl = 'https://apag.digitalchurch.tech/getContStatus';
contributionStatusUrl = 'http://192.168.1.44/trola/getExpenseStatus';
getContributionStatus(){
  this.http.get(this.contributionStatusUrl).subscribe((res)=>{
    console.log(res);
    this.resStringConStatus    = JSON.stringify(res);
    this.ContributionStatusList = JSON.parse(this.gen.getDecodedString(this.resStringConStatus));

   } );
}

//FinTypeUrl="http://192.168.1.44/trola/getFinType";
FinTypeUrl="https://apag.digitalchurch.tech/getFinType";
getFinType(){
  this.http.get(this.FinTypeUrl).subscribe((res)=>{
    console.log(res);
    this.resStringFinType    = JSON.stringify(res);
    this.FinTypeList = JSON.parse(this.gen.getDecodedString(this.resStringFinType));

   } )
}

// payModeUrl="http://192.168.1.44/trola/getPayMode";
// payModeUrl="https://apag.digitalchurch.tech/getPayMode";
payModeUrl="http://192.168.1.44/trola/getExpenseType";
  getPayModeData(){
  this.http.get(this.payModeUrl).subscribe((res) => {
    console.log(res);
    this.resStringPay    = JSON.stringify(res);
    this.PayModeList = JSON.parse(this.gen.getDecodedString(this.resStringPay));
   } );
}


undefinedToEmpty($theStr: any){
  if($theStr){
    return $theStr;
  }
  else{
    return "";
  }
}

onFormSubmit(){
      // console.log("Expenses FORM Values: Donor: ",this.expensesForm.value.selectedDonorObj);
      console.log("Expenses FORM SUBMITTED: ",this.expensesForm);
    //  console.log("donors FORM Values: ",this.myControl.value.selectedDonorObj[0].id);

        // let uInfo  =JSON.parse(localStorage.getItem( "aminUserInfo"));
        // let uid :string =uInfo.user.uid;

        // Old AddIncome URL
      const $qString: string =
        'amt=' + this.undefinedToEmpty(this.expensesForm.value.amt)+
        // '&conId=' +this.undefinedToEmpty(this.expensesForm.value.selectedDonorObj.id)+
        '&conId=' +52+
        '&recDate=' +formatDate(this.expensesForm.value.recDate, 'yyyy-MM-dd','en')+
        '&payMode=' +this.undefinedToEmpty(this.expensesForm.value.payMode)+
        '&inStatus=' +this.undefinedToEmpty(this.expensesForm.value.inStatus)+  
        '&finType=' +this.undefinedToEmpty(this.expensesForm.value.finType)+
        // tslint:disable-next-line:no-unused-expression
        '&checkNo=' +this.undefinedToEmpty(this.expensesForm.value.checkNo)+
        // tslint:disable-next-line:no-unused-expression
        '&transNo=' +this.undefinedToEmpty(this.expensesForm.value.transNo);
        

      // NEW addExpensesURL 4 August 2023
      const $eString: string =
        'amt=' + this.undefinedToEmpty(this.expensesForm.value.amt)+        
        '&conId=' +52+
        '&recDate=' +formatDate(this.expensesForm.value.recDate, 'yyyy-MM-dd','en')+
        '&payMode=' +this.undefinedToEmpty(this.expensesForm.value.payMode)+
        '&inStatus=' +this.undefinedToEmpty(this.expensesForm.value.inStatus)+  
        '&desc='+this.undefinedToEmpty(this.expensesForm.value.desc)+
        // '&source_conId='+this.undefinedToEmpty(this.expensesForm.value.sourceCon)
        '&source_conId='+this.undefinedToEmpty(this.selectedDonorObj.value.id)+
        '&file2Upload='+this.undefinedToEmpty(this.expensesForm.value.file2Upload)



        
        // amt=2300&conId=2&source_conId=52&recDate=09-06-2021&payMode=Cash&inStatus=Approved&description=expenseforcards1
        // amt=2099&
        // conId=52&
        // recDate=09-06-2021&
        // payMode=Cash&
        // inStatus=Approved&
        // description=expenseforcards1"

      

      // http://192.168.1.44/trola/addIncome?amt=201&conId=52&recDate=23-05-2021&payMode=Cash&inStatus=Completed&finType=Donation&checkNo=123&transNo=1222
        //console.log("submitted value URL:" + "http://192.168.1.44/trola/addIncome?",$qString );
        // console.log("submitted value URL:" + "https://apag.digitalchurch.tech/addIncome?",$qString );
            
        //let addIncomeURL: string=encodeURI("http://192.168.1.44/trola/addIncome?"+$qString);
        // let addIncomeURL: string=encodeURI("https://apag.digitalchurch.tech/addIncome?"+$qString);

        // Date: 4 August 20
        // http://192.168.1.44/trola/addExp?amt=2099&conId=52&recDate=09-06-2021&payMode=Cash&inStatus=Approved&description=expenseforcards1 


        // let addIncomeURL: string=encodeURI("https://apag.digitalchurch.tech/addIncome?"+$qString);
        

        // check all the fields below and replace the qString above
        // let addIncomeURL: string=encodeURI("http://192.168.1.44/trola/addExp?amt=2099&conId=52&recDate=09-06-2021&payMode=Cash&inStatus=Approved&description=expenseforcards1"+$qString); is to replace the above addIncome
        
        let addExpensesURL: string=encodeURI("http://192.168.1.44/trola/addExp?"+$eString);  
        // let addExpensesURL: string=encodeURI("http://192.168.1.44/trola/addExp?amt=2300&conId=2&source_conId=52&recDate=09-06-2021&payMode=Cash&inStatus=Approved&desc=expenseforcards1");  
        // source_conId is added to the URL on August 9 2023.
            console.log("this is to be put as addExpensesURL", addExpensesURL);
            console.log('Paid to :'+this.selectedDonorObj.value.id)
            this.putExpensesDataHttp(addExpensesURL); 
  }
    
    // Also observe the response on visiting the url, read https://angular.io/guide/http#reading-the-full-response
    putExpensesDataHttp(theExpensesURL: string){

      this.http.get(theExpensesURL,  { observe: 'response' }).subscribe((res) => {
        console.log("response printing::", res);
         //let ccReportSubmitResponse = res;
       
        if(res.status == 200)
         { 
          let message =  ` ${formatDate(this.expensesForm.value.recDate, "yyyy-MM-dd",'en')} ,financialType: ${this.expensesForm.value.finType}`;
           this.onSuccesfulIncomeFormSubmit(message, "Done");
          console.log('Form values Submitted',message);
          //this.router.navigate(['IncomeComponent']);
        
          this.router.navigate(['./home']);

         }
    
       } );
     }
    
     onSuccesfulIncomeFormSubmit(message: string, action: string)
    {
      //1. show success message
        console.log('your Expenses are added.')
        this._snackBar.open(message, action, {
          duration: 5000,
        });
    
      //2. route to Report page
    
    }

    onCancel() {
      this.expensesForm.reset();
    }

   

    // File attachment field in form 
  // onFileSelected(event: any): void {
  //   this.selectedFile = event.target.files[0];
  // }

  // uploadFile(): void {
  //   if (this.selectedFile) {
  //     // Implement file upload logic here
  //   }
  // }

  // onFileSelected(event:any){
  //   this.file=event.target.files[0];
  //   console.log("File selected:",this.file);
  // }

  
  fileInput(){
    this.expensesForm.value.file2Upload=this.file;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (!this.selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('server-url/upload', formData).subscribe(
      (response) => {
        console.log('File uploaded successfully', response);
      },
      (error) => {
        console.error('Error uploading file', error);
      }
    );
  }
  

  }
  

