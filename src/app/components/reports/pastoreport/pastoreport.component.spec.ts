import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PastoreportComponent } from './pastoreport.component';

describe('PastoreportComponent', () => {
  let component: PastoreportComponent;
  let fixture: ComponentFixture<PastoreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastoreportComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PastoreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
