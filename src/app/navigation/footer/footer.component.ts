import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { appVersion } from 'src/app/services/appVersion';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { Router } from '@angular/router';
// import { UserInfoService } from '../../user-info.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  isUserLoggedInBool = false;
  isLoggedIn: boolean = false;
  isElement: boolean;
  isIcon: boolean = true;
  constructor(private authenSer: AuthenticateService,
    public dialog: MatDialog,
    private router: Router
    // private uInfoServ: UserInfoService
  ) { 
    // this.isUserLoggedInBool = this.uInfoServ.isUserLoggedIn();
  }

  ngOnInit() {
    const storedData = localStorage.getItem('aminUserInfo');   
    const pData = storedData ? JSON.parse(storedData) : null;   
    const myRole=pData.user.roles[7];

    if (storedData !=null){
      this.isLoggedIn=true;
    }

    if( storedData != null ) {      
      ((myRole === "Executive Committe") ? this.router.navigate(['./home']) : this.router.navigate(['./membership-card']));
      ((myRole === "Executive Committe") ? this.isElement=true : this.isElement=false);
      
    }







    if (localStorage.getItem('aminUserInfo') != null) {
      console.log(`User is already logged in!`);
      this.isLoggedIn = true;
    }
  }

  onTheLogin(){
    
  }

  

}
