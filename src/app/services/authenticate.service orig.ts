import { Injectable, ɵbypassSanitizationTrustUrl } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { GeneralService } from "./general.service";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
} from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class AuthenticateService {
  userLoginResponseJSON: any = { token: "", sessid: "", session_name: "" }; //this saves complete server response
  loginToken: string;
  loginSessId: string;
  loginSession_name: string;
  userLoginResponseData = ""; //strigified JSON
  aminLogoutResponseJSON = {};
  aminLogoutResponseData = "";
  $baseURL = ""; // ToDo: get this from server, and use a Service to share
  loginEndpoint = "/app/user/login";
  logoutEndpoint = "/app/user/logout";
  //registerEndpoint = 'app/user/register',
  sessionTokenEndpoint = "/services/session/token";

  //declare localstorage variables
  sessionToken: any;
  theUid!: any;
  isZonalLeader: boolean;
  zoneInfo: any[];
  zondID: string;
  theUName: any;
  errors: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private genServ: GeneralService,
    private snackBar: MatSnackBar
  ) {
    this.$baseURL = genServ.appBaseURL;
    this.isZonalLeaderFn();
  }

  async doAminLogin(username: string, password: string) {
    // Step 1. Checking localstorage
    if (localStorage.getItem("aminUserInfo") != null) {
      this.isZonalLeaderFn();
      console.log("User already logged in");
      await this.router.navigate(["./home"]);
    } else {
      this.loginAminRESTAPI(username, password).subscribe(
        (loginResponse) => {
          this.userLoginResponseJSON = loginResponse;
          console.log(`login Response : ${this.userLoginResponseJSON}`);
          this.loginToken = this.userLoginResponseJSON.token;
          this.loginSessId = this.userLoginResponseJSON.sessid;
          this.loginSession_name = this.userLoginResponseJSON.session_name;

          console.log(`loginToken is: ${this.loginToken}`);
          console.log(`loginSessId is: ${this.loginSessId} `);
          console.log(`Session_name is: ${this.loginSession_name}`);
          console.log("Server Login Response ", this.userLoginResponseJSON);
          this.userLoginResponseData = JSON.stringify(
            this.userLoginResponseJSON
          );
          localStorage.setItem("aminUserInfo", this.userLoginResponseData);
          console.log(
            "doAminLogin: This is in localstorage: ",
            localStorage.getItem("aminUserInfo")
          );
          this.isZonalLeaderFn();
          window.location.reload();
          if (this.getUserID() > 0) {
            this.router.navigate(["./login"]);
            console.log("loggin succesful...");
          }
        },
        (error) => {
          this.errors = error;
          console.log("Error of Post", JSON.stringify(this.errors.error));
          this.showInvalidLoginAlert(
            JSON.stringify(this.errors.error).slice(2, -2)
          );
        }
      );
    }
  }

  getSessionToken() {
    return this.http.get(this.$baseURL + this.sessionTokenEndpoint, {
      responseType: "text",
    });
  }
  loginAminRESTAPI(uname: string, pwd: string) {
    return this.http.post(this.$baseURL + this.loginEndpoint, {
      username: uname,
      password: pwd,

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  async doAminLogout() {
    console.log("logout called");
    //Delete localStorage
    localStorage.removeItem("memberProfile");
    localStorage.removeItem("aminUserInfo");
    localStorage.removeItem("latestReleaseInfo");
    //Go to Login Page.
    await this.router.navigate(["/login"]);

    this.logoutAminRESTAPI().subscribe((logoutResponse) => {
      this.aminLogoutResponseJSON = JSON.stringify(logoutResponse);
      console.log("Server logOUT Response ", this.aminLogoutResponseJSON);
      this.aminLogoutResponseData = JSON.stringify(this.userLoginResponseJSON);
      localStorage.removeItem("aminUserInfo");
      console.log(
        "doAminLogout This is in localstorage: ",
        localStorage.getItem("aminUserInfo")
      );
    });
    window.location.reload();
    console.log("Going to login page");
  }
  logoutAminRESTAPI() {
    // first clear it locally
    localStorage.removeItem("aminUserInfo");

    return this.http.post(this.$baseURL + this.logoutEndpoint, null, {
      // responseType: 'json',
      headers: {
        "Content-type": "application/json",
        accept: "application/json",
        "X-CSRF-Token": this.loginToken,
        Cookie: this.loginSession_name + "=" + this.loginSessId,
      },
    });
  }

  public getUserID() {
    if (localStorage.getItem("aminUserInfo") != null) {
      // this.theUid = JSON.parse(localStorage.getItem("aminUserInfo")).user.uid;
      return this.theUid;
    } else {
      return -1;
    }
  }

  public getUserName() {
    if (localStorage.getItem("aminUserInfo") != null) {
      // this.theUName = JSON.parse(localStorage.getItem("aminUserInfo")).user.uname;
      return this.theUName;
    } else {
      return -1;
    }
  }

  public isZonalLeaderFn() {
    console.log(" Authenticate service isZonalLeaderFn called");

    if (localStorage.getItem("aminUserInfo") != null) {
      // const theAUI = JSON.parse(localStorage.getItem('aminUserInfo'));
      this.isZonalLeader = true;
      // if ('19' in theAUI.user.roles) { // 19 is key for NLAG Zone Leader
      //   this.isZonalLeader = true;
      //   console.log('The isZonalLeader is ', this.isZonalLeader);
      // } else {
      //   this.isZonalLeader = false;
      //   console.log('Zonal Leader not found');
      // }
    }
  }

  public setZoneInfo() {
    const uid = this.getUserID();
    const zoneIDURL = this.$baseURL + "/getZonalLeader?userID=" + uid;
    this.http.get(zoneIDURL).subscribe((res: any) => {
      this.zoneInfo = res;
      console.log("The zoneInfo is :", this.zoneInfo);
    });
  }

  public getZoneID() {
    const uid = this.getUserID();
    const zoneIDURL = this.$baseURL + "/getZonalLeader?userID=" + uid;
    this.http.get(zoneIDURL).subscribe((res: any) => {
      this.zoneInfo = res;
      console.log("The zoneInfo is :", this.zoneInfo);
      console.log("The this.zoneInfo[0].ZoneID is :", this.zoneInfo[0].ZoneID);
      this.zondID = this.zoneInfo[0].ZoneID;
    });
  }

  showInvalidLoginAlert(err: string) {
    this.snackBar.open(err, "OK", {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: "center",
      verticalPosition: "top", // only top and bottom
    });
  }
}
