import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'eph-invalid-tooltip',
  template: `
    <label [for]="inputId" aria-haspopup="true" role="tooltip" class="tooltip tooltip-validation" [class.invalid]="invalid">
      <ng-content></ng-content>
      <span class="tooltip-content">{{ message }}</span>
    </label>
  `,
  styles: []
})
export class InvalidTooltipComponent implements OnInit {
  @Input("eph-input-id") inputId: string;
  @Input("eph-message") message: string;
  @Input("eph-invalid") invalid: boolean = true;
  constructor() { }

  ngOnInit() {
  }

}
