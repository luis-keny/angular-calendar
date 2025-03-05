import { Injectable } from '@angular/core';

import { Appointment } from '@core/data/model/appointment';
import { GroupAppointmentHelper } from '@core/util/group-appointment-helper';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
    private appointments: Appointment[] = [];
    private groupAppointmentHelper = new GroupAppointmentHelper();

    public setAppointments(appointments: Appointment[]): void {
        this.appointments = appointments.map(a => {
            a.start = new Date(a.start);
            a.end = new Date(a.end);
            return a;
        });
        localStorage.setItem('calendar-appointments', JSON.stringify(appointments))
    }

    public getOfDay(date: Date) {
        return this.groupAppointmentHelper.getGroupAppointmentsOfDay(this.appointments, date)
    }

    public getOfWeek(date: Date) {
        const group = this.groupAppointmentHelper.getGroupAppointmentsOfWeek(this.appointments, date)
        return group;
    }

    public getOfMonth(date: Date) {
        return this.groupAppointmentHelper.getGroupAppointmentsOfMonth(this.appointments, date)
    }

    public createAppointment(appointment: Appointment) {
        this.appointments.push({...appointment, id: this.createId() });
    }

    public updateAppointment(appointment: Appointment) {
        const appointmentIndex = this.appointments.findIndex(a => a.id === appointment.id);
        if(appointmentIndex === -1) throw Error('Appointment not found');
        this.appointments[appointmentIndex] = appointment;
    }

    public deleteAppointment(id: number) {
        const appointmentIndex = this.appointments.findIndex(a => a.id === id);
        if(appointmentIndex === -1) throw Error('Appointment not found');
        this.appointments.splice(appointmentIndex, 1);
    }

    private createId(): number {
        const appointments = this.appointments;
        const ids = appointments.map(a => a.id);
        let id = 0;
        for(let i = 0; i < ids.length; i++) {
            if(ids[i] > id) id = ids[i];
        }
        id++;
        return id;
    }
}