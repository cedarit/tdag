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
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface newUserResInt {
  is_error: number;
  uid: number;
  cid: number;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  //maxDate
  signupform: FormGroup;
  newUserRes: newUserResInt;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.signupform = new FormGroup({
      emailid: new FormControl(null, Validators.required),
      phoneno: new FormControl(null, Validators.required),
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
      'mobile=' +
      this.undefinedToEmpty(this.signupform.value.phoneno) +
      '&email=' +
      this.undefinedToEmpty(this.signupform.value.emailid);

    let signupDataURL: string = encodeURI(
      'http://192.168.1.15/drupaldev/getNewUserOTP?' + $qString
    );

    console.log('this is Signupform data', signupDataURL);
    this.signupHttp(signupDataURL);

    this.router.navigate(['verifyandlogin']);
  }
  signupHttp(thesignupURL: string) {
    this.http
      .get(thesignupURL, { observe: 'response' })
      .subscribe((res: any) => {
        console.log('SignupResponse :', res);
        this.newUserRes = res.body;

        if (res.status == 200) {
          if (this.newUserRes.is_error == 1) {
            console.log('this is error', this.newUserRes);
          } else {
            let message = 'Successful';
            this.onSuccesfuldataSubmit(message, 'Done');
            this.router.navigate([
              'verifyandlogin',
              this.newUserRes.uid,
              this.newUserRes.cid,
            ]);
          }
          //let message =  `emailid: ${this.signupform.value.emailid}`;
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
