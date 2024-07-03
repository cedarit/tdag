import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor() {}
    appBaseURL = 'https://apag.digitalchurch.tech';
    webAppBaseURL = 'https://app.tdsiag.org';
    getDecodedString(theStr: string){
    return theStr.replace(/&#039;/g, '\'').replace(/&amp;/g, '&').replace(/&quot;/g, '\"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  }
}
