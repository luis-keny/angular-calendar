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
        const appointments: Appointment[] = this.getAppointmentsOfLocalStorage();
        return this.groupAppointmentHelper.getGroupAppointmentsOfDay(appointments, date)
    }

    public getOfWeek(date: Date) {
        const appointments: Appointment[] = this.getAppointmentsOfLocalStorage();
        const group = this.groupAppointmentHelper.getGroupAppointmentsOfWeek(appointments, date)
        // console.log(group);
        return group;
    }

    public getOfMonth(date: Date) {
        const appointments: Appointment[] = this.getAppointmentsOfLocalStorage();
        return this.groupAppointmentHelper.getGroupAppointmentsOfMonth(appointments, date)
    }

    private getAppointmentsOfLocalStorage(): Appointment[] {
        const objectString = localStorage.getItem('calendar-appointments');
        if(!objectString) throw Error('Appointments is undefined')
        const appointments: Appointment[] = JSON.parse(objectString);
        const appointmentsFormatted: Appointment[] = appointments.map(a => {
            a.start = new Date(a.start);
            a.end = new Date(a.end);
            return a;
        });
        return appointmentsFormatted;
    }
}