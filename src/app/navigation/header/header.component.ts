import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { appVersion } from 'src/app/services/appVersion';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  @Output() sidenavToggle = new EventEmitter<void>();
  constructor(private authenSer: AuthenticateService) { }
  

  ngOnInit() {
    if (localStorage.getItem('aminUserInfo') != null) {
      console.log(`User is already logged in!`);
      this.isLoggedIn = true;
    }
    else {
      console.log('User NOT logged in', localStorage.getItem('aminUserInfo'));
    }
  }

  isUserLoggedIn() {
    if (this.authenSer.getUserID() > 0) {
      return true;
    } else {
      return false;
    }
  }

  onToggleSidenav() {
    
     this.sidenavToggle.emit();
  }
}
