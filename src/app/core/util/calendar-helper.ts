import { Appointment } from "@core/data/model/appointment";
import { DateHelper } from "./date-helper";

export class CalendarHelper {
    private dateHelper = new DateHelper();

    public getAppointmentsOfDay(appointments: Appointment[], date: Date): Appointment[] {
        const appointmentsOfDay = appointments.filter(a => this.dateHelper.dateToStringFormat(date) === a.date);
        return appointmentsOfDay;
    }

    public getAppointmentsOfWeek(appointments: Appointment[], date: Date): Appointment[] {
        const week = this.dateHelper.getWeekForDate(date);
        const weekString = week.map(day => this.dateHelper.dateToStringFormat(day));
        const appointmentsOfWeek = appointments.filter(a => weekString.includes(a.date));

        return appointmentsOfWeek;
    }

    public getAppointmentsOfMonth(appointments: Appointment[], date: Date): Appointment[] {
        const month = this.dateHelper.getMonthForDate(date);
        const monthString = month.map(week => week.map(day => this.dateHelper.dateToStringFormat(day)));
        const appointmentsOfMonth = appointments.filter(a => monthString.some(week => week.includes(a.date)));

        return appointmentsOfMonth;
    }
}