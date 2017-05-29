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

  onSubmit() {
    if (!this.projectForm.valid) {
      console.error("The form data cannot be processed right now because the form is not valid.");
      return;
    }

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
