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

// tslint:disable-next-line:class-name
export interface newUserLoginResInt {
  is_error: number;
}

@Component({
  selector: 'app-verifyandlogin',
  templateUrl: './verifyandlogin.component.html',
  styleUrls: ['./verifyandlogin.component.scss'],
})
export class VerifyandloginComponent implements OnInit {
  uid = '';
  cid = '';
  verifyloginform: FormGroup;
  newUserLoginRes: newUserLoginResInt;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.uid = params.get('uid');
      this.cid = params.get('cid');
    });

    this.verifyloginform = new FormGroup({
      otp: new FormControl(null, Validators.required),
      fname: new FormControl(null, Validators.required),
      lname: new FormControl(null, Validators.required),
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
    let $qString: string =
      'otp=' +
      this.undefinedToEmpty(this.verifyloginform.value.otp) +
      '&uid=' +
      this.uid +
      '&fn=' +
      this.undefinedToEmpty(this.verifyloginform.value.fname) +
      '&ln=' +
      this.undefinedToEmpty(this.verifyloginform.value.lname) +
      '&cid=' +
      this.cid +
      '&password=' +
      this.undefinedToEmpty(this.verifyloginform.value.pwd);

    let verifyDataURL: string = encodeURI(
      'http://192.168.1.15/drupaldev/doVerifyOTPAndLogin?' + $qString
    );

    console.log('this is VerifyLogin data', verifyDataURL);
    this.dataHttp(verifyDataURL);

    // this.router.navigate(['login']);
  }
  dataHttp(verifyDataURL: string) {
    this.http
      .get(verifyDataURL, { observe: 'response' })
      .subscribe((res: any) => {
        console.log('loginResponse :', res);
        this.newUserLoginRes = res.body;

        if (res.status == 200) {
          if (this.newUserLoginRes.is_error == 1) {
            console.log('this is error', this.newUserLoginRes);
          } else {
            let message = 'Successful';
            this.onSuccesfuldataSubmit(message, 'Done');
            this.router.navigate(['login']);
          }
        }
      });
  }

  onSuccesfuldataSubmit(message: string, action: string) {
    //1. show success message

    this._snackBar.open(message, action, {
      duration: 5000,
    });

    //2. route to Report page
  }
}
