import { Injectable } from '@angular/core';
import envConfig from './../env.json';
import { HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor() {}
  appBaseURL = envConfig.appBaseURL;
  webAppBaseURL = envConfig.webAppBaseURL;
  wappBaseURL = envConfig.memberDataURL;
  memberProfileUrl: string;

  private http: HttpClient;


    getDecodedString(theStr: string){
    return theStr.replace(/&#039;/g, '\'')
                  .replace(/&amp;/g, '&')
                  .replace(/&quot;/g, '\"')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>');
  }


   // // set Memebr Profile
   setMemberProfile() {
    const storedData = localStorage.getItem('aminUserInfo');
    let mData = storedData ? JSON.parse(storedData) : null;

    // ToDo: check to handel if mData is null
    this.memberProfileUrl = envConfig + mData.user.uid;
    this.http.get(this.memberProfileUrl).subscribe((res: any) => {
      let resString = JSON.stringify(res);
      localStorage.setItem("memberProfile", resString);

      let MemberProfileData = JSON.parse(this.getDecodedString(resString));
          console.log(
            localStorage.getItem("MemberProfileData")
          );

    });
  }
}
