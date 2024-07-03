import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { PreStartService } from './services/pre-start.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  showSplash = true;
  showMenuAndFooter = true;
  thePrestart;
  constructor(
    private platform: Platform,
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    private prestart: PreStartService, // preStartService is used to get whether the current app version is laterst or not.
    // If needs update then do not show Menu and Footer.
  ) {
        
    this.initializeApp();
    this.thePrestart = prestart;
    
    }
  ngOnInit() {
    setTimeout(() => { 
      // Hide the splash screen after the async operation
      this.showSplash = false; 
    }, 30000);
    // throw new Error('Method not implemented.');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
    });
  }

  onToggle() { }
}
