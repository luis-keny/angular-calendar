import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Appointment } from '@core/data/model/appointment';
import { AppointmentService } from '@core/service/appointment.service';
import { ModalService } from '@core/service/modal.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css',
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class EventFormComponent implements OnInit {
  form = new FormGroup({    
    title: new FormControl('',[Validators.required]),
    startTime: new FormControl('',[Validators.required]),
    endTime: new FormControl('2025-03-27T15:38',[Validators.required]),
    color: new FormControl('#000000'),
  });

  data: any;
  isEdit: boolean = false;

  constructor(
    private modalService: ModalService,
    private appointmentSrv: AppointmentService,
  ) { }

  ngOnInit(): void {
    this.data = this.modalService.getData();
    const data = this.data;

    if (data.date) {
      const today = new Date(data.date);
      this.form.controls.startTime.setValue(this.getDateTimeLocal(today));
      this.form.controls.endTime.setValue(this.getDateTimeLocal(today, 1));
    } else {
      const dayStart = data.startTime;
      const dayEnd = data.endTime;
      this.form.controls.startTime.setValue(this.getDateTimeLocal(dayStart));
      this.form.controls.endTime.setValue(this.getDateTimeLocal(dayEnd));
    }
    
    if(data.title) {
      this.form.controls.title.setValue(data.title);
      this.isEdit = true;
    }
    if(data.color) {
      this.form.controls.color.setValue(data.color);
    }
  }

  private getDateTimeLocal(date: Date, nextHour: number = 0): string {
    const moment = `${(date.getHours() + nextHour).toString().padStart(2,'0')}:${(date.getMinutes()).toString().padStart(2,'0')}`;
    const dateString = date.toISOString().split('T')[0];

    return `${dateString}T${moment}`;
  }

  public closeModal() {
    this.modalService.closeModal();
  }

  public onSubmit() {
    const { title, startTime, endTime, color } = this.form.value;

    if(!title || !startTime || !endTime) return;

    const appointment: Appointment = {
      title: title,
      start: new Date(startTime),
      end: new Date(endTime),
      color: color!,
      allDay: false,
      draggable: true,
      resizable: {
        afterEnd: true,
        beforeStart: true,
      },
      id: this.data.id ?? -1,
    }

    if(this.data.title) {
      this.appointmentSrv.updateAppointment(appointment);
    } else {
      this.appointmentSrv.createAppointment(appointment);
    }
    this.modalService.closeModal(appointment);
  }

  public deleteAppointment() {
    if(confirm("Are you sure you want to delete this event?")) {
      const { id } = this.data;
      this.appointmentSrv.deleteAppointment(id);
      this.modalService.closeModal(true);
    }
  }
}
