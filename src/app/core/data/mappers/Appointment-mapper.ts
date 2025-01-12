import { DateHelper } from "@core/util/date-helper";
import { Appointment } from "../model/appointment";
import { AppointmentEvent } from "../adapters/group-appointment-event";

export class AppointmentMapper {
    private dateHelper: DateHelper = new DateHelper();
    
    public goFrom(model: Appointment, date: Date): AppointmentEvent {
        let time = { start: '', end: '', }
        if (!model.allDay) time = this.getTimeRange(model.start, model.end, date);
        
        return {
            id:             model.id,
            title:          model.title,
            description:    model.description ?? '',
            allDay:         model.allDay,
            draggable:      model.draggable,
            resizable:      model.resizable,
            color:          model.color,
            category:       model.category,
            startTimeOfDay: time.start,
            endTimeOfDay:   time.end,
            timeRangeOfEvent: {
                end:        model.end,
                start:      model.start,
            },
        }
    }
    
    public goTo(adapter: AppointmentEvent): Appointment {
        return {
            id:             adapter.id,
            title:          adapter.title,
            description:    adapter.description,
            allDay:         adapter.allDay,
            start:          adapter.timeRangeOfEvent.start,
            end:            adapter.timeRangeOfEvent.end,
            draggable:      adapter.draggable,
            resizable:      adapter.resizable,
            color:          adapter.color,
            category:       adapter.category,
        }
    }

    private getTimeRange(startDate: Date, endDate: Date, currentDate: Date): { start: string, end: string } {
        const objectStart = {
            parts: this.dateHelper.getDateParts(startDate),
            time: `${startDate.getHours().toString().padStart(2,'0')}:${startDate.getMinutes().toString().padStart(2,'0')}`,
        };
        const objectEnd = {
            parts: this.dateHelper.getDateParts(endDate),
            time: `${endDate.getHours().toString().padStart(2,'0')}:${endDate.getMinutes().toString().padStart(2,'0')}`,
        };
        const partsCurrentDate = this.dateHelper.getDateParts(currentDate);

        if(!this.dateHelper.isEqualDate(startDate, endDate)) {
            if(partsCurrentDate.day == objectStart.parts.day) {
                return {
                    start: objectStart.time,
                    end: "24:00",
                }
            }
            else if(partsCurrentDate.day == objectEnd.parts.day) {
                return {
                    start: "00:00",
                    end: objectEnd.time,
                }
            } else {
                return {
                    start: '00:00',
                    end: '24:00',
                }
            }
        } else {
            return {
                start: objectStart.time,
                end: objectEnd.time,
            }
        }
    }
}