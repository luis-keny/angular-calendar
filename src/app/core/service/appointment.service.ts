import { Injectable } from '@angular/core';

import { Appointment } from '@core/data/model/appointment';
import { GroupAppointmentHelper } from '@core/util/group-appointment-helper';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
    private groupAppointmentHelper = new GroupAppointmentHelper();

    public setAppointments(appointments: Appointment[]): void {
        localStorage.setItem('calendar-appointments', JSON.stringify(appointments))
    }

    public getOfDay(date: Date) {
        const objectString = localStorage.getItem('calendar-appointments');
        if(!objectString) throw Error('Appointments is undefined')
        const appointments: Appointment[] = JSON.parse(objectString);
        return this.groupAppointmentHelper.getGroupAppointmentsOfDay(appointments, date)
    }

    public getOfWeek(date: Date) {
        const objectString = localStorage.getItem('calendar-appointments');
        if(!objectString) throw Error('Appointments is undefined')
        const appointments: Appointment[] = JSON.parse(objectString);
        return this.groupAppointmentHelper.getGroupAppointmentsOfWeek(appointments, date)
    }

    public getOfMonth(date: Date) {
        const objectString = localStorage.getItem('calendar-appointments');
        if(!objectString) throw Error('Appointments is undefined')
        const appointments: Appointment[] = JSON.parse(objectString);
        return this.groupAppointmentHelper.getGroupAppointmentsOfMonth(appointments, date)
    }
}