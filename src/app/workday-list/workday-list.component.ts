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

  addWorkday() {
    const child = new Workday();
    this.workdays.push(child);
    this.cd.detectChanges();
    
    return false;
  }

}
