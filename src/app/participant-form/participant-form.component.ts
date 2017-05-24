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
      <input type="text" placeholder="Start time" (change)="prettyTime('start',participantForm.value)" size="8" formControlName="startTime" />
      <input type="text" placeholder="End time" size="8" (change)="prettyTime('end',participantForm.value)" formControlName="endTime" />
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
  timeIncludesAMPM(time: string): boolean {
    return /A{1}M?|P{1}M?/i.test(time);
  }
  updateTimeField(time: Time, field: string): void {
    let result: object = {};

    let ampm, adjustedHour = time.hour,
    paddedMinute: string = "" + time.minute;
    if (time.hour >= 12) {
      ampm = "PM";
      if (time.hour > 12) {
        adjustedHour -= 12;
      }
    } else {
      ampm = "AM";
    }
    if (time.minute < 10) {
      paddedMinute = "0" + paddedMinute;
    }
    result[field] =`${adjustedHour}:${paddedMinute} ${ampm}`;
    this.participantForm.patchValue(result);
  }
  validateHour(hour: number): void {
    if (hour > 24 || hour < 0) {
      throw "Invalid hour";
    }
  }

  //Convert an hour in 24-hour time to AM/PM 12-hour time
  convertTo12Hour(hour: number): number {
    this.validateHour(hour);
    if (hour > 12) {
      return hour - 12;
    } else if (hour <= 12) {
      return hour;
    }
  }

  convertTo24Hour(hour: number, pm: boolean): number {
    this.validateHour(hour);
    if (hour < 12) {
      return hour + 12;
    } else { //hour === 12
      return hour;
    }
  }

  prettyTime(startOrEnd: string,info: any): void {
    console.log("info",info);

    if (startOrEnd === "start") {
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
        const timeString: string = "" + info.startTime;
        console.log("info.startTime is",timeString);

        if (this.timeIncludesAMPM((timeString))) { //just reformat time
          this.updateTimeField(startTime,"startTime");
        } else if (startTime.hour <= 6 || startTime.hour >= 12) {
          this.updateTimeField({hour: this.convertTo24Hour(startTime.hour, true), minute: startTime.minute },"startTime");
        } else if (startTime.hour > 6 && startTime.hour < 12) {
          this.updateTimeField({hour: this.convertTo12Hour(startTime.hour), minute: startTime.minute }, "startTime");
        }
      }
    } else if (startOrEnd === "end"){
      const endTime = parseTime(info.endTime) || { hour: 0 };
      console.log("endTime",endTime);
      if (Object.keys(endTime).length === 2) { //check that end time is a valid time
        const timeString: string = "" + info.endTime;
        console.log("info.endTime is",timeString);

        if (this.timeIncludesAMPM((timeString))) { //just reformat time
          this.updateTimeField(endTime,"endTime");
        } else if (endTime.hour <= 7 || endTime.hour >= 12) {
          this.updateTimeField({hour: this.convertTo24Hour(endTime.hour, true), minute: endTime.minute },"endTime");
        } else if (endTime.hour > 7 && endTime.hour < 12) {
          this.updateTimeField({hour: this.convertTo12Hour(endTime.hour), minute: endTime.minute }, "endTime");
        }
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

export class Time {
  hour: number
  minute: number
}
