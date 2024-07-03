import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LaunchScreenPage } from './launch-screen.page';

describe('LaunchScreenPage', () => {
  let component: LaunchScreenPage;
  let fixture: ComponentFixture<LaunchScreenPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LaunchScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
