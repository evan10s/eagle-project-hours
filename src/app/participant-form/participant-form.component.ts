import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Project, Workday, Person } from '../app.component';
import { FormBuilder,FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import * as parseTime from 'parse-loose-time';

@Component({
  selector: 'eph-participant',
  template: `
    <div class="form-group" [formGroup]="participantForm">
      <label>Participant {{ partNum }}</label>
      <input type="text" placeholder="Name" formControlName="name" />
      <input type="text" placeholder="Start time" (change)="test(participantForm.value)" size="8" formControlName="startTime" />
      <input type="text" placeholder="End time" size="8" formControlName="endTime" />
      <div class="checkbox-inline">
        <input type="checkbox" checked="checked" [id]="identifier('bsa')" ngFalseValue="Non-registered" ngTrueValue="Registered" ngformControlName="type">
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
  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.participantForm = this.toFormGroup(this.participant);

    this.participants.push(this.participantForm);
    this.participantForm.valueChanges.subscribe(val => {

    });
  }
  private toFormGroup(data: Person): FormGroup {
    const formGroup = this.fb.group({
      name: ['', Validators.required],
      type: "Registered",
      age: "part_youth",
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      totalTime: 0
    })
    return formGroup;
  }
  test(info: any) {
    console.log(info);
    const startTime = parseTime(info.startTime) || { hour: 0 };
    console.log("startTime",startTime);
    if (Object.keys(startTime).length === 2) { //check that start time is a valid time
      /* Here's the logic for this:
      * The start time is most likely to be in the morning.  But in some cases, it could also be in the afternoon.
      * Most start times will be 6-11 AM (inclusive) or 12-5 PM.
      * For inputs to the start time field that are both a valid time and that do not already have an AM/PM designation, hours 6-11 will have an AM appended, while hours 12-5 will have PM appended.
      * The end time logic is similar to the above, but with different ranges: 12-7 become PM, 8-11 become AM.
      * There's also a validation that the end time must be later than the start time.  Time durations that seem illogical (> 8 hours) will also be flagged for manual review by the user.
      */

      console.log("info.startTime is","" + info.startTime);
      if (/A{1}M?|P{1}M?/i.test("" + info.startTime)) { //just reformat time
        console.log("inside");
        let ampm, adjustedHour = startTime.hour, paddedMinute = startTime.minute;
        if (startTime.hour >= 12) {
          ampm = "PM";
          if (startTime.hour > 12) {
            adjustedHour -= 12;
          }
        } else {
          ampm = "AM";
        }
        if (startTime.minute < 10) {
          paddedMinute = "0" + paddedMinute;
        }
        this.participantForm.patchValue({ startTime: `${adjustedHour}:${paddedMinute} ${ampm}`})
      } else if (startTime.hour <= 6 || startTime.hour > 12) {
        this.participantForm.patchValue({ startTime: `${startTime.hour}:${startTime.minute} PM`});
      }
    }
    //   if (startTime.hour <= 6 && this.participant.startTime.length >= 3 && x.startTime.indexOf("am") === -1 && x.startTime.indexOf("a") === -1) {
    //     this.participant.startTime += "pm";
    //     this.participantForm.patchValue({ startTime: this.participant.startTime });
    //   }
    //   console.log("Start time",parseTime(x.startTime));
    //   console.log("End time",parseTime(x.endTime));
    //   x.totalTime=x.endTime - x.startTime;
    //   console.log(x);
    // console.log("participant is", this.participant);
  }
  identifier(key: string): any {
    return `${key}${this.workdayNum}-${this.partNum}`;
  }
}
