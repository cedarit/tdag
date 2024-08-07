import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { appVersion } from 'src/app/services/appVersion';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
})
export class SidenavListComponent implements OnInit {
  isLoggedIn: boolean = false;
  theAppVersion = appVersion;

  @Output() closeSidenav = new EventEmitter<void>();
  isElement: boolean = false;
  isLogin: boolean = false;

  constructor(
    private authenSer: AuthenticateService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.isUserLoggedIn();
  }

  updateLoginStatus(status: boolean) {
    this.isLoggedIn = status;
    // You might want to update other related variables here as well
    this.isLogin = status;
    // If you need to perform any other actions when login status changes, do them here
  }

  ngOnInit() {
    const storedData = localStorage.getItem('aminUserInfo');
    const pData = storedData ? JSON.parse(storedData) : null;

    if (storedData != null ? (this.isLogin = true) : (this.isLogin = false)) {
      pData.user.roles[7] === 'Executive Committe'
        ? this.router.navigate(['./home'])
        : this.router.navigate(['./announcements']);
      // ((pData.user.roles[7] === "Executive Committe") ? this.router.navigate(['./home']) : this.router.navigate(['./membership-card']));
      pData.user.roles[7] === 'Executive Committe'
        ? (this.isElement = true)
        : (this.isElement = false);

      this.isLoggedIn = true;
    }
  }

  onClose() {
    this.closeSidenav.emit();
  }

  closeAndLogout() {
    this.closeSidenav.emit();
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LogoutDialog, {
      width: '150px',
      height: '90px',
    });
    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log('The dialog was closed');
    // });
    dialogRef.componentInstance.logoutConfirmed.subscribe(() => {
      this.updateLoginStatus(false);
    });
    dialogRef.componentInstance.closeSidenav.subscribe(() => {
      this.closeSidenav.emit();
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  onLogout() {
    this.router.navigate(['./login']);
  }

  isUserLoggedIn() {
    if (this.authenSer.getUserID() > 0) {
      return true;
    } else {
      return false;
    }
  }

  canDisplay() {
    return this.isElement && this.isLoggedIn;
  }

  canDisplayL() {
    return this.isLogin;
  }

  isMenuItemVisible(route: any): boolean {
    // const routeSnapshot = this.router.config.find(config => config.path === route);
    const routeSnapshot = route;
    // console.log('can Activate?: ',routeSnapshot.CanActivateFn);
    // return (routeSnapshot.CanActivateFn);
    // console.log(`Route Snapshot: ${routeSnapshot}, routeSnapshot.canActivate: ${routeSnapshot.canActivate}`)

    if (
      routeSnapshot ||
      routeSnapshot.canActivate ||
      routeSnapshot.CanActivateFn
    ) {
      //  console.log('isMenuItemVisible: true');
      return true;
    } else {
      // console.log('isMenuItemVisible: valse...')
      return false;
    }
    // const guard = routeSnapshot.canActivate[0];
    // const canActivate = guard.canActivate(null, null);
    // console.log(`Guard: ${guard}, canActivate ${canActivate}`);

    // return canActivate;
  }
}

// Confirm Dialog

export interface DialogData {
  exit: string;
}

@Component({
  selector: 'logout-dialog',
  templateUrl: 'logout-dialog.html',
})
export class LogoutDialog {
  // isLogin = false;
  @Output() logoutConfirmed = new EventEmitter<void>();
  @Output() closeSidenav = new EventEmitter<void>();



  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<LogoutDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private authenSer2: AuthenticateService,
    private router: Router
  ) {}
  // @Output() closeSidenav = new EventEmitter<void>();

  onNoClick(): void {
    this.closeSidenav.emit();
    this.dialogRef.close();
  }

  async onYesClick() {
    this.closeSidenav.emit();
    await this.authenSer2.doAminLogout();
    this.dialogRef.close();
    // this.isLogin = false;
    this.logoutConfirmed.emit();
    this.router.navigate(['/login']);
  }
}
