import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-whatsapp-support',
  templateUrl: './whatsapp-support.component.html',
  styleUrls: ['./whatsapp-support.component.scss']
})
export class WhatsAppSupportComponent implements OnInit {
  private supportPhoneNumber = '9866198608';
  userPhoneNumber: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.userPhoneNumber = this.route.snapshot.paramMap.get('phoneNumber');
  }

  startWhatsAppChat() {
    const message = encodeURIComponent(`Hello, I need help. My phone number is ${this.userPhoneNumber}. My name is: `);
    const whatsappLink = `https://wa.me/${this.supportPhoneNumber}?text=${message}`;
    window.open(whatsappLink, '_blank');
  }
} 