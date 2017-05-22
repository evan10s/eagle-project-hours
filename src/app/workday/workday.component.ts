import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Project, Workday, Person } from '../app.component';
import { FormBuilder,FormControl, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'eph-workday',
  template: `
  <section class="form-block" [formGroup]="workdayForm">
    <label>Workday {{ id }}</label>

      <label>Date</label>
      <input type="date" formControlName="date" placeholder="Date" />
      <eph-participant-list [workdayNum]="workdayNum" [workdayForm]="workdayForm" [participants]="workday.participants">
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
