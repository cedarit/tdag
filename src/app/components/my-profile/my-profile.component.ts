//Author Pankaj
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http'; 
import { GeneralService } from 'src/app/services/general.service';

export interface uDataIntf {
  dn: string;// display name?
  urrl: string;
  phoneno: string;
  user: { 'uid': string};
  photourl: string;
}


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;

  displayName: string;
  phoneNumber: string;
  email: string;

  photoUrl: string = '';
  isEditing: boolean = false;
  formChanged: boolean = false;
  contactID: string;
  uData: uDataIntf;
  uiid: string;
  theUid!: any;

  




  private initialState: any;

  constructor(
    private snackBar: MatSnackBar, 
    private http: HttpClient,
    private gen: GeneralService,
    private dialog: MatDialog, ) {
    
   }

  ngOnInit() {
   // Fetch user data here
   this.prepareUserProfile().then(() => {
    this.getProfile();
    this.saveInitialState();
  });
  }

  private saveInitialState() {
   this.initialState = {
     displayName: this.displayName,
     phoneNumber: this.phoneNumber,
     email: this.email,
     photoUrl: this.photoUrl
    };
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.saveInitialState();
    } else if (this.formChanged) {
      this.saveChanges();
    }
    this.formChanged = false;
  }

  onInputChange() {
    this.formChanged = 
      this.displayName !== this.initialState.displayName ||
      this.phoneNumber !== this.initialState.phoneNumber ||
      this.email !== this.initialState.email ||
      this.photoUrl !== this.initialState.photoUrl;
  }

  uidToContactIDUrl = "https://apag.digitalchurch.tech/getContactIdfromUid?uid=";
  getContactID(uid: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get(this.uidToContactIDUrl + uid).subscribe({
        next: (res: any) => {
          let resStringCID = JSON.stringify(res);
          let contactObj = JSON.parse(this.gen.getDecodedString(resStringCID));
          console.log("this is contactId:", contactObj[0].ContactId);
          this.contactID = contactObj[0].ContactId;
          resolve(this.contactID);
        },
        error: (error) => {
          console.error("Error fetching contact ID:", error);
          reject(error);
        }
      });
    });
  }


  async saveChanges() {
    const storedData = localStorage.getItem('aminUserInfo');
    this.uData = storedData ? JSON.parse(storedData) : null;
    this.uiid = this.uData.user.uid;
  
    try {
      const contactId = await this.getContactID(this.uiid);
      let $emailQString: string = "email=" + this.email + "&conId=" + contactId;
      let $emailUpdateURL: string = encodeURI('https://apag.digitalchurch.tech/profileUpdate?' + $emailQString);
      
      console.log('the url is: ', $emailUpdateURL);
      console.log('Saving changes: contactid', contactId, 'this.phoneNumber:' + this.phoneNumber, 'this.email: ' + this.email, this.photoUrl);
      
      await this.doEmailUpdateHTTP($emailUpdateURL);
      
      this.formChanged = false;
      this.saveInitialState();
      this.showAlert('Profile updated successfully');
    } catch (error) {
      console.error("Error in saveChanges:", error);
      this.showAlert('Failed to update profile');
    }
  }
  

  

  doEmailUpdateHTTP(emailUpdateURL: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get(emailUpdateURL, { observe: 'response' }).subscribe({
        next: (res) => {
          console.log('response printing::', res);
          if (res.status == 200) {
            let message = `Submitted email Update: ${this.displayName}, Email: ${this.email}`;
            this.onSuccesfulProfileSubmit(message, 'Done');
            console.log(message);
            resolve();
          } else {
            reject(new Error('Non-200 status code'));
          }
        },
        error: (error) => {
          console.error('Error in doEmailUpdateHTTP:', error);
          reject(error);
        }
      });
    });
  }
  
  onSuccesfulProfileSubmit(message: string, action: string) {
    //1. show success message

    this.snackBar.open(message, action, {
      duration: 5000,
    });

    //2. route to Report page
  }


  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onPhotoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoUrl = e.target.result;
        this.onInputChange(); 
        this.confirmPhotoUpdate();
      };
      reader.readAsDataURL(file);
    }
  }

  confirmPhotoUpdate() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Do you want to save this new profile photo?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.formChanged = true; // Add this line
        this.saveChanges();
      } else {
        // Revert the photo change if not confirmed
        this.photoUrl = this.initialState.photoUrl;
        this.onInputChange(); //to update formChanged flag
      }
    });
  }
public getUserID() {
    if (localStorage.getItem("aminUserInfo") != null) {
      this.theUid = JSON.parse(localStorage.getItem("aminUserInfo")).user.uid;
      return this.theUid;
    } else {
      return -1;
    }
  }

  prepareUserProfile(): Promise<void> {
    return new Promise((resolve) => {
      console.log("Entering prepareUserProfile");
      const userId = this.getUserID();
      console.log("User ID:", userId);
  
      if (userId === -1) {
        console.error("Invalid user ID. Cannot fetch profile.");
        resolve();
        return;
      }
  
      let $userProfileURL = 'https://apag.digitalchurch.tech/memberData?uid=' + userId;
      console.log("Profile URL:", $userProfileURL);
  
      this.http.get($userProfileURL).subscribe({
        next: (res: any) => {
          console.log("Received response:", res);
          localStorage.setItem("userProfileInfo", JSON.stringify(res));
          resolve();
        },
        error: (error) => {
          console.error("Error fetching user profile:", error);
          resolve();
        },
        complete: () => {
          console.log("Profile fetch completed");
        }
      });
    });
  }

  getProfile() {
    // Read userProfileInfo
    const userProfileInfoString = localStorage.getItem('userProfileInfo');
    let profile: any = {};
  
    if (userProfileInfoString) {
      try {
        const userProfileInfo = JSON.parse(userProfileInfoString);
        if (Array.isArray(userProfileInfo) && userProfileInfo.length > 0) {
          profile = userProfileInfo[0];
        } else {
          console.warn('User profile info is empty or not in expected format');
        }
      } catch (error) {
        console.error('Error parsing user profile info:', error);
      }
    } else {
      console.warn('No user profile info found in localStorage');
    }
  
    // Read aminUserInfo for email
    const aminUserInfoString = localStorage.getItem('aminUserInfo');
    let aminUserInfo: any = {};
  
    if (aminUserInfoString) {
      try {
        aminUserInfo = JSON.parse(aminUserInfoString);
      } catch (error) {
        console.error('Error parsing aminUserInfo:', error);
      }
    } else {
      console.warn('No aminUserInfo found in localStorage');
    }
  
    // Populate component properties
    this.displayName = profile.displayName || 'N/A';
    this.photoUrl = profile.URL || '';
    this.phoneNumber = profile.PhoneNumber || 'N/A';
    this.email = aminUserInfo.user?.mail || 'N/A';
  
    // Additional properties you might want to use
    // this.designation = profile.Designation || 'N/A';
    // this.id = profile.id || '';
    // this.uid = aminUserInfo.user?.uid || '';
  
    console.log('Profile loaded:', { ...profile, email: this.email });
  }
  

  showAlert(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
}

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>Confirm Action</h2>
    <mat-dialog-content>{{data.message}}</mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Confirm</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}
}