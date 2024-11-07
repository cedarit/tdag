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
import { AuthenticateService, } from '../../../services/authenticate.service';
import { GeneralService } from '../../../services/general.service';

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
  appBaseURL = '';
  password = '';
  hide = false;

  constructor(
    private actRoute: ActivatedRoute,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private router: Router,
    private authServ: AuthenticateService,
    private genServ: GeneralService,
  ) {}

  ngOnInit() {
    this.appBaseURL = this.genServ.appBaseURL;
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
      this.appBaseURL + '/setNewPassword?' + $qString
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
            // call snack_bar
            let resetMessage = `Password reset successful. Logging you in...`;
            this.onSuccessPasswordResetAndLogin(resetMessage, 'Success').subscribe(()=>{

            //ToDO : There is an overlap here. The same function is called for Forgot Password and Sign UP. So not able to 
            // to put appropriate message. For now Aug 2024, only Forgot Password is considered/tested
              // let message = `Signup completed`;
              // this.onSuccessNewOTP(message, 'Success');
            // Now Login
            this.authServ.doAminLogin(this.mobile, this.password);
            this.router.navigate(['/churchhome']);

            // this.router.navigate(['./home']);
            });
         } else {
            this.failMessage =
              'Login Error: ' + this.newUserLoginRes.error_message;
            this.onFailNewOTP(this.failMessage, ' Error');
            this.gotError = true;
          }
        }
      });
  }

  // onSuccessPasswordResetAndLogin(message: string, action: string) {
  //   //1. show success message
  //   this._snackBar.open(message, action, {
  //     duration: 2000,
  //   });
  // }
  onSuccessPasswordResetAndLogin(message: string, action: string) {
    let snackBarRef = this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['enhanced-snackbar'],
      verticalPosition: 'top'  // This will make the snackbar appear at the top of the screen
    });
  
    return snackBarRef.afterDismissed();
  }

  onSuccessNewOTP(message: string, action: string) {
    //1. show success message
    this._snackBar.open(message, action, {
      duration: 5000,
    });
    //2. route to Report page
  }
  onFailNewOTP(message: string, action: string) {
    let snackBarRef = this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['enhanced-snackbar'],
      verticalPosition: 'top'  // This will make the snackbar appear at the top of the screen
    });
  
    return snackBarRef.afterDismissed();
  }
}
