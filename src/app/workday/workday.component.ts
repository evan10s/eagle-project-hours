import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Project, Workday, Person } from '../app.component';
import { FormBuilder,FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ParticipantListService } from '../participant-list-service/participant-list.service';

@Component({
  selector: 'eph-workday',
  template: `
  <section class="form-block" [formGroup]="workdayForm">
      <label>Workday Date</label>
      <input type="date" formControlName="date" placeholder="Date" /> <ng-content></ng-content>
      <eph-participant-list [workdays]="workdays" [workdayNum]="workdayNum" [workdayForm]="workdayForm" [participants]="workday.participants" [participantListService]="participantList">
      </eph-participant-list>

  </section>
  `,
  styles: []
})
export class WorkdayComponent implements OnInit {
  @Input()
  public workdays: FormArray;
  @Input()
  public workday: Workday;
  @Input()
  public workdayNum: number;
  @Input("participantListService")
  public participantList: ParticipantListService;

  public workdayForm: FormGroup;
  constructor(private fb: FormBuilder) { }



  ngOnInit() {
    this.workdayForm = this.toFormGroup(this.workday);
    this.workdays.push(this.workdayForm);
  }

  private toFormGroup(data: Workday): FormGroup {
    const formGroup = this.fb.group({
      date: ['', Validators.required],
    })
    return formGroup;
  }
}
