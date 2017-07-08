import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Project, Workday } from '../app.component';
import { FormBuilder,FormControl, FormGroup, FormArray, Validators } from '@angular/forms';


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
  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    console.log("Initializing workday list");
    this.projectForm.addControl('workdays',new FormArray([]));
    console.log(this.projectForm,"this.projectForm");
    this.addWorkday();
  }

  //input to this function is the index of the workdays array, not the workday number (that's displayed in the UI) itself
  removeWorkday(workdayNum: number) { //method for removing workdays from http://brophy.org/post/nested-reactive-forms-in-angular2-continued/

    if (confirm(`Really delete this workday and all of its participants?`) && workdayNum >= 0 && workdayNum < this.workdays.length) {
      this.workdays.splice(workdayNum,1);
      (<FormArray>this.projectForm.get('workdays')).removeAt(workdayNum);
    }
  }

  addWorkday() {
    const child = new Workday();
    this.workdays.push(child);
    this.cd.detectChanges();

    return false;
  }

}
