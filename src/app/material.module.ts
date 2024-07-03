import { NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
    imports: [
        MatButtonModule,
        MatIconModule, 
        MatFormFieldModule, 
        MatInputModule, 
        MatDatepickerModule,
        MatNativeDateModule, 
        MatCheckboxModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatCardModule,
        MatDialogModule, 
        MatProgressSpinnerModule,
        MatRadioModule,
        MatSortModule,
        MatTableModule,
        MatPaginatorModule,
        MatSnackBarModule,
        MatBottomSheetModule,
        MatExpansionModule,
        MatGridListModule,
        NativeDateModule,
        MatSelectModule,
        MatAutocompleteModule,
        // MatBottomSheetRefModule,
        // MatDialogRefModule, 
        // <any>MAT_DIALOG_DATA
        ],

    exports: [
        MatAutocompleteModule,
        MatSelectModule,
        MatButtonModule, 
        MatIconModule, 
        MatFormFieldModule, 
        MatInputModule, 
        MatDatepickerModule,
        MatNativeDateModule, 
        MatCheckboxModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatCardModule,
        MatDialogModule,
        MatProgressSpinnerModule, 
        MatRadioModule,
        MatSortModule,
        MatTableModule,
        MatPaginatorModule,
        MatSnackBarModule,
        MatBottomSheetModule,
        MatExpansionModule,
        MatGridListModule,
        NativeDateModule
    // MatBottomSheetRefModule,
        // MatDialogRefModule, 
        // <any>MAT_DIALOG_DATA
        ]
})
export class MaterialModule{}