import { Component } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Time } from './participant-form/participant-form.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  projectForm: FormGroup; //Parent Form
  projectData: Project = {
    leader: "Parent Field 1 Value",
    workdays: [

    ]
  }
  summaryData: object;
  participantNumberMapping: //credit: Angular docs
      {[k: string]: string} = {'=0': 'No participants', '=1': '1 participant', 'other': '# participants'};
  constructor(private fb: FormBuilder) {
    this.projectForm = this.toFormGroup(this.projectData);

  }
  private toFormGroup(data: Project): FormGroup {
    const formGroup = this.fb.group({
      leader: [ '', Validators.required]
    })
    return formGroup;
  }

  totalTimeExists(time: number | Time): boolean {
    if  (typeof time === "object") {
      if (time.hour >= 0 || time.minute >= 0) {
        return true;
      }
    }
    return false;
  }

  noParticipantsForWorkday(participants: { name: string }[]): boolean {
    for (let participant of participants) {
      if (participant.name) {
        return false;
      }
    }
    return true;
  }

  //Returns the total number of minutes represented by Time objects
  //Note: will count time objects with negative times as 0 rather than subtracting minutes
  calcTotalMins(times: Time[]): number {
    let total = 0;
    for (let time of times) {
      if (time.hour < 0 || time.minute < 0) {
        continue; //don't count negative times
      }
      total += time.hour*60 + time.minute;
    }
    return total;
  }

  generateTimeObjFromMins(mins: number): Time {
    return { hour: Math.floor(mins/60), minute: mins % 60 };
  }

  onSubmit() {
    if (!this.projectForm.valid) {
      console.error("The form data cannot be processed right now because the form is not valid.");
      return;
    }
    console.log("hi");
    const data = this.projectForm.value;
    let result = {
      totalTimesArrays: {},
      workdayTimes: {},
      totalTimesByParticipantType: {}
    };
    let currentWorkday, currentParticipant, currentTimes, currentHours, currentMinutes, totalMins, oldNumWorkdays;
    let partType, currentTypeTotalMinutes;
    for (let i = 0; i < data.workdays.length; i++) {
      console.log(i);
      currentWorkday = data.workdays[i];
      for (let j = 0; j < currentWorkday.participants.length; j++) {
        console.log(j);
        currentParticipant = currentWorkday.participants[j];
        if (result.totalTimesArrays.hasOwnProperty(currentParticipant.name)) {
          console.log("hi again");
          currentTimes = result.totalTimesArrays[currentParticipant.name];
          currentHours = currentTimes.hour;
          currentMinutes = currentTimes.minute;
          if (!currentParticipant.name || typeof currentParticipant.totalTime !== "object") {
            continue;
          } else if (currentParticipant.totalTime.hour < 0 || currentParticipant.totalTime.minute < 0) { //negative times should not affect the time calculation
            continue;
          } else {
            totalMins = currentHours*60 + currentMinutes + currentParticipant.totalTime.hour*60 + currentParticipant.totalTime.minute;
            oldNumWorkdays = currentParticipant.workdays;
            if (oldNumWorkdays.isNaN()) {
              oldNumWorkdays = 0;
            }
            result.totalTimesArrays[currentParticipant.name] = { hour: Math.floor(totalMins/60), minute: totalMins % 60, workdays: oldNumWorkdays + 1 };
          }

        } else {

          if (!currentParticipant.name || typeof currentParticipant.totalTime !== "object") {
            continue;
          } else if (currentParticipant.totalTime.hour < 0 || currentParticipant.totalTime.minute < 0) { //negative times should not affect the time calculation
            continue;
          } else {
            result.totalTimesArrays[currentParticipant.name] = currentParticipant.totalTime;
            result.totalTimesArrays[currentParticipant.name].workdays = 1;
          }

        }
        if (!currentParticipant.type) {
          currentParticipant.type = "Non-registered";
        }
        partType = `${currentParticipant.type}-${currentParticipant.age}`;
        if (result.totalTimesByParticipantType.hasOwnProperty(partType)) {
          currentTypeTotalMinutes = result.totalTimesByParticipantType[partType];
          totalMins = this.calcTotalMins([result.totalTimesArrays[currentParticipant.name],currentTypeTotalMinutes]);
          result.totalTimesByParticipantType[partType] = this.generateTimeObjFromMins(totalMins);
        } else {
          result.totalTimesByParticipantType[partType] = result.totalTimesArrays[currentParticipant.name]; //use participant's total time for this iteration, since it's the only value that is included in this total right now
        }




      }
    }
    console.log(result);
    this.summaryData = result;
  }
}

export class Project {
  workdays: Workday[]
  leader: string
}

export class Workday {
  date: Date
  participants: Person[]
  constructor() {
    this.date = new Date()
    this.participants = []
  }

}

export class Person {
  name: string
  type: string
  constructor() {
    this.name = ""
    this.type = ""
  }
}

export class Hour {
  hours: number
  minutes: number
}
