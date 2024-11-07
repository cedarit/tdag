import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-whatsapp-support',
  templateUrl: './whatsapp-support.component.html',
  styleUrls: ['./whatsapp-support.component.scss']
})
export class WhatsAppSupportComponent implements OnInit {
  whatsappForm: FormGroup;
  gotError = false;
  failMessage = '';


  private supportPhoneNumber = '+919908016285';
  userPhoneNumber: string;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  ngOnInit() {
    // this.userPhoneNumber = this.route.snapshot.paramMap.get('phoneNumber');
       // Form is now initialized in the constructor
    // this.whatsappForm = this.formBuilder.group({
    //   phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    // });

  }
  private initForm() {
    this.whatsappForm = this.formBuilder.group({
      phoneNumber: ['', [
        Validators.required, 
        Validators.pattern('^[1-9]{1}[0-9]{9}$')
      ]]
    });
  }

  onSubmit() {
    if (this.whatsappForm.valid) {
      const userPhoneNumber = this.whatsappForm.get('phoneNumber').value;
      this.startWhatsAppChat(userPhoneNumber);
    }else {
      this.gotError = true;
      this.failMessage = 'Please enter a valid 10-digit mobile number.';
    }
  }

  startWhatsAppChat(userPhoneNumber: string) {
    const message = encodeURIComponent(`Hello, I need help. My phone number is ${userPhoneNumber}. My name is: `);
    const whatsappLink = `https://wa.me/${this.supportPhoneNumber}?text=${message}`;
    window.open(whatsappLink, '_blank');
    this.showSuccessMessage('WhatsApp chat opened successfully');
  }

  showSuccessMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
} 