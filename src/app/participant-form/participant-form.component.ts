import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Project, Workday, Person } from '../app.component';
import { FormBuilder,FormControl, FormGroup, FormArray, Validators } from '@angular/forms';


@Component({
  selector: 'eph-participant',
  template: `
    <div class="form-group" [formGroup]="participantForm">
      <label>Participant {{ partNum }}</label>
      <input type="text" placeholder="Name" formControlName="name" />
      <input type="text" placeholder="Start time" size="10" />
      <input type="text" placeholder="End time" size="10" />
      <div class="checkbox-inline">
        <input type="checkbox" checked="checked" [id]="identifier('bsa')" formControlName="type">
        <label [for]="identifier('bsa')">BSA</label>
      </div>
      <div class="radio-inline">
        <input type="radio" formControlName="age" attr.checked="true" [id]="identifier('p_s')" value="part_youth" />
        <label [for]="identifier('p_s')">Youth</label>
      </div>
      <div class="radio-inline">
        <input type="radio" formControlName="age" [id]="identifier('p_a')" value="part_adult" />
        <label [for]="identifier('p_a')">Adult</label>
      </div>
      </div>
  `,
  styles: []
})
export class ParticipantFormComponent implements OnInit {
  @Input()
  public participants: FormArray;
  @Input()
  public participant: Person;
  @Input()
  workdayNum: number;
  @Input()
  partNum: number;

  public participantForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    console.log("Initializing participant form", this.participant);
    this.participantForm = this.toFormGroup(this.participant);
    console.log(this.participants);
    this.participants.push(this.participantForm);
  }
  private toFormGroup(data: Person): FormGroup {
    const formGroup = this.fb.group({
      name: ['', Validators.required],
      type: true,
      age: "part_youth"
    })
    return formGroup;
  }
  identifier(key: string): any {
    return `${key}${this.workdayNum}-${this.partNum}`;
  }
}
