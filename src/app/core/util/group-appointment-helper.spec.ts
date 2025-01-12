import { Appointment } from '@core/data/model/appointment';
import { GroupAppointmentHelper } from './group-appointment-helper';
import { GroupAppointmentEvent } from '@core/data/adapters/group-appointment-event';
import { DateHelper } from './date-helper';

const appointments: Appointment[] = [
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
  {
    id: 2,
    title: "Team Meeting with the Product Manager",
    allDay: false,
    start: new Date("2025-01-10T10:00:00.000-05:00"),
    end: new Date("2025-01-11T11:00:00.000-05:00"),
    draggable: true,
    resizable: {
      afterEnd: true,
      beforeStart: true,
    },
    color: "#ff5733",
  },
  {
    id: 3,
    title: "Team Meeting with the Client",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eget risus sollicitudin, ullamcorper nunc eu, auctor ligula. Sed sodales aliquam nisl eget mollis. Quisque mollis nisi felis, eu convallis purus sagittis",
    allDay: false,
    start: new Date("2025-01-15T00:00:00.000-05:00"),
    end: new Date("2025-01-16T13:08:06.986-05:00"),
    draggable: true,
    resizable: {
      afterEnd: true,
      beforeStart: true,
    },
    color: "#000000",
    category: {
      id: 1,
      name: "Team Meeting",
      color: "#ff5733",
    },
  },
];

describe('GroupAppointmentHelper', () => {
  const groupHelper: GroupAppointmentHelper = new GroupAppointmentHelper();
  const dateHelper = new DateHelper();

  it('should be created', () => {
    expect(groupHelper).toBeTruthy();
  });

  it('should return group', () => {
    const date = new Date(2025, 0, 10);
    const group: GroupAppointmentEvent[] = groupHelper.group(appointments, [date]);
    expect(group[0].date).toEqual(date);
    expect(group[0]).withContext("Only has one appointment").toEqual({
      date,
      appointments: [
        {
          id: 2,
          title: "Team Meeting with the Product Manager",
          description: "",
          allDay: false,
          startTimeOfDay: "10:00",
          endTimeOfDay: "24:00",
          timeRangeOfEvent: {
            start: new Date("2025-01-10T10:00:00.000-05:00"),
            end: new Date("2025-01-11T11:00:00.000-05:00"),
          },
          draggable: true,
          resizable: {
            afterEnd: true,
            beforeStart: true,
          },
          color: "#ff5733",
          category: undefined,
        },
      ]
    });
  })

  it('should return group appointment of day', () => {
    const date = new Date(2025, 0, 10);
    const group: GroupAppointmentEvent = groupHelper.getGroupAppointmentsOfDay(appointments, date);
    expect(group.date).toEqual(date);
    expect(group).withContext("Only has one appointment").toEqual({
      date,
      appointments: [
        {
          id: 2,
          title: "Team Meeting with the Product Manager",
          description: "",
          allDay: false,
          startTimeOfDay: "10:00",
          endTimeOfDay: "24:00",
          timeRangeOfEvent: {
            start: new Date("2025-01-10T10:00:00.000-05:00"),
            end: new Date("2025-01-11T11:00:00.000-05:00"),
          },
          draggable: true,
          resizable: {
            afterEnd: true,
            beforeStart: true,
          },
          color: "#ff5733",
          category: undefined,
        },
      ]
    });
  });

  it("should return group appointment of week", () => {
    const date = new Date(2025, 0, 8);
    const group: GroupAppointmentEvent[] = groupHelper.getGroupAppointmentsOfWeek(
      appointments,
      date
    );
    const week = dateHelper.getWeekForDate(date);
  
    let expectedGroup: GroupAppointmentEvent[] = [];
    for (let day of week) {
      expectedGroup.push({ date: day, appointments: [] });
    }
  
    // Agregar citas a los días correspondientes de la semana
    expectedGroup[3].appointments = [
      // Miércoles 2025-01-08
      {
        id: 1,
        title: "Team Meeting with the Client",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eget risus sollicitudin, ullamcorper nunc eu, auctor ligula. Sed sodales aliquam nisl eget mollis. Quisque mollis nisi felis, eu convallis purus sagittis",
        allDay: false,
        startTimeOfDay: "00:00",
        endTimeOfDay: "08:00",
        timeRangeOfEvent: {
          start: new Date("2025-01-08T00:00:00.000-05:00"),
          end: new Date("2025-01-08T08:00:00.000-05:00"),
        },
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
  
    expectedGroup[5].appointments = [
      {
        id: 2,
        title: "Team Meeting with the Product Manager",
        description: "",
        allDay: false,
        startTimeOfDay: "10:00",
        endTimeOfDay: "24:00",
        timeRangeOfEvent: {
          start: new Date("2025-01-10T10:00:00.000-05:00"),
          end: new Date("2025-01-11T11:00:00.000-05:00"),
        },
        draggable: true,
        resizable: {
          afterEnd: true,
          beforeStart: true,
        },
        color: "#ff5733",
        category: undefined,
      },
    ];
  
    expectedGroup[6].appointments = [
      {
        id: 2,
        title: "Team Meeting with the Product Manager",
        description: "",
        allDay: false,
        startTimeOfDay: "00:00",
        endTimeOfDay: "11:00",
        timeRangeOfEvent: {
          start: new Date("2025-01-10T10:00:00.000-05:00"),
          end: new Date("2025-01-11T11:00:00.000-05:00"),
        },
        draggable: true,
        resizable: {
          afterEnd: true,
          beforeStart: true,
        },
        color: "#ff5733",
        category: undefined,
      },
    ];

    expect(group).toEqual(expectedGroup);
  });
});