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
  }

  addWorkday() {
    const child = new Workday();
    console.log(this.workdays);
    this.workdays.push(child);
    console.log(this.workdays);
    this.cd.detectChanges();
    return false;
  }

}
