import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  password: string;
  showPassword: boolean = true;
  isElement: boolean = false;

  handlePasswordInput(event: any) {
    this.showPassword = true;
    setTimeout(() => {
      this.showPassword = false;
    }, 500); // 1000 milliseconds = 1 second
  }

  // togglePasswordVisibility() {
  //   setTimeout(() => {
  //     this.showPassword = false;
  //     // this.showPassword = !this.showPassword;
  //   }, 1000);
  //   this.showPassword = !this.showPassword;
  // }
  theUid: number;

  myFormControl: FormControl;

  constructor(
    private authenSer: AuthenticateService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.myFormControl = new FormControl('', Validators.required);
  }

  async ngOnInit() {
    const storedData = localStorage.getItem('aminUserInfo');
    const pData = storedData ? JSON.parse(storedData) : null;
    const myRole = pData.user.roles[7];

    if (storedData != null) {
      myRole === 'Executive Committe'
        ? (this.router.navigate(['./home']), (this.isElement = true))
        : (this.router.navigate(['./membership_card']),
          (this.isElement = false));
      // ((myRole === "Executive Committe") ? (this.router.navigate(['./home']),this.isElement=true) : (this.router.navigate(['./membership-card']),this.isElement=false));
      // ((myRole === "Executive Committe") ? this.isElement=true : this.isElement=false);
    }
  }

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  loginSubmit() {
    if (this.form.valid) {
      if (
        this.authenSer.doAminLogin(
          this.form.value.username,
          this.form.value.password
        )
      ) {
        this.form.reset();
        // this.router.navigate(['/login']);
      } else {
        this.showInvalidLoginAlert();
        this.router.navigate(['/login']);
      }
    }
  }

  //   }
  // }

  // loginSubmit() {
  //   if (this.form.valid) {
  //     this.authenSer.doAminLogin(this.form.value.username, this.form.value.password);
  //   }
  //   else{
  //     this.showInvalidLoginAlert();
  //     this.router.navigate(['/login']);
  //   }
  // }

  showInvalidLoginAlert() {
    this.snackBar.open(
      'Invalid Username or Password. Please try again.',
      'OK',
      {
        duration: 3000, // Duration in milliseconds
        horizontalPosition: 'center',
        verticalPosition: 'top',
      }
    );
  }

  async onLogout() {
    await this.router.navigate(['/login']);
    this.authenSer.doAminLogout();
  }

  async onCancel() {
    await this.router.navigate(['/login']);
  }

  async onSignUp() {
    await this.router.navigate(['/signup']);
  }

  async onForgotPassword() {
    await this.router.navigate(['/forgotpassword']);
  }

  getErrorMessage() {
    if (this.myFormControl.hasError('required')) {
      // return 'This field is required';
    }
  }

  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();
}
