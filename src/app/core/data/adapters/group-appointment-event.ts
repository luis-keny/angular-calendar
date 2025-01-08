export interface AppointmentEvent {
    title: string;
    startTime: string;
    endTime: string;
    color?: string;
    top?: string;
    height?: string;
}

export interface GroupAppointmentEvent {
    date: Date;
    appointments: AppointmentEvent[];
}
