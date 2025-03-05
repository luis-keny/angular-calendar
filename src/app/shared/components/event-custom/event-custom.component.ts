import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { AppointmentEvent, GroupAppointmentEvent } from '@core/data/adapters/group-appointment-event';
import { ModalService } from '@core/service/modal.service';
import { DateHelper } from '@core/util/date-helper';

import { EventFormComponent } from '../event-form/event-form.component';
import { AppointmentEventComponent } from '../appointment-event/appointment-event.component';
import { Appointment } from '@core/data/model/appointment';
import { AppointmentService } from '@core/service/appointment.service';


@Component({
  selector: 'app-event-custom',
  templateUrl: './event-custom.component.html',
  styleUrl: './event-custom.component.css',
  standalone: true,
  imports: [AppointmentEventComponent],
})
export class EventCustomComponent implements OnInit {
  @Input({ required: true }) heightPerHours!: number;
  @Input({ required: true }) unitOfMeasure!: string;
  @Input({ required: true }) dateSelected!: Date;
  @Input() group: GroupAppointmentEvent = {date: this.dateSelected, appointments: []};

  @Output() positionCalculated = new EventEmitter<number>();
  @ViewChild('momentIndicator') momentIndicator!: ElementRef<HTMLDivElement>;
  currentMoment: Date = new Date();
  dateHelper: DateHelper = new DateHelper();

  constructor(
    private modalService: ModalService,
    private appointmentSrv: AppointmentService,
  ) { }

  ngOnInit(): void {
    setInterval(() => {
      this.currentMoment = new Date();
    }, 60 * 1000);
    
    
    setTimeout(() => {
      const isCurrentDate = this.dateHelper.isEqualDate(this.currentMoment, this.dateSelected);
      if (isCurrentDate) {
        const top = this.momentIndicator.nativeElement.offsetTop;
        this.positionCalculated.emit(top);
      }
    });
    this.group.date = this.dateSelected;
  }

  public getTopOfCurrentMoment(): string {
    let hour = this.currentMoment.getHours();
    let minute = this.currentMoment.getMinutes();

    const oneHour = this.heightPerHours;
    const top = (oneHour*hour + oneHour*(minute/60));

    return `calc(${top + this.unitOfMeasure} - 0.4rem)`;
  }

  public defineStyles(dateSelected: Date, currentMoment: Date): string {
    const isCurrentDate = this.dateHelper.isEqualDate(dateSelected, currentMoment);
    if(!isCurrentDate) return 'display: none;'
    return `top:${this.getTopOfCurrentMoment()};`
  }

  public activeModal() {
    this.modalService.openModal({
      title: 'Add event',
      component: EventFormComponent,
      data: {
        date: this.dateSelected,
      }
    }).subscribe(() => {
      this.group = this.appointmentSrv.getOfDay(this.dateSelected);
    })
  }

  public activeModalAppointment(appointment: AppointmentEvent) {
    console.log(appointment);
    this.modalService.openModal({
      title: 'Add event',
      component: EventFormComponent,
      data: {
        id: appointment.id,
        title: appointment.title,
        color: appointment.color ?? '#000000',
        startTime: appointment.timeRangeOfEvent.start,
        endTime: appointment.timeRangeOfEvent.end,
      }
    }).subscribe(() => {
      this.group = this.appointmentSrv.getOfDay(this.dateSelected);
    })
  }
}
