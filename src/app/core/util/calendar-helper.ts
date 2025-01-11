import { Appointment } from "@core/data/model/appointment";
import { DateHelper } from "./date-helper";

export class CalendarHelper {
    private dateHelper = new DateHelper();

    public getAppointmentsOfDay(appointments: Appointment[], date: Date): Appointment[] {
        const appointmentsOfDay = appointments.filter(a => this.dateHelper.isDateInRange(date, a.start, a.end));
        return appointmentsOfDay;
    }

    public getAppointmentsOfWeek(appointments: Appointment[], date: Date): Appointment[] {
        const week = this.dateHelper.getWeekForDate(date);
        const appointmentsOfWeek = appointments.filter(a => 
            week.map(day => 
                this.dateHelper.isDateInRange(day, a.start, a.end)
            )
        );

        return appointmentsOfWeek;
    }

    public getAppointmentsOfMonth(appointments: Appointment[], date: Date): Appointment[] {
        const month = this.dateHelper.getMonthForDate(date);
        const appointmentsOfMonth = appointments.filter(a => 
            month.map(week => 
                week.map(day => this.dateHelper.isDateInRange(day, a.start, a.end))
            )
        );

        return appointmentsOfMonth;
    }
}