import { Component, Input, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  @Input() myData: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
  design:string='';
  ngOnInit() {this.design=this.data}

 
  

}
