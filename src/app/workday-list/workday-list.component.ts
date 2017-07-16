import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Project, Workday } from '../app.component';
import { FormBuilder,FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ParticipantListService } from '../participant-list-service/participant-list.service';


@Component({
  selector: 'eph-workday-list',
  templateUrl: './workday-list.component.html',
  styles: []
})
export class WorkdayListComponent implements OnInit {
  @Input('projectForm')
  public projectForm: FormGroup;
  @Input('workdays')
  public workdays: Workday[];
  @Input("participantListService")
  public participantList: ParticipantListService;
  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    console.log("Initializing workday list");
    this.projectForm.addControl('workdays',new FormArray([]));
    console.log(this.projectForm,"this.projectForm");
    this.addWorkday();
  }

  private getParticipantObj(name: string) {
    for (let wkday of this.projectForm.value.workdays) {
      console.log(wkday)
      for (let p of wkday.participants) {
        console.log(p, p.name)
        if (p.name === name) {
          return p;
        }
      }
    }
    return -1;
  }


  //input to this function is the index of the workdays array, not the workday number (that's displayed in the UI) itself
  removeWorkday(workdayNum: number) { //method for removing workdays from http://brophy.org/post/nested-reactive-forms-in-angular2-continued/

    if (confirm(`Really delete this workday and all of its participants?`) && workdayNum >= 0 && workdayNum < this.workdays.length) {
      let workdayParticipants = this.projectForm.value.workdays[workdayNum].participants;
      console.log("workdayParticipants for the workday about to be removed",workdayParticipants);

      this.workdays.splice(workdayNum,1);
      (<FormArray>this.projectForm.get('workdays')).removeAt(workdayNum);

      for (let p of workdayParticipants) {
        if (this.getParticipantObj(p.name) === -1) {
          this.participantList.removeParticipant(p.name);
        }
      }
    }
  }

  addWorkday() {
    const child = new Workday();
    this.workdays.push(child);
    this.cd.detectChanges();

    return false;
  }

}
