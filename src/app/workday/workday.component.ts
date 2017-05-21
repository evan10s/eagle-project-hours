import { Component, OnInit, Input } from '@angular/core';
import { Person } from '../app.component';
@Component({
  selector: 'eph-workday',
  template: `
  <section class="form-block">
    <label>Workday {{ id }}</label>
    <div class="form-group">
      <label>Date</label>
      <input type="date" placeholder="Date" />
    </div>
    <eph-participant-form *ngFor="let participant of participants; let i = index" [workday-id]="id" [part-id]="i + 1"></eph-participant-form>
    <button (click)="addParticipant()" class="btn">Add participant</button>
  </section>
  `,
  styles: []
})
export class WorkdayComponent implements OnInit {
  @Input('workday') id: number
  @Input() participants: Person[]
  arr = Array;
  constructor() { }

  ngOnInit() {
    console.log(this.participants);
  }

  participantsAsArray(): number[] { //this is really hack-y, should probably implement this as a pipe
    let arr: number[] = [];
    // for (let i = 0; i < this.participants; i++) {
    //   arr.push(1);
    // }
    return arr;
    //this function is an idea that stemmed from http://stackoverflow.com/a/36535705/5434744

  }
  addParticipant() {
    this.participants.push(new Person());
  }
}
