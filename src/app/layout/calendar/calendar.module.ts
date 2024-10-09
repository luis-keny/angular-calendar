import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import { SelectCustomComponent } from './components/select-custom/select-custom.component';
import { MonthYearPipe } from '../../core/pipe/month-year.pipe';


@NgModule({
  declarations: [
    CalendarComponent,
    SelectCustomComponent,
    MonthYearPipe,
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
  ],
  bootstrap: [CalendarComponent]
})
export class CalendarModule { }
