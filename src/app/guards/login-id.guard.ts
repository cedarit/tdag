import { validateVerticalPosition } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginIdGuard implements CanActivate {
  pData: any;
    uiid: any;

  constructor(private router: Router) {
    const storedData = localStorage.getItem('aminUserInfo');
    this.pData = storedData ? JSON.parse(storedData) : null;
    this.uiid = this.pData.user.uid
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const allowedIds = ['59','60','61']; // List of allowed login IDs
    const userLoginId = this.uiid; // Replace with your logic to get the login ID
    let validValue:boolean;
      // console.log('Can Activate? :',(allowedIds.includes(userLoginId) ? true : false));
    return ((allowedIds.includes(userLoginId) ? true : false));
    // return ((ActivatedRouteSnapshot && RouterStateSnapshot && (allowedIds.includes(userLoginId) ? true : false)) ? true : false)
    // if (allowedIds.includes(userLoginId)) {
    //     console.log(`TRUE ** Valid User, ID List: ${allowedIds}. UserLoginId: ${userLoginId}`)
    //     validValue=true;
    //   return true;
    // } else {
      
    //   console.log(`FALSE ** Invalid User, ID List: ${allowedIds}. UserLoginId: ${userLoginId}`);
      
    //   validValue=false;      
      
       
    //   return false;
    // }
    
    console.log(`Can Activate?: ${validValue}`)
    return validValue;
  }
}
