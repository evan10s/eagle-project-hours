import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Project, Workday, Person } from '../app.component';
import { FormBuilder,FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import * as parseTime from 'parse-loose-time';
import * as moment from 'moment';

@Component({
  selector: 'eph-participant',
  template: `
    <div class="form-group" [formGroup]="participantForm">
      <label>Participant {{ partNum }}</label>
      <label [for]="identifier('participantName')" aria-haspopup="true" role="tooltip" class="tooltip tooltip-validation" [class.invalid]="participantForm.controls['name'].dirty && !participantForm.controls['name'].valid">
        <input [id]="identifier('participantName')" type="text" placeholder="Name" formControlName="name" />
        <span class="tooltip-content">Enter a name for this participant</span>
      </label>
      <label [for]="identifier('startTime')" aria-haspopup="true" role="tooltip" class="tooltip tooltip-validation" [class.invalid]="participantForm.controls['startTime'].dirty && !participantForm.controls['startTime'].valid">
        <input [id]="identifier('startTime')" type="text" placeholder="Start time" (focus)="clearFieldValidators(participantForm.controls['startTime'])" (change)="setFieldValidators(participantForm.controls['startTime'],timePatternValidator);prettyTime('start',participantForm.value)" size="8" formControlName="startTime" />
        <span class="tooltip-content">Enter a value that looks similar to a time, such as 630 or 430p</span>
      </label>
      <label [for]="identifier('endTime')" aria-haspopup="true" role="tooltip" class="tooltip tooltip-validation" [class.invalid]="participantForm.controls['endTime'].dirty && !participantForm.controls['endTime'].valid">
        <input [id]="identifier('endTime')" type="text" placeholder="End time" size="8" (focus)="clearFieldValidators(participantForm.controls['endTime'])" (change)="setFieldValidators(participantForm.controls['endTime'],timePatternValidator);prettyTime('end',participantForm.value)" formControlName="endTime" />
        <span class="tooltip-content">Invalid time (correct time format: 6:15 PM)</span>
      </label>
      <div class="checkbox-inline">
        <input type="checkbox" checked="checked" [id]="identifier('bsa')" ngFalseValue="Non-registered" ngTrueValue="Registered" formControlName="type">
        <label [for]="identifier('bsa')">BSA</label>
      </div>
      <div class="radio-inline">
        <input type="radio" formControlName="age" attr.checked="true" [id]="identifier('p_s')" value="youth" />
        <label [for]="identifier('p_s')">Youth</label>
      </div>
      <div class="radio-inline">
        <input type="radio" formControlName="age" [id]="identifier('p_a')" value="adult" />
        <label [for]="identifier('p_a')">Adult</label>
      </div>
      <!--<button><clr-icon style="vertical-align: middle; margin-top: 6px; margin-bottom: 6px" shape="remove" size="22"></clr-icon></button>-->
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

  private timePatternValidator = [Validators.required,Validators.pattern('[0-9]{1,2}:[0-9]{2} (A|P)M')];
  private endTimePatternValidator = [Validators.required,Validators.pattern('[0-9]{1,2}:[0-9]{2} (A|P)M'),this.endIsLater];
  public participantForm: FormGroup;
  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.participantForm = this.toFormGroup(this.participant);

    this.participants.push(this.participantForm);
    this.participantForm.controls['startTime'].valueChanges.subscribe(val => {
      console.log(val);
      console.log(this.participantForm.controls['startTime'].pending);
    });
  }

  private endIsLater(c: FormControl) {
    console.log("HI IT'S MEEEE!!!!");
    if (typeof c.value !== "object") {
      console.log(c.value,"not an object");
      return { endIsLater: {
        valid: false,
        message: "The end time is invalid"
      }}
    } else if (c.value.hour < 0 || c.value.minute < 0 || (c.value.hour <= 0 && c.value.minute <= 0)) {
      console.log(c.value,"negative time");
      return { endIsLater: {
        valid: false,
        message: "The end time must be after the start time"
      }}
    }
    console.log(c.value,"ok");
    return null;
  }

  private toFormGroup(data: Person): FormGroup {
    const formGroup = this.fb.group({
      name: ['', Validators.required],
      type: "Registered",
      age: "youth",
      startTime: ['', [Validators.required,Validators.pattern('[0-9]{1,2}:[0-9]{2} (A|P)M')]],
      endTime: ['', [Validators.required,Validators.pattern('[0-9]{1,2}:[0-9]{2} (A|P)M')]],
      totalTime: 0
    })
    return formGroup;
  }
  timeIncludesAMPM(time: string): boolean {
    return /A{1}M?|P{1}M?/i.test(time);
  }
  updateTimeField(time: Time, field: string): string {
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
    return result[field];
  }
  validateHour(hour: number): void {
    if (hour > 24 || hour < 0) {
      throw "Invalid hour";
    }
  }

  // https://stackoverflow.com/questions/33866824/angular2-control-validation-on-blur/41973780#41973780 - The question/answers here were very helpful
  // in implementing the clearFieldValidators and setFieldValidators logic
  private clearFieldValidators(field: FormControl) {
    field.clearValidators();
  }

  private setFieldValidators(field: FormControl, validators: any) {
    field.setValidators(validators);
    console.log(field);
    field.updateValueAndValidity();
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

  //verifies that a time is in the #:## AA format (e.g., 6:15 PM)
  validateTime(time: string): boolean {
    return /[0-9]{1,2}:[0-9]{2} (A|P)M/g.test(time);
  }

  //verifies that all times passed in as an array are formatted using the format expected by the validateTime function
  validateTimes(times: string[]): boolean {
    for (let time of times) {
      if (!this.validateTime(time)) {
        return false;
      }
    }
    return true;
  }


  calcTotalTime(startTime: Time, endTime: Time): Time {
    const hourDiff = endTime.hour - startTime.hour;
    const minuteDiff = endTime.minute - startTime.minute;
    const totalTimeInMinutes = hourDiff*60 + minuteDiff;
    const hours = Math.floor(totalTimeInMinutes/60);
    const minutes = totalTimeInMinutes % 60;
    return { hour:hours, minute: minutes };

  }

  setTotalTime(startTime: Time, endTime: Time) {
    const totalTime = this.calcTotalTime(startTime,endTime);
    console.log("totalTime",totalTime);
    this.participantForm.patchValue({ totalTime: totalTime });
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
          info.startTime = this.updateTimeField(startTime,"startTime");
        } else if (startTime.hour <= 6 || startTime.hour >= 12) {
          info.startTime = this.updateTimeField({hour: this.convertTo24Hour(startTime.hour, true), minute: startTime.minute },"startTime");
        } else if (startTime.hour > 6 && startTime.hour < 12) {
          info.startTime = this.updateTimeField({hour: this.convertTo12Hour(startTime.hour), minute: startTime.minute }, "startTime");
        }
      }
    } else if (startOrEnd === "end"){
      const endTime = parseTime(info.endTime) || { hour: 0 };
      console.log("endTime",endTime);
      if (Object.keys(endTime).length === 2) { //check that end time is a valid time
        const timeString: string = "" + info.endTime;
        console.log("info.endTime is",timeString);

        if (this.timeIncludesAMPM((timeString))) { //just reformat time
          info.endTime = this.updateTimeField(endTime,"endTime");
        } else if (endTime.hour <= 8 || endTime.hour >= 12) { //convert to PM
          info.endTime = this.updateTimeField({hour: this.convertTo24Hour(endTime.hour, true), minute: endTime.minute },"endTime");
        } else if (endTime.hour > 8 && endTime.hour < 12) { //convert to AM
          info.endTime = this.updateTimeField({hour: this.convertTo12Hour(endTime.hour), minute: endTime.minute }, "endTime");
        }
      }
    }
    //after processing a time, attempt to (re)calculate the total time
    console.log(info.startTime, info.endTime, this.participant);
    if (this.validateTimes([info.startTime,info.endTime])) {
      console.log("Ugh, the times are valid and that means I have to do more work!  -Grumpy Computer");
      console.log("OK, well if you insist");
      const startTimeObj = parseTime(info.startTime);
      const endTimeObj = parseTime(info.endTime);
      this.setTotalTime(startTimeObj,endTimeObj);
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
