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
  @Input()
  public workdays: FormArray;
  numParticipantsRemoved: number = 0;
  participantLastRemoved: Date;
  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.workdayForm.addControl('participants', new FormArray([]));

    this.addParticipant();
  }

  //input to this function is the index of the participants array, not the participant number (that's displayed in the UI) itself
  removeParticpant(participantNum: number) { //method for removing workdays from http://brophy.org/post/nested-reactive-forms-in-angular2-continued/
    let needToConfirm : boolean = false;
    if (this.numParticipantsRemoved >= 1) { //confirm removal of second participant if two are removed in a very short span of time (i.e., computer accidentally registered 2 clicks instead of 1)
      const currentDate = new Date();
      const timeDiff = (currentDate.getTime() - this.participantLastRemoved.getTime());
      console.log("timeDiff",timeDiff);
      needToConfirm = (timeDiff <= 500);
    }
    let userApproval : boolean = true;
    if (needToConfirm) {
      userApproval = confirm("Do you really want to delete another participant?  The first one was already removed.");
    }
    if (userApproval && participantNum >= 0 && participantNum < this.participants.length) {
      this.participantLastRemoved = new Date();
      this.numParticipantsRemoved++;
      console.log(this.numParticipantsRemoved);
      this.participants.splice(participantNum,1);
      (<FormArray>this.workdayForm.get('participants')).removeAt(participantNum);
    }
  }

  addParticipant() {
    const participant = new Person();
    this.participants.push(participant);
    this.cd.detectChanges();

    return false;
  }

}
