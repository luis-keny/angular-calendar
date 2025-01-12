import { CalendarHelper } from "./calendar-helper";

describe('CalendarHelper', () => {
  const calendarHelper = new CalendarHelper();

  it('should be created', () => {
    expect(calendarHelper).toBeTruthy();
  });

  it('should return appointments of day', () => {
    const date = new Date(2025, 0, 8);
    const appointments: any[] = [
      {
        id: 1,
        title: "Team Meeting with the Client",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eget risus sollicitudin, ullamcorper nunc eu, auctor ligula. Sed sodales aliquam nisl eget mollis. Quisque mollis nisi felis, eu convallis purus sagittis",
        allDay: false,
        start: new Date("2025-01-08T00:00:00.000-05:00"),
        end: new Date("2025-01-08T08:00:00.000-05:00"),
        draggable: true,
        resizable: {
          afterEnd: true,
          beforeStart: true,
        },
        color: "#ff5733",
        category: {
          id: 1,
          name: "Team Meeting",
          color: "#ff5733",
        },
      },
    ];
    const appointmentsOfDay = calendarHelper.getAppointmentsOfDay(appointments, date);
    expect(appointmentsOfDay).toEqual([appointments[0]]);
  });
});