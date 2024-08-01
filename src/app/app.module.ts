import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgModule,
} from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { RouteReuseStrategy, Router } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { HomeComponent } from './components/home/home.component';
import { MaterialModule } from './material.module';
import { LoginComponent } from './components/login/login/login.component';
import { HeaderComponent } from './navigation/header/header.component';
import { FooterComponent } from './navigation/footer/footer.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { PastoreportComponent } from './components/reports/pastoreport/pastoreport.component';
import { AlertComponent } from './components/alert/alert.component';
import { MatIconRegistry } from '@angular/material/icon';
import { GeneralService } from './services/general.service';
import { IncomeComponent } from './components/income/income.component';
import { ChurchPastorFormComponent } from './components/church-pastor-form/church-pastor-form.component';
import { DatePipe } from '@angular/common';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { PastorsReportComponent } from './components/reports/pastors-report/pastors-report.component';
import { AccountReportsComponent } from './components/reports/account-reports/account-reports.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { PastorsListComponent } from './components/reports/pastors-list/pastors-list.component';
import { ModalListComponent } from './components/modal-list/modal-list.component';
import { IncomeReportComponent } from './components/reports/income-report/income-report.component';
import { ExpenseReportsComponent } from './components/reports/expense-reports/expense-reports.component';
import { MembershipCardComponent } from './components/membership-card/membership-card.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import { PcincomeComponent } from './components/pcincome/pcincome.component';
import { ChurchincomeComponent } from './components/churchincome/churchincome.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { SignupComponent } from './components/auth/signup/signup.component';
import { SetnewpasswordComponent } from './components/auth/setnewpassword/setnewpassword.component';
import { ForgotpasswordComponent } from './components/auth/forgotpassword/forgotpassword.component';
import { VerifyandloginComponent } from './components/auth/verifyandlogin/verifyandlogin.component';
import { WhatsAppSupportComponent } from './components/whatsapp-support/whatsapp-support.component';

@NgModule({
  declarations: [
    AppComponent,
    SidenavListComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    UserProfileComponent,
    PastoreportComponent,
    AlertComponent,
    IncomeComponent,
    ChurchPastorFormComponent,
    ContactUsComponent,
    CalendarComponent,
    PastorsReportComponent,
    AccountReportsComponent,
    ExpensesComponent,
    PastorsListComponent,
    ModalListComponent,
    IncomeReportComponent,
    ExpenseReportsComponent,
    MembershipCardComponent,
    AnnouncementsComponent,
    PcincomeComponent,
    ChurchincomeComponent,
    SignupComponent,
    ForgotpasswordComponent,
    SetnewpasswordComponent,
    VerifyandloginComponent,
    WhatsAppSupportComponent,
    
  ],
  imports: [
    BrowserModule,
    MatAutocompleteModule,
    MatInputModule,
    IonicModule.forRoot({
      backButtonText: '',
      hardwareBackButton: true,
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatDialogModule,
    MatButtonModule,
    MaterialModule,
    RouterModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DatePipe,
    Router,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AppModule {
  appBaseURL: string;
  appVerCheck: string;

  constructor(
    matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
    genServ: GeneralService
  ) {
    matIconRegistry.addSvgIconSet(
      domSanitizer.bypassSecurityTrustResourceUrl('../assets/mdi.svg')
    );
    // Or whatever path you placed mdi.svg at
    this.appVerCheck = genServ.appBaseURL + '/app/app-version-check';
    console.log('this.appVerCheck', this.appVerCheck);
  }
}
