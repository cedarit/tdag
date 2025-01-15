// login.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  hidePassword = true;
  isElement = false;
  loading = false;

  @Input() error: string | null = null;
  @Output() submitEM = new EventEmitter();

  constructor(
    private authService: AuthenticateService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  async ngOnInit() {
    const storedData = localStorage.getItem('aminUserInfo');
    if (storedData) {
      const pData = JSON.parse(storedData);
      const myRole = pData.user.roles[7];
      
      if (myRole === 'Executive Committe') {
        this.router.navigate(['./home']);
        this.isElement = true;
      } else {
        this.router.navigate(['./membership_card']);
        this.isElement = false;
      }
    }
  }

  async loginSubmit() {
    if (this.form.valid) {
      this.loading = true;
      try {
        const success = await this.authService.doAminLogin(
          this.form.value.username,
          this.form.value.password
        );
        
        if (success !== undefined && success !== null) {
          this.form.reset();
        } else {
          this.showInvalidLoginAlert();
          this.router.navigate(['/login']);
        }
      } finally {
        this.loading = false;
      }
    }
  }

  showInvalidLoginAlert() {
    this.snackBar.open('Invalid Username or Password. Please try again.', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  async onForgotPassword() {
    await this.router.navigate(['/forgotpassword']);
  }

  async onNewUserWhatsApp() {
    await this.router.navigate(['/whatsapp-support/:phoneNumber']);
  }
}