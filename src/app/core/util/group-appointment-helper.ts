import { GroupAppointmentEvent } from "@core/data/adapters/group-appointment-event";
import { Appointment } from "@core/data/model/appointment";
import { DateHelper } from "./date-helper";
import { AppointmentMapper } from "@core/data/mappers/Appointment-mapper";
import { CalendarHelper } from "./calendar-helper";

export class GroupAppointmentHelper {
    private dateHelper = new DateHelper();
    private calendarHelper = new CalendarHelper();
    private appointmentMapper = new AppointmentMapper();

    public getGroupAppointmentsOfDay(appointments: Appointment[], date: Date): GroupAppointmentEvent {
        const appointmentsOfDay = this.calendarHelper.getAppointmentsOfDay(appointments, date);
        if(appointmentsOfDay.length == 0) return { date, appointments: [] }
        return this.group(appointmentsOfDay, [date])[0];
    }

    public getGroupAppointmentsOfWeek(appointments: Appointment[], date: Date): GroupAppointmentEvent[] {
        const appointmentsOfWeek = this.calendarHelper.getAppointmentsOfWeek(appointments, date);
        const week = this.dateHelper.getWeekForDate(date);
        return this.group(appointmentsOfWeek, week);
    }

    public getGroupAppointmentsOfMonth(appointments: Appointment[], date: Date): GroupAppointmentEvent[] {
        const appointmentsOfMonth = this.calendarHelper.getAppointmentsOfMonth(appointments, date);
        const month = this.dateHelper.getMonthForDate(date);
        let groups: GroupAppointmentEvent[] = [];
        for(let week of month) {
            const appointmentsWeek: GroupAppointmentEvent[] = this.group(appointmentsOfMonth,week)
            for(let a of appointmentsWeek) {
                groups.push(a);
            }
        }
        return groups;
    }

    public group(appointments: Appointment[], dates: Date[]): GroupAppointmentEvent[] {
        let groupAppointment: GroupAppointmentEvent[] = [];

        for(let appointment of appointments) {
            for(let date of dates) {
                let group = groupAppointment.filter(a => this.dateHelper.isEqualDate(date, a.date));
                if(group.length == 0) {
                    const newGroup: GroupAppointmentEvent = { date, appointments: [] }
                    if(this.dateHelper.isDateInRange(date, appointment.start, appointment.end)) {
                        newGroup.appointments.push(this.appointmentMapper.goFrom(appointment, date));
                    }
                    groupAppointment.push(newGroup);
                } else {
                    groupAppointment.some(groupA => {
                        if(!this.dateHelper.isDateInRange(groupA.date, appointment.start, appointment.end)) return false;
                        if(groupA.appointments.some(a => a.id == appointment.id)) return false;
                        groupA.appointments.push(this.appointmentMapper.goFrom(appointment, groupA.date));
                        return true;
                    })
                }
            }
        }

        return groupAppointment;
    }

    private existAppointmentAllDayInGroup(appointment: Appointment, group: GroupAppointmentEvent[]): boolean {
        return group.some(groupA => groupA.appointments.some(a => a.id == appointment.id && a.allDay));
    }
}