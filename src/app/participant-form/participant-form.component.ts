import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'eph-participant-form',
  template: `
    <div class="form-group">
      <label>Participant {{ participantNum }}</label>
      <input type="text" placeholder="Name" />
      <input type="text" placeholder="Start time" size="10" />
      <input type="text" placeholder="End time" size="10" />
      <div class="checkbox-inline">
        <input type="checkbox" checked [id]="identifier('bsa')">
        <label [for]="identifier('bsa')">BSA</label>
      </div>
      <div class="radio-inline">
        <input type="radio" [name]="identifier('part_type')" checked [id]="identifier('p_s')" value="part_youth" />
        <label [for]="identifier('p_s')">Youth</label>
      </div>
      <div class="radio-inline">
        <input type="radio" [name]="identifier('part_type')" [id]="identifier('p_a')" value="part_adult" />
        <label [for]="identifier('p_a')">Adult</label>
      </div>
      </div>
  `,
  styles: []
})
export class ParticipantFormComponent implements OnInit {
  @Input("part-id") participantNum: number
  @Input("workday-id") workdayNum: number

  constructor() { }

  ngOnInit() {
  }
  identifier(key: string): string {
    return `${key}${this.workdayNum}-${this.participantNum}`;
  }
}
