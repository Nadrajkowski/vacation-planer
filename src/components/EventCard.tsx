import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plane, MapPin, Trash2 } from 'lucide-react';
import type { VacationEvent } from '../types/vacation';
import { toDatetimeLocal } from '../utils/timeCalc';
import { TravelConnector } from './TravelConnector';
import { CardDetails } from './CardDetails';

interface Props {
  event: VacationEvent;
  computedTime: Date | undefined;
  isFirst: boolean;
  isLast: boolean;
  eurToPln: number;
  onChange: (patch: Partial<VacationEvent>) => void;
  onDelete: () => void;
  onStartTimeChange?: (hhmm: string) => void;
  onDepartureDateTimeChange?: (datetimeLocal: string) => void;
}

function toHHMM(d: Date): string {
  return d.toTimeString().slice(0, 5);
}

function parseHHMM(hhmm: string, base: Date): Date {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
}

export function EventCard({
  event, computedTime, isFirst, isLast, eurToPln,
  onChange, onDelete, onStartTimeChange, onDepartureDateTimeChange,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: event.id,
    disabled: isFirst || isLast,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const computedEndTime = computedTime
    ? new Date(computedTime.getTime() + event.duration * 60000)
    : undefined;

  function handleStartTimeChange(hhmm: string) {
    if (!computedTime || !hhmm) return;
    if (isFirst) { onStartTimeChange?.(hhmm); return; }
    const prevEndTime = new Date(computedTime.getTime() - event.travelBefore * 60000);
    const newStart = parseHHMM(hhmm, computedTime);
    if (newStart < prevEndTime) newStart.setDate(newStart.getDate() + 1);
    onChange({ travelBefore: Math.max(0, Math.round((newStart.getTime() - prevEndTime.getTime()) / 60000)) });
  }

  function handleEndTimeChange(hhmm: string) {
    if (!computedTime || !hhmm) return;
    const newEnd = parseHHMM(hhmm, computedTime);
    if (newEnd <= computedTime) newEnd.setDate(newEnd.getDate() + 1);
    onChange({ duration: Math.max(1, Math.round((newEnd.getTime() - computedTime.getTime()) / 60000)) });
  }

  const icon = isFirst
    ? <Plane size={16} className="card-icon arrival" />
    : isLast
      ? <Plane size={16} className="card-icon departure" style={{ transform: 'rotate(180deg)' }} />
      : <MapPin size={16} className="card-icon" />;

  return (
    <div className="card-wrapper" id={`item-${event.id}`}>
      {!isFirst && (
        <TravelConnector
          minutes={event.travelBefore}
          onChange={mins => onChange({ travelBefore: mins })}
        />
      )}
      <div
        ref={setNodeRef}
        style={style}
        className={`card event-card ${isFirst ? 'card-arrival' : ''} ${isLast ? 'card-departure' : ''} ${isDragging ? 'card-dragging' : ''}`}
      >
        {!isFirst && !isLast && (
          <button className="drag-handle" {...attributes} {...listeners} title="Drag to reorder">
            <GripVertical size={14} />
          </button>
        )}
        <div className="card-inner">
        <div className="card-header">
          <div className="card-left">
            {icon}
            <input
              className="card-name"
              value={event.name}
              onChange={e => onChange({ name: e.target.value })}
              placeholder="Event name"
            />
            <span className="card-tag">
              {isFirst ? 'Arrival' : isLast ? 'Departure' : 'Event'}
            </span>
          </div>
          <div className="card-right">
            {!isFirst && !isLast && (
              <button className="btn-delete" onClick={onDelete} title="Delete event">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="card-meta">
          {isLast ? (
            /* Departure: datetime-local controls endDate + endTime */
            <>
              <label className="meta-label">
                Departs
                <input
                  type="datetime-local"
                  value={computedTime ? toDatetimeLocal(computedTime) : ''}
                  onChange={e => onDepartureDateTimeChange?.(e.target.value)}
                  className="meta-input datetime-input"
                />
              </label>
              <span className="meta-arrow">→</span>
              <label className="meta-label">
                Lands
                <input
                  type="time"
                  value={computedEndTime ? toHHMM(computedEndTime) : ''}
                  onChange={e => handleEndTimeChange(e.target.value)}
                  className="meta-input time-input"
                />
              </label>
              <label className="meta-label">
                Duration
                <input
                  type="number"
                  min={1}
                  value={event.duration}
                  onChange={e => onChange({ duration: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="meta-input"
                />
                min
              </label>
            </>
          ) : (
            /* Normal event: time chain */
            <>
              <label className="meta-label">
                Start
                <input
                  type="time"
                  value={computedTime ? toHHMM(computedTime) : ''}
                  onChange={e => handleStartTimeChange(e.target.value)}
                  className="meta-input time-input"
                  disabled={isFirst && !onStartTimeChange}
                />
              </label>
              <span className="meta-arrow">→</span>
              <label className="meta-label">
                End
                <input
                  type="time"
                  value={computedEndTime ? toHHMM(computedEndTime) : ''}
                  onChange={e => handleEndTimeChange(e.target.value)}
                  className="meta-input time-input"
                />
              </label>
              <label className="meta-label">
                Duration
                <input
                  type="number"
                  min={1}
                  value={event.duration}
                  onChange={e => onChange({ duration: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="meta-input"
                />
                min
              </label>
            </>
          )}
        </div>

        <CardDetails
          itemName={event.name}
          location={event.location}
          priceEur={event.priceEur}
          notes={event.notes}
          eurToPln={eurToPln}
          onChange={patch => onChange(patch)}
        />
        </div>{/* card-inner */}
      </div>
    </div>
  );
}
