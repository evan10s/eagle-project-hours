import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Project, Workday, Person } from '../app.component';
import { FormBuilder,FormControl, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'eph-participant-list',
  templateUrl: './participant-list.component.html',
  styles: []
})
export class ParticipantListComponent implements OnInit {
  @Input()
  public workdayForm: FormGroup;
  @Input()
  public participants: Person[]
  @Input()
  public workdayNum: number;
  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    console.log("Initializing participant list");
    this.workdayForm.addControl('participants', new FormArray([]));
    console.log(this.workdayForm,"this.workdayForm");
    this.addParticipant();
  }

  addParticipant() {
    const participant = new Person();
    console.log(this.participants);
    this.participants.push(participant);
    console.log(this.participants);
    this.cd.detectChanges();
    return false;
  }

}
