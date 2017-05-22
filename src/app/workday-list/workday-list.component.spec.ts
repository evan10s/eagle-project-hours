import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkdayListComponent } from './workday-list.component';

describe('WorkdayListComponent', () => {
  let component: WorkdayListComponent;
  let fixture: ComponentFixture<WorkdayListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkdayListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkdayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
