import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantFormComponent } from './participant-form.component';

describe('ParticipantFormComponent', () => {
  let component: ParticipantFormComponent;
  let fixture: ComponentFixture<ParticipantFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have validateTime that returns true for times in the form of "h:mm a"',() => {
    expect(component.validateTime("6:45 PM")).toBeTruthy();
  })
});
