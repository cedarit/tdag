import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;

  displayName: string = 'John Doe';
  phoneNumber: string = '1234567890';
  email: string = 'johndoe@example.com';
  photoUrl: string = '';
  isEditing: boolean = false;
  tempPhotoUrl: string = '';

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit() {
    // Fetch user data here
  }

  startEdit() {
    this.isEditing = true;
  }


  saveChanges() {
    // Implement API call to save changes
    console.log('Saving changes:', this.displayName, this.phoneNumber, this.email, this.photoUrl);
    // Here you would typically make an API call to save the data
    this.isEditing = false;
    this.showAlert('Profile updated successfully');
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onPhotoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tempPhotoUrl = e.target.result;
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
        this.photoUrl = this.tempPhotoUrl;
        this.saveChanges();
      } else {
        this.tempPhotoUrl = '';
      }
    });
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
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}