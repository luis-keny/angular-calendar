import { Appointment } from '@core/data/model/appointment';
import { GroupAppointmentHelper } from './group-appointment-helper';
import { GroupAppointmentEvent } from '@core/data/adapters/group-appointment-event';
import { DateHelper } from './date-helper';

const appointments: Appointment[] = [
    {
      id: 1,
      title: 'Test',
      description: 'Test',
      allDay: false,
      start: new Date(2022, 0, 1),
      end: new Date(2022, 0, 2),
      draggable: false,
      resizable: {
          afterEnd: false,
          beforeStart: false,
      },
      color: '#00ff00',
      category: {
        id: 1,
        name: 'Test',
        color: '#00ff00',
      }
    },
    {
      id: 2,
      title: 'Test',
      description: 'Test',
      allDay: false,
      start: new Date(2022, 0, 2),
      end: new Date(2022, 0, 3),
      draggable: false,
      resizable: {
          afterEnd: false,
          beforeStart: false,
      },
      color: '#00ff00',
      category: {
        id: 1,
        name: 'Test',
        color: '#00ff00',
      }
    },
  ];

describe('GroupAppointmentHelper', () => {
  const groupHelper: GroupAppointmentHelper = new GroupAppointmentHelper();
  const dateHelper = new DateHelper();

  it('should be created', () => {
    expect(groupHelper).toBeTruthy();
  });

  it('should return group appointment of day', () => {
    const date = new Date(2022, 0, 1);
    const group: GroupAppointmentEvent = groupHelper.getGroupAppointmentsOfDay(appointments, date);
    expect(group.date).toEqual(date);
    expect(group.appointments.length).toEqual(1);
  });

  it('should return group appointment of week', () => {
    const date = new Date(2022, 0, 1);
    const group: GroupAppointmentEvent[] = groupHelper.getGroupAppointmentsOfWeek(appointments, date);
    const week = dateHelper.getWeekForDate(date);
    let expectedGroup: GroupAppointmentEvent[] = [];
    for(let day of week) {
      expectedGroup.push({ date: day, appointments: [] });
    }
    expectedGroup[6].appointments = [{
      id: 1,
      title: 'Test',
      description: 'Test',
      allDay: false,
      startTimeOfDay: '00:00',
      endTimeOfDay: '24:00',
      timeRangeOfEvent: {
        start: new Date(2022, 0, 1),
        end: new Date(2022, 0, 2),
      },
      draggable: false,
      resizable: {
          afterEnd: false,
          beforeStart: false,
      },
      color: '#00ff00',
      category: {
        id: 1,
        name: 'Test',
        color: '#00ff00',
      }
    },];
    expect(group).toEqual(expectedGroup);
  });

  it('should return group appointment of month', () => {
    const date = new Date(2022, 0, 1);
    const group: GroupAppointmentEvent[] = groupHelper.getGroupAppointmentsOfMonth(appointments, date);
    const month = dateHelper.getMonthForDate(date);
    let expectedGroup: GroupAppointmentEvent[] = [];
    for(let week of month) {
      for(let day of week) {
        expectedGroup.push({ date: day, appointments: [] });
      }
    }
    expectedGroup[6].appointments = [{
      id: 1,
      title: 'Test',
      description: 'Test',
      allDay: false,
      startTimeOfDay: '00:00',
      endTimeOfDay: '24:00',
      timeRangeOfEvent: {
        start: new Date(2022, 0, 1),
        end: new Date(2022, 0, 2),
      },
      draggable: false,
      resizable: {
          afterEnd: false,
          beforeStart: false,
      },
      color: '#00ff00',
      category: {
        id: 1,
        name: 'Test',
        color: '#00ff00',
      }
    },];
    expectedGroup[7].appointments = [{
      id: 1,
      title: 'Test',
      description: 'Test',
      allDay: false,
      startTimeOfDay: '00:00',
      endTimeOfDay: '00:00',
      timeRangeOfEvent: {
        start: new Date(2022, 0, 1),
        end: new Date(2022, 0, 2),
      },
      draggable: false,
      resizable: {
          afterEnd: false,
          beforeStart: false,
      },
      color: '#00ff00',
      category: {
        id: 1,
        name: 'Test',
        color: '#00ff00',
      }
    },
    {
      id: 2,
      title: 'Test',
      description: 'Test',
      allDay: false,
      startTimeOfDay: '00:00',
      endTimeOfDay: '24:00',
      draggable: false,
      resizable: {
          afterEnd: false,
          beforeStart: false,
      },
      timeRangeOfEvent: {
        start: new Date(2022, 0, 2),
        end: new Date(2022, 0, 3),
      },
      color: '#00ff00',
      category: {
        id: 1,
        name: 'Test',
        color: '#00ff00',
      }
    },
    ];
    expectedGroup[8].appointments = [
      {
        id: 2,
        title: 'Test',
        description: 'Test',
        allDay: false,
        startTimeOfDay: '00:00',
        endTimeOfDay: '00:00',
        draggable: false,
        resizable: {
            afterEnd: false,
            beforeStart: false,
        },
        timeRangeOfEvent: {
          start: new Date(2022, 0, 2),
          end: new Date(2022, 0, 3),
        },
        color: '#00ff00',
        category: {
          id: 1,
          name: 'Test',
          color: '#00ff00',
        }
      },
    ]
    expect(group).toEqual(expectedGroup);
  });
});