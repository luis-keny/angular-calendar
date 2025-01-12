export interface Appointment {
    id: number;
    title: string;
    description?: string;
    start: Date;
    end: Date;
    allDay: boolean;
    draggable: boolean;
    resizable: {
        beforeStart: boolean;
        afterEnd: boolean;
    };
    color?: string;
    category?: Category;
}

export interface Category {
    id: number;
    name: string;
    color: string;
}