import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-launch-screen',
  templateUrl: './launch-screen.page.html',
  styleUrls: ['./launch-screen.page.scss'],
})

export class LaunchScreenPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    // Simulate a 3-second delay, adjust as needed
    setTimeout(() => {
      this.router.navigate(['announcements']); // Navigate to your main content page
    }, 3000);
  }
}
