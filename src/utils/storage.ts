import type { Vacation } from '../types/vacation';
import { createId } from './ids';

const KEY = 'vacation-planner-v1';

function defaultVacation(): Vacation {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: createId(),
    title: 'My Vacation',
    startDate: today,
    startTime: '09:00',
    eurToPln: 4.25,
    items: [
      {
        id: createId(),
        kind: 'event',
        name: 'Arrival',
        duration: 60,
        travelBefore: 0,
      },
      {
        id: createId(),
        kind: 'event',
        name: 'Check in & settle',
        duration: 90,
        travelBefore: 45,
      },
      {
        id: createId(),
        kind: 'sleep',
        name: 'Hotel',
        checkIn: '22:00',
        checkOut: '08:00',
      },
      {
        id: createId(),
        kind: 'event',
        name: 'Breakfast',
        duration: 60,
        travelBefore: 0,
      },
      {
        id: createId(),
        kind: 'event',
        name: 'Flight Home',
        duration: 120,
        travelBefore: 120,
      },
    ],
  };
}

export function loadVacation(): Vacation {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const v = JSON.parse(raw) as Vacation;
      // migrate older stored data missing eurToPln
      if (!v.eurToPln) v.eurToPln = 4.25;
      return v;
    }
  } catch {
    // corrupted storage — fall through to default
  }
  return defaultVacation();
}

export function saveVacation(vacation: Vacation): void {
  localStorage.setItem(KEY, JSON.stringify(vacation));
}
