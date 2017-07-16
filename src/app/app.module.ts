import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ClarityModule } from 'clarity-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ParticipantFormComponent } from './participant-form/participant-form.component';
import { WorkdayComponent } from './workday/workday.component';
import { WorkdayListComponent } from './workday-list/workday-list.component';
import { ParticipantListComponent } from './participant-list/participant-list.component';
import { TimeBetweenPipe } from './time-between.pipe';
import { InvalidTooltipComponent } from './invalid-tooltip/invalid-tooltip.component';
import { SumHoursPipe } from './sum-hours/sum-hours.pipe';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { ParticipantListService } from './participant-list-service/participant-list.service';

@NgModule({
  declarations: [
    AppComponent,
    ParticipantFormComponent,
    WorkdayComponent,
    WorkdayListComponent,
    ParticipantListComponent,
    TimeBetweenPipe,
    InvalidTooltipComponent,
    SumHoursPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ClarityModule.forRoot(),
    ReactiveFormsModule,
    Ng2AutoCompleteModule
  ],
  providers: [ ParticipantListService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
