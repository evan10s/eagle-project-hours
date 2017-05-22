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
    this.workdayForm.addControl('participants', new FormArray([]));

    this.addParticipant();
  }

  addParticipant() {
    const participant = new Person();
    this.participants.push(participant);
    this.cd.detectChanges();
    
    return false;
  }

}
