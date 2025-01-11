import { Category } from "../model/appointment";

export interface AppointmentEvent {
    id: number;
    title: string;
    description: string;
    timeRangeOfEvent: {
        start: Date;
        end: Date;
    };
    startTimeOfDay: string;
    endTimeOfDay: string;
    allDay: boolean;
    draggable: boolean;
    resizable: {
        beforeStart: boolean;
        afterEnd: boolean;
    };
    color?: string;
    category?: Category;
}

export interface GroupAppointmentEvent {
    date: Date;
    appointments: AppointmentEvent[];
}
