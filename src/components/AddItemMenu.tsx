import { Plus, BedDouble, MapPin } from 'lucide-react';
import { useState } from 'react';

interface Props {
  onAddEvent: () => void;
  onAddSleep: () => void;
  showSleep?: boolean;
}

export function AddItemMenu({ onAddEvent, onAddSleep, showSleep = true }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="add-menu">
      {open ? (
        <div className="add-options">
          <button className="add-option-btn" onClick={() => { onAddEvent(); setOpen(false); }}>
            <MapPin size={14} /> Add event
          </button>
          {showSleep && (
            <button className="add-option-btn add-option-sleep" onClick={() => { onAddSleep(); setOpen(false); }}>
              <BedDouble size={14} /> Add sleep
            </button>
          )}
          <button className="add-cancel-btn" onClick={() => setOpen(false)}>Cancel</button>
        </div>
      ) : (
        <button className="add-trigger-btn" onClick={() => setOpen(true)}>
          <Plus size={14} /> Add
        </button>
      )}
    </div>
  );
}
