import type { Vacation, VacationItem } from '../types/vacation';

function parseDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`);
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function setTimeOnDate(base: Date, hhmm: string): Date {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
}

function nextDayAt(base: Date, hhmm: string): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + 1);
  const [h, m] = hhmm.split(':').map(Number);
  d.setHours(h, m, 0, 0);
  return d;
}

export function calculateTimes(vacation: Vacation): Map<string, Date> {
  const map = new Map<string, Date>();
  let cursor = parseDateTime(vacation.startDate, vacation.startTime);
  const lastIdx = vacation.items.length - 1;

  vacation.items.forEach((item, i) => {
    // Last event is pinned to endDate + endTime when both are set
    if (i === lastIdx && item.kind === 'event' && vacation.endDate && vacation.endTime) {
      map.set(item.id, parseDateTime(vacation.endDate, vacation.endTime));
      return;
    }

    if (item.kind === 'event') {
      cursor = addMinutes(cursor, item.travelBefore);
      map.set(item.id, new Date(cursor));
      cursor = addMinutes(cursor, item.duration);
    } else {
      const checkInTime = setTimeOnDate(cursor, item.checkIn);
      map.set(item.id, checkInTime);
      cursor = nextDayAt(cursor, item.checkOut);
    }
  });

  return map;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatDateTime(date: Date): string {
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' · ' +
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function toDatetimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function getDayDate(vacation: Vacation, dayIndex: number): Date {
  const base = new Date(`${vacation.startDate}T00:00:00`);
  base.setDate(base.getDate() + dayIndex);
  return base;
}

export function groupItemsByDay(items: VacationItem[]): VacationItem[][] {
  const days: VacationItem[][] = [];
  let current: VacationItem[] = [];

  for (const item of items) {
    current.push(item);
    if (item.kind === 'sleep') {
      days.push(current);
      current = [];
    }
  }

  if (current.length > 0) {
    days.push(current);
  }

  return days;
}
