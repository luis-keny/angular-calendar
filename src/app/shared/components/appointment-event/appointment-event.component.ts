import { Component, Input } from '@angular/core';
import { AppointmentEvent } from '@core/data/adapters/group-appointment-event';
import { CalendarAppointmentDirective } from '@core/directive/calendar-appointment.directive';

@Component({
  selector: 'app-appointment-event',
  standalone: true,
  imports: [CalendarAppointmentDirective],
  templateUrl: './appointment-event.component.html',
  styleUrl: './appointment-event.component.css'
})
export class AppointmentEventComponent {
  @Input() heightPerHours: number = 0;
  @Input() unitOfMeasure: string = 'rem';
  @Input() currentMoment: Date = new Date();
  @Input({ required: true }) appointment!: AppointmentEvent;
  @Input({ required: true }) date!: Date;
  @Input() allDay: boolean = false;
  @Input() width: string = '100%';
  @Input() zIndex: number = 0;

  widthContentAllDay: string = '200px';

  public getTime(date: Date): string {
    return `${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
  }
}
