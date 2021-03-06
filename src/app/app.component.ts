import { Component } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Time } from './participant-form/participant-form.component';
import { ParticipantListService } from './participant-list-service/participant-list.service';

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

  constructor(private fb: FormBuilder,public participantList: ParticipantListService) {
    this.projectForm = this.toFormGroup(this.projectData);

  }

  public printPage(): void {
    window.print(); //from https://css-tricks.com/quick-tip-making-a-print-this-page-button/ 
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

  getPrettyType(type: string) : string {
    switch(type) {
      case "true-adult":
        return "Registered adult";
      case "true-youth":
        return "Scout";
      case "false-adult":
        return "Non-BSA adult";
      case "false-youth":
        return "Non-BSA child";
    }
  }

  enhancePartObjs(object) {
    console.log(object,this.summaryData);
    let result = [], obj;
    for (let x in object) {
      console.log(x,object);
      obj = object[x];
      obj.key = x;
      obj.numWorkdays = Object.keys(obj.workdays).length;
      obj.prettyType = this.getPrettyType(obj.partType);
      result.push(obj);
    }
    console.log("result",result);
    return result;
  }

  partNumsAsArray(object) {
    let result = [], obj = {};
    for (let t in object) {
      if (Object.keys(object[t]).indexOf("num") === -1) {
        continue;
      }
      result.push({
        partType: t,
        data: object[t]
      });
    }
    console.log("result of objToArray",result);
    return result;
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
      console.error(`Can't process data when form status is ${this.projectForm.status}`);
      return;
    }
    console.log("Inside onSubmit");
    const data = this.projectForm.value;
    let result = {
      totalTimesArrays: {},
      workdayTimes: {},
      totalTimesByParticipantType: {}
    };
    let currentWorkday, currentParticipant, currentTimes, currentHours, currentMinutes, totalMins, oldNumWorkdays,updatedWorkdays;
    let partType, currentTypeTotalMinutes;
    for (let i = 0; i < data.workdays.length; i++) {
      console.log(i);
      currentWorkday = data.workdays[i];
      for (let j = 0; j < currentWorkday.participants.length; j++) {
        console.log(j);
        currentParticipant = currentWorkday.participants[j];
        if (result.totalTimesArrays.hasOwnProperty(currentParticipant.name)) {
          console.log("Seen participant before:",currentParticipant.name);
          currentTimes = result.totalTimesArrays[currentParticipant.name];
          currentHours = currentTimes.hour;
          currentMinutes = currentTimes.minute;
          console.log("Current total time for",currentParticipant.name,"=",currentTimes,"; Hours:",currentHours,"; Minutes:",currentMinutes);
          if (!currentParticipant.name || typeof currentParticipant.totalTime !== "object") {
            console.log("Not processing any more data for this participant - no name or invalid time")
            continue;
          } else if (currentParticipant.totalTime.hour < 0 || currentParticipant.totalTime.minute < 0) { //negative times should not affect the time calculation
            console.log("Not processing any more data for this participant - hour or minute is negative")
            continue;
          } else {
            console.log("Data integrity checks passed, recalculating total minutes...");
            totalMins = currentHours*60 + currentMinutes + currentParticipant.totalTime.hour*60 + currentParticipant.totalTime.minute;
            console.log("Participant's total time changed from",currentHours*60 + currentMinutes,"to",totalMins);
            oldNumWorkdays = currentTimes.workdays; //the number of workdays a given participant works is not a property of the data model object used by model.  Instead it's stored with the time info object used for calculating total time worked for the project
            console.log("Recalculating total workdays for this participant... The current value is",oldNumWorkdays,"and the type is",typeof oldNumWorkdays)
            updatedWorkdays = oldNumWorkdays;
            updatedWorkdays[i] = true; //add this workday to this participant's days worked object
            result.totalTimesArrays[currentParticipant.name] = { hour: Math.floor(totalMins/60), minute: totalMins % 60, workdays: updatedWorkdays };
            result.totalTimesArrays[currentParticipant.name].partType = partType = `${currentParticipant.type}-${currentParticipant.age}`;

          }

        } else {
          console.log("First encounter for participant with this name")
          if (!currentParticipant.name || typeof currentParticipant.totalTime !== "object") {
            console.log("Not processing any more data for this participant - no name or invalid time")
            continue;
          } else if (currentParticipant.totalTime.hour < 0 || currentParticipant.totalTime.minute < 0) { //negative times should not affect the time calculation
            console.log("Not processing any more data for this participant - hour or minute is negative")
            continue;
          } else {
            result.totalTimesArrays[currentParticipant.name] = currentParticipant.totalTime;
            result.totalTimesArrays[currentParticipant.name].workdays = {}; //storing workdays as an object means that if a participant worked twice in the same day, they won't be counted as having worked on two separate days
            result.totalTimesArrays[currentParticipant.name].workdays[i] = true; //i is the workday index in the outer for loop
            result.totalTimesArrays[currentParticipant.name].partType = partType = `${currentParticipant.type}-${currentParticipant.age}`;
            console.log("This participant's value in totalTimesArrays is",result.totalTimesArrays[currentParticipant.name]);
          }

        }
        partType = this.getPrettyType(`${currentParticipant.type}-${currentParticipant.age}`);
        console.log("Updated total time for participant type");
        console.log("partType is",partType);
        console.log("current participant is", currentParticipant.name);
        if (result.totalTimesByParticipantType.hasOwnProperty(partType)) {
          console.log("already have some times, they are",result["totalTimesByParticipantType"][partType])
          currentTypeTotalMinutes = result.totalTimesByParticipantType[partType];
          console.log("looks like there's already this many minutes for this",currentTypeTotalMinutes);
          totalMins = this.calcTotalMins([result.totalTimesArrays[currentParticipant.name],currentTypeTotalMinutes]);
          console.log("and the updated total mins is",totalMins);
          console.log("and the time object that will be used is",this.generateTimeObjFromMins(totalMins));
          result.totalTimesByParticipantType[partType] = this.generateTimeObjFromMins(totalMins);
        } else {
          result.totalTimesByParticipantType[partType] = result.totalTimesArrays[currentParticipant.name]; //use participant's total time for this iteration, since it's the only value that is included in this total right now
        }




      }
    }
    console.log(result);

    let totalPartInfo = {
      "Scout": {},
      "Registered adult": {},
      "Non-BSA adult": {},
      "Non-BSA child": {}
    };


    for (let part in result.totalTimesArrays) {
      let partType = this.getPrettyType(result.totalTimesArrays[part].partType);
      if (totalPartInfo.hasOwnProperty(partType) && Object.keys(totalPartInfo[partType]).indexOf("num") >= 0) {
        totalPartInfo[partType].num++;
      } else {
        totalPartInfo[partType].num = 1;
      }

      if (totalPartInfo.hasOwnProperty(partType) && Object.keys(totalPartInfo[partType]).indexOf("time") >= 0) {
        console.log("totalPartInfo",totalPartInfo);
         let totalMins = this.calcTotalMins([result.totalTimesArrays[part],totalPartInfo[partType].time]);
         totalPartInfo[partType].time = this.generateTimeObjFromMins(totalMins);
         console.log("total mins calculated a better way is",totalMins);
      } else {
        console.log("using this object with hour and minute already inside",result.totalTimesArrays[part]);
        totalPartInfo[partType]["time"] = result.totalTimesArrays[part];
      }
    }
    result["totalPartInfo"] = totalPartInfo;
    console.log("totalPartInfo",result["totalPartInfo"],totalPartInfo);
    this.summaryData = result;
    console.log(this.summaryData);
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
