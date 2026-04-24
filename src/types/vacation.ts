export type ItemKind = 'event' | 'sleep';

interface BaseItem {
  id: string;
  kind: ItemKind;
}

export interface VacationEvent extends BaseItem {
  kind: 'event';
  name: string;
  duration: number;
  travelBefore: number;
  location?: string;
  priceEur?: number;
  notes?: string;
}

export interface SleepPlace extends BaseItem {
  kind: 'sleep';
  name: string;
  checkIn: string;
  checkOut: string;
  location?: string;
  priceEur?: number;
  notes?: string;
}

export type VacationItem = VacationEvent | SleepPlace;

export interface Vacation {
  id: string;
  title: string;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime?: string;
  eurToPln: number;
  items: VacationItem[];
}
