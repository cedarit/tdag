import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  HttpClient } from '@angular/common/http';
import { CdkTableModule} from '@angular/cdk/table';
import {DataSource} from '@angular/cdk/collections';
import { Observable } from 'rxjs';
// import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { of } from 'rxjs';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {GeneralService} from '../../../services/general.service';
import { Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms';
// import { MatListModule } from '@angular/material';
// import { DecorativePopupComponent } from 'src/app/decorative-popup/decorative-popup.component';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { ModalController } from '@ionic/angular';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ModalListComponent } from '../../modal-list/modal-list.component';

export interface pastorRptInt{ 
  SN:number;
  pastorname:string;
  phoneno:number;
  gender:string;
  desig:string;

}

let Server_DATA=[];


@Component({
  selector: 'app-pastors-list',
  templateUrl: './pastors-list.component.html',
  styleUrls: ['./pastors-list.component.scss'],
})
export class PastorsListComponent  implements OnInit {  

  pastorReportData: any = [];
  dataSource1:  MatTableDataSource<pastorRptInt>;
  myData: Array < any > ;
  ary1=[1,2,2,3,3,4,4];
  actID: string;
  currentCareCellName: string;
  //currentCareCellID = '';
  resStringReport: string;
  resReport: any;
  currentNumReport=0; // number of reports in current carecell
  
  constructor(private http:HttpClient,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private gen: GeneralService, 
              private modalCtrl: ModalController) {

    this.getPastorReport();

  }


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  //pastorReportUrl = "http://192.168.1.44/trola/totalMemberList";



  pastorReportUrl = "https://apag.digitalchurch.tech/totalMemberList";


  
  // carecellReportUrl = "https://trola.churchgalaxy.com/getCCReport?contactID=1302";
  
  ngOnInit() {
    
   }

   doRefresh(event: any) {
    this.getPastorReport(event);
  }

    length = 10;
    pageSize = 5;
    pageSizeOptions: number[] = [5, 10];
    


    getPastorReport(event?: any) {
              this.http.get(this.pastorReportUrl).subscribe((res: any)=>{
                console.log(res);
                this.resStringReport   = JSON.stringify(res);
                this.resReport = JSON.parse(this.gen.getDecodedString(this.resStringReport));
                this.pastorReportData= this.resReport;
                this.dataSource1 = new MatTableDataSource<pastorRptInt>(this.pastorReportData);
                this.dataSource1.paginator = this.paginator;
                this.dataSource1.sort = this.sort;

              //  console.log('The  CareCell Name is ', this.carecellReportData[0]['Carecell']);

             //   this.currentNumReport = this.carecellReportData.length
                console.log('The number of reports: ', this.currentNumReport)

                if( this.currentNumReport > 0){
              //   this.currentCareCellName = this.carecellReportData[0]['Carecell'];

                 console.log('Refresh event', event);
                 if (event && event.type == 'ionRefresh'){
                  console.log('Event it is Refresh');
                  event.target.complete();
                }

               }

               // return res;
              })
  }

  // Returns First Letter of each word in the sentece
  getFirstLetters(words: string): string {
    const wordsArray = words.split(' '); // split the string into an array of words
    const firstLetters = wordsArray.map(word => word.charAt(0)); // get the first letter of each word
    return firstLetters.join(''); // join the first letters together into a new string
  }

  displayedColumns: string[] = ['pastorname','phoneno','desig'];


  getIconType(word:string){
    let iconType = word;

switch (iconType) {
  case 'ORDAINED MINISTER':
    return 'bible';
    break;
  case 'LICENSE TO PREACH':
    return 'license';
    break;
  case 'CHRISTIAN WORKERS':
    return 'worker';
    break;
  default:
    return 'notfound';
  }
}

  
  openDialog(desig: any): void {

    const dialogRef = this.dialog.open(DialogComponent, {
      data: desig
    });
  }


  displayList(values: []): void {
    const data = values;
    alert(data);
    const dialogRef = this.dialog.open(ModalListComponent, {
      data: values
    });
  }

  // getUniqueDesignations(ary1){

  //   const uniqueArray = [...new Set(ary1)];
  //   console.log(uniqueArray)
  //   return uniqueArray;
  //   // return [...new set(ary1())];
  // }


  getUniqueDesignations() {
    const dialogRef = this.dialog.open(ModalListComponent, {
      data: { items: ['item1', 'item2', 'item2', 'item3'] },
    });
  }
}
