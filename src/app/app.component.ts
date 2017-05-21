import { Component } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  pf: FormGroup; //pf is short for project form
  participantsArray: Person[] = [ new Person(), new Person(), new Person() ]
  project:Project = {
    workdays: [
      { date: new Date(), participants: [] }
    ],
    leader: ""
  };
  constructor(private fb: FormBuilder) { //NOTE: pf is different from the fb parameter in this function
    this.createForm();

  }
  createForm() {
    this.pf = this.fb.group({
      leader: ['', Validators.required],
      workdays: this.fb.array([])
    })
  }
  getParticipantsArray(): Person[] {
    return this.participantsArray;
  }
  newWorkday() {
    this.project.workdays.push(new Workday());
  }
  onSubmit() {

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
  hoursWorked: Hour[]
  constructor() {
    this.name = ""
    this.type = ""
    this.hoursWorked = []
  }
}

export class Hour {
  hours: number
  minutes: number
}
