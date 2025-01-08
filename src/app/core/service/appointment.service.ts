import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { GroupAppointmentEvent } from '@core/data/adapters/group-appointment-event';
import { Appointment } from '@core/data/model/appointment';
import { GroupAppointmentHelper } from '@core/util/group-appointment-helper';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
    private url: string = 'json/appointment.json';
    private groupAppointmentHelper = new GroupAppointmentHelper();
    
    constructor(
        private http: HttpClient
    ) { }

    public getAll(): Observable<GroupAppointmentEvent[]> {
        return this.http.get<Appointment[]>(this.url).pipe(
            map(tasks => this.groupAppointmentHelper.group(tasks))
        )
    }

    public getOfDay(date: Date): Observable<GroupAppointmentEvent> {
        return this.http.get<Appointment[]>(this.url).pipe(
            map(tasks => this.groupAppointmentHelper.getGroupAppointmentsOfDay(tasks, date))
        )
    }

    public getOfWeek(date: Date): Observable<GroupAppointmentEvent[]> {
        return this.http.get<Appointment[]>(this.url).pipe(
            map(tasks => this.groupAppointmentHelper.getGroupAppointmentsOfWeek(tasks, date))
        )
    }

    public getOfMonth(date: Date): Observable<GroupAppointmentEvent[]> {
        return this.http.get<Appointment[]>(this.url).pipe(
            map(tasks => this.groupAppointmentHelper.getGroupAppointmentsOfMonth(tasks, date))
        )
    }
}