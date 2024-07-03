import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login/login.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { PastoreportComponent } from './components/reports/pastoreport/pastoreport.component';
import { IncomeComponent } from './components/income/income.component';
import { ChurchPastorFormComponent } from './components/church-pastor-form/church-pastor-form.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { PastorsReportComponent } from './components/reports/pastors-report/pastors-report.component';
import { AccountReportsComponent } from './components/reports/account-reports/account-reports.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { PastorsListComponent } from './components/reports/pastors-list/pastors-list.component';
import { IncomeReportComponent } from './components/reports/income-report/income-report.component';
import { ExpenseReportsComponent } from './components/reports/expense-reports/expense-reports.component';
import { MembershipCardComponent } from './components/membership-card/membership-card.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import { PcincomeComponent } from './components/pcincome/pcincome.component';
import { ChurchincomeComponent } from './components/churchincome/churchincome.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { SetnewpasswordComponent } from './components/auth/setnewpassword/setnewpassword.component';
import { ForgotpasswordComponent } from './components/auth/forgotpassword/forgotpassword.component';
import { VerifyandloginComponent } from './components/auth/verifyandlogin/verifyandlogin.component';

const routes: Routes = [
  { path: '', redirectTo: 'announcements', pathMatch: 'full' },
  { path: 'home', redirectTo: 'home', pathMatch: 'full' },
  // { path: '', component: LoginComponent, pathMatch: 'full'},
  // { path: '', redirectTo: 'announcements', pathMatch: 'full' },
  { path: 'announcements', component: AnnouncementsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'church-pastor-form', component: ChurchPastorFormComponent },
  { path: 'pastors-report', component: PastorsReportComponent },
  { path: 'pastoreport', component: PastoreportComponent },
  { path: 'pcincome', component: PcincomeComponent },
  { path: 'churchincome', component: ChurchincomeComponent },
  { path: 'income', component: IncomeComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'account-reports', component: AccountReportsComponent },
  { path: 'announcements', component: AnnouncementsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgotpassword', component: ForgotpasswordComponent },
  { path: 'setnewpassword', component: SetnewpasswordComponent },
  { path: 'verifyandlogin', component: VerifyandloginComponent },
  { path: 'pastors-list', component: PastorsListComponent },
  { path: 'income-report', component: IncomeReportComponent },
  { path: 'expense-reports', component: ExpenseReportsComponent },
  { path: 'membership-card', component: MembershipCardComponent },
  {
    path: 'launch-screen',
    loadChildren: () =>
      import('./launch-screen/launch-screen.module').then(
        (m) => m.LaunchScreenPageModule
      ),
  },
  { path: "**", redirectTo: "announcements", pathMatch: "full" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
