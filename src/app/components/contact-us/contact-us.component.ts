import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpUrlEncodingCodec } from '@angular/common/http';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  baseURL?: string;
  officeAddressURL = '';
  phonesURL = '';
  emailsURL = '';

  resString?: string;
  addresses?: string;
  phones?: string;
  emailids?: string;

  contactInfo = {
    name: ' TDAG',
    address: ' Telangana, INDIA',
    mobile1: 9849721295,
    mobile2: 9849187697,
    mobile3: 8897922108,
    email: ' principal.apbc@gmail.com',
    website: ' apbiblecollege.com',
  };

  constructor() {}
  // constructor( private httpClient: HttpClient,
  //              private genServ: GeneralService) {
  //                this.baseURL = this.genServ.appBaseURL;
  //                this.officeAddressURL = this.baseURL + '/app/contactUsAddress';
  //                this.phonesURL = this.baseURL + '/app/contactUsPhone';
  //                this.emailsURL = this.baseURL + '/app/contactUsEmail';
  //              }

  ngOnInit() {
    // this.getOfficeAddress();
    // this.getOfficePhones();
    // this.getOfficeEmails();
  }
  // doRefresh(event) {
  //   this.getOfficeAddress(event);
  //   setTimeout(() => {
  //     console.log('Refresh operation has ended');
  //     event.target.complete();
  //   }, 1000);
  //   this.getOfficePhones(event);
  //   setTimeout(() => {
  //     console.log('Refresh operation has ended');
  //     event.target.complete();
  //   }, 1000);
  //   this.getOfficeEmails(event);
  //   setTimeout(() => {
  //     console.log('Refresh operation has ended');
  //     event.target.complete();
  //   }, 1000);
  // }

  // getOfficeAddress(event?: any) {
  //   this.httpClient.get(this.officeAddressURL).subscribe((res: any[]) => {
  //     console.log(res);
  //     this.resString = JSON.stringify(res);
  //     this.addresses = JSON.parse(this.genServ.getDecodedString(this.resString));
  //     console.log('The address', this.addresses[0].Address);
  //   });
  // }
  // getOfficePhones(event?: any) {
  //   this.httpClient.get(this.phonesURL).subscribe((res: any[]) => {
  //     console.log(res);
  //     this.resString = JSON.stringify(res);
  //     this.phones = JSON.parse(this.genServ.getDecodedString(this.resString));
  //   });
  // }
  // getOfficeEmails(event?: any) {
  //   this.httpClient.get(this.emailsURL).subscribe((res: any[]) => {
  //     console.log(res);
  //     this.resString = JSON.stringify(res);
  //     this.emailids = JSON.parse(this.genServ.getDecodedString(this.resString));
  //   });
  // }
}
