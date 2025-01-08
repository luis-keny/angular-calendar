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
        return this.group(appointmentsOfDay)[0];
    }

    public getGroupAppointmentsOfWeek(appointments: Appointment[], date: Date) {
        const appointmentsOfWeek = this.calendarHelper.getAppointmentsOfWeek(appointments, date);
        return this.group(appointmentsOfWeek);
    }

    public getGroupAppointmentsOfMonth(appointments: Appointment[], date: Date) {
        const appointmentsOfMonth = this.calendarHelper.getAppointmentsOfMonth(appointments, date);
        return this.group(appointmentsOfMonth);
    }

    public group(appointments: Appointment[]): GroupAppointmentEvent[] {
        let groupAppointment: GroupAppointmentEvent[] = [];

        for(let appointment of appointments) {
            const dateStringParts = appointment.date.split('-');
            const year = parseInt(dateStringParts[0]);
            const month = parseInt(dateStringParts[1]);
            const day = parseInt(dateStringParts[2]);
            const dateGroup = this.dateHelper.buildDate(year, month, day);

            let group = groupAppointment.filter(a => this.dateHelper.isEqualDate(dateGroup, a.date))[0];

            if(!group) {
                group = { date: dateGroup, appointments: [] }
                group.appointments.push(this.appointmentMapper.goFrom(appointment));
                groupAppointment.push(group);
            } else {
                groupAppointment.some(a => {
                    if(!(this.dateHelper.isEqualDate(dateGroup, a.date))) return false;
                    a.appointments.push(this.appointmentMapper.goFrom(appointment));
                    return true;
                })
            }
        }

        return groupAppointment;
    }
}