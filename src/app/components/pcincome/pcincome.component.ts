import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pcincome',
  templateUrl: './pcincome.component.html',
  styleUrls: ['./pcincome.component.scss'],
})
export class PcincomeComponent  implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {}

  onCancel(){
    
  }

  onFirstButtonClick() {
    this.router.navigate(['/income']);
  }

  onSecondButtonClick() {
    this.router.navigate(['/churchincome']);
  }

}
