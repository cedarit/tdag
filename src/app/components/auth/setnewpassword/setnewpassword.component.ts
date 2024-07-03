import { Component, OnInit } from '@angular/core';
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
import { AuthenticateService } from '../../../services/authenticate.service';

export interface NewUserLoginResInt {
  is_error: number;
  error_message: string;
}

@Component({
  selector: 'app-setnewpassword',
  templateUrl: './setnewpassword.component.html',
  styleUrls: ['./setnewpassword.component.scss'],
})
export class SetnewpasswordComponent implements OnInit {
  gotError = false;
  failMessage = '';
  // servRes: any;
  newUserLoginRes: NewUserLoginResInt;
  uid = '';
  mobile = '';
  cid = '';

  setnewpasswordform: FormGroup;
  baseURL = '';
  password = '';
  hide = false;

  constructor(
    private actRoute: ActivatedRoute,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private router: Router,
    private authServ: AuthenticateService
  ) {}

  ngOnInit() {
    this.baseURL = localStorage.getItem('churchBaseURL');
    this.actRoute.paramMap.subscribe((params) => {
      //this.uid = params.get('uid');
      //this.cid = params.get('cid');
      this.mobile = params.get('mobile');
    });

    this.setnewpasswordform = new FormGroup({
      otp: new FormControl(null, Validators.required),
      pwd: new FormControl(null, Validators.required),
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
    this.password = this.setnewpasswordform.value.pwd;
    let $qString: string =
      'otp=' +
      this.undefinedToEmpty(this.setnewpasswordform.value.otp) +
      '&mobile=' +
      this.mobile +
      '&newPassword=' +
      this.undefinedToEmpty(this.setnewpasswordform.value.pwd);

    //http://192.168.1.15/drupaldev/setNewPassword?mobile=9866198608&OTP=7365&newPassword=test

    let verifyDataURL: string = encodeURI(
      this.baseURL + '/setNewPassword?' + $qString
    );
    console.log('this is VerifyLogin data', verifyDataURL);
    this.dataHttp(verifyDataURL);
  }

  dataHttp(verifyDataURL: string) {
    this.http
      .get(verifyDataURL, { observe: 'response' })
      .subscribe((res: any) => {
        console.log('loginResponse :', res);
        if (res.status == 200) {
          this.newUserLoginRes = res.body;
          console.log('response on verify otp and login', this.newUserLoginRes);
          if (this.newUserLoginRes.is_error == 0) {
            let message = `Signup completed`;
            this.onSuccessNewOTP(message, 'Success');

            // Now Login
            this.authServ.doAminLogin(this.mobile, this.password);
            this.router.navigate(['/churchhome']);

            // this.router.navigate(['./home']);
          } else {
            this.failMessage =
              'Login Error: ' + this.newUserLoginRes.error_message;
            this.onFailNewOTP(this.failMessage, ' Error');
            this.gotError = true;
          }
        }
      });
  }

  onSuccessNewOTP(message: string, action: string) {
    //1. show success message
    this._snackBar.open(message, action, {
      duration: 5000,
    });
    //2. route to Report page
  }
  onFailNewOTP(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 10000 });
  }
}
