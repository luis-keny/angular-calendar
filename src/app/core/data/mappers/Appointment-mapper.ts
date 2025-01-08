import { DateHelper } from "@core/util/date-helper";
import { Appointment } from "../model/appointment";
import { AppointmentEvent } from "../adapters/group-appointment-event";

export class AppointmentMapper {
    private dateHelper: DateHelper = new DateHelper();
    
    public goFrom(model: Appointment): AppointmentEvent {
        return {
            title: model.title,
            startTime: model.startTime,
            endTime: model.endTime,
            color: model.color,
        }
    }
    
    public goTo(adapter: AppointmentEvent, date: Date): Appointment {
        const dateString = this.dateHelper.dateToStringFormat(date);
        return {
            title: adapter.title,
            startTime: adapter.startTime,
            date: dateString,
            endTime: adapter.endTime,
            color: adapter.color,
        }
    }
}