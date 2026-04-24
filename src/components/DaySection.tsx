import { formatDate, getDayDate } from '../utils/timeCalc';
import type { VacationItem, VacationEvent, SleepPlace } from '../types/vacation';
import type { Vacation } from '../types/vacation';
import { EventCard } from './EventCard';
import { SleepCard } from './SleepCard';
import { AddItemMenu } from './AddItemMenu';

interface Props {
  dayIndex: number;
  vacation: Vacation;
  items: VacationItem[];
  allItems: VacationItem[];
  times: Map<string, Date>;
  isLastDay: boolean;
  eurToPln: number;
  onUpdateItem: (id: string, patch: Partial<VacationItem>) => void;
  onDeleteItem: (id: string) => void;
  onAddEvent: (afterId: string) => void;
  onAddSleep: (afterId: string) => void;
  onUpdateStartTime: (hhmm: string) => void;
  onDepartureDateTimeChange: (datetimeLocal: string) => void;
}

export function DaySection({
  dayIndex, vacation, items, times, isLastDay, eurToPln,
  onUpdateItem, onDeleteItem, onAddEvent, onAddSleep, onUpdateStartTime, onDepartureDateTimeChange,
}: Props) {
  const dayDate = getDayDate(vacation, dayIndex);
  const lastItemId = items[items.length - 1]?.id;
  const lastItem = items[items.length - 1];
  const hasSleep = lastItem?.kind === 'sleep';

  return (
    <section className="day-section" id={`day-${dayIndex}`} data-day-index={dayIndex}>
      <div className="day-header">
        <span className="day-label">Day {dayIndex + 1}</span>
        <span className="day-date">{formatDate(dayDate)}</span>
        <div className="day-line" />
      </div>

      {items.map(item => {
        if (item.kind === 'event') {
          const allIdx = vacation.items.indexOf(item);
          const isFirst = allIdx === 0;
          const isLast = allIdx === vacation.items.length - 1;
          return (
            <EventCard
              key={item.id}
              event={item as VacationEvent}
              computedTime={times.get(item.id)}
              isFirst={isFirst}
              isLast={isLast}
              eurToPln={eurToPln}
              onChange={patch => onUpdateItem(item.id, patch)}
              onDelete={() => onDeleteItem(item.id)}
              onStartTimeChange={isFirst ? onUpdateStartTime : undefined}
              onDepartureDateTimeChange={isLast ? onDepartureDateTimeChange : undefined}
            />
          );
        } else {
          return (
            <SleepCard
              key={item.id}
              sleep={item as SleepPlace}
              computedTime={times.get(item.id)}
              eurToPln={eurToPln}
              onChange={patch => onUpdateItem(item.id, patch)}
              onDelete={() => onDeleteItem(item.id)}
            />
          );
        }
      })}

      <AddItemMenu
        onAddEvent={() => onAddEvent(lastItemId)}
        onAddSleep={() => onAddSleep(lastItemId)}
        showSleep={!hasSleep || isLastDay}
      />
    </section>
  );
}
