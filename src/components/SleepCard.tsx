import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, BedDouble, Trash2 } from 'lucide-react';
import type { SleepPlace } from '../types/vacation';
import { TimeChip } from './TimeChip';
import { CardDetails } from './CardDetails';

interface Props {
  sleep: SleepPlace;
  computedTime: Date | undefined;
  eurToPln: number;
  onChange: (patch: Partial<SleepPlace>) => void;
  onDelete: () => void;
}

export function SleepCard({ sleep, computedTime, eurToPln, onChange, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sleep.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      id={`item-${sleep.id}`}
      className={`card sleep-card ${isDragging ? 'card-dragging' : ''}`}
    >
      <button className="drag-handle" {...attributes} {...listeners} title="Drag to reorder">
        <GripVertical size={14} />
      </button>
      <div className="card-inner">
        <div className="card-header">
          <div className="card-left">
            <BedDouble size={15} className="card-icon" />
            <input
              className="card-name"
              value={sleep.name}
              onChange={e => onChange({ name: e.target.value })}
              placeholder="Place to sleep"
            />
            <span className="card-tag">Sleep</span>
          </div>
          <div className="card-right">
            {computedTime && <TimeChip time={computedTime} />}
            <button className="btn-delete" onClick={onDelete} title="Delete sleep">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="card-meta sleep-times">
          <label className="meta-label">
            Check-in
            <input type="time" value={sleep.checkIn} onChange={e => onChange({ checkIn: e.target.value })} className="meta-input time-input" />
          </label>
          <label className="meta-label">
            Check-out
            <input type="time" value={sleep.checkOut} onChange={e => onChange({ checkOut: e.target.value })} className="meta-input time-input" />
          </label>
        </div>

        <CardDetails
          itemName={sleep.name}
          location={sleep.location}
          priceEur={sleep.priceEur}
          notes={sleep.notes}
          eurToPln={eurToPln}
          onChange={patch => onChange(patch)}
        />
      </div>
    </div>
  );
}
