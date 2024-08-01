import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../../services/general.service';


import {
  NgForm,
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface newUserResInt {
  is_error: number;
  error_code?: string;
  error_data?: string;
  error_message?: string;
  uid?: number;
  cid?: number;
}

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss'],
})

// tslint:disable-next-line:class-name
export class ForgotpasswordComponent implements OnInit {
  gotError = false;
  failMessage = '';
  newUserRes: newUserResInt;
  forgotpwdform: FormGroup;
  baseURL: string;
  mobile: number;

  constructor(
    // private route: ActivatedRoute,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private router: Router,
    private genServ: GeneralService
  ) {}

  ngOnInit() {
    //this.baseURL = localStorage.getItem('churchBaseURL'); // forgot password cannot use localstorage as user might not have logged in
    this.baseURL= this.genServ.appBaseURL;

    console.log('Church Base URL: ', this.baseURL);
    this.forgotpwdform = new FormGroup({
      // emailid : new FormControl(null, Validators.required),
      phoneno: new FormControl(null, Validators.required),
    });
  }

  onFormSubmitWhatsApp() {
    if (this.forgotpwdform.valid) {
      const phoneNumber = this.forgotpwdform.get('phoneno').value;
      this.router.navigate(['/whatsapp-support', phoneNumber]);
    } else {
      this.gotError = true;
      this.failMessage = 'Please enter a valid 10-digit phone number.';
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
    this.mobile = this.forgotpwdform.value.phoneno;

    let $qString: string =
      'mobile=' + this.undefinedToEmpty(this.forgotpwdform.value.phoneno);
    // "&email=" + this.undefinedToEmpty(this.signupform.value.emailid);
    let forgotpwdDataURL: string = encodeURI(
      this.baseURL + '/forgotPasswordOTP?' + $qString
    );
    console.log('this is forgot pwd data', forgotpwdDataURL);
    this.forgotpwdHttp(forgotpwdDataURL);
  }

  forgotpwdHttp(forgotpwdDataURL: string) {
    this.http
      .get(forgotpwdDataURL, { observe: 'response' })
      .subscribe((res: any) => {
        console.log('Response :', res);
        if (res.status == 200) {
          // got success of http call
          this.newUserRes = res.body;
          if (this.newUserRes.is_error == 0) {
            let message = `OTP sent to this mobile number: ${this.forgotpwdform.value.phoneno}`;
            this.onSuccess(message, 'Success');
            this.gotError = false;
            this.router.navigate(['setnewpassword', this.mobile]);
          } else {
            this.failMessage =
              'forgot password Error:' + this.newUserRes.error_message;
            this.onFailPwd(this.failMessage, ' Error');
            this.gotError = true;
          }
        } else {
          this.gotError = true;
          this.failMessage =
            'Invalid response. Either you are offline or there is a server side error.';
        }
      });
  }

  onSuccess(message: string, action: string) {
    //1. show success message
    this._snackBar.open(message, action, {
      duration: 2000,
    });
    //2. route to Report page
  }

  onFailPwd(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 10000 });
  }
}
