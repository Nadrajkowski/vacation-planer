import { MoveVertical } from 'lucide-react';

interface Props {
  minutes: number;
  onChange: (minutes: number) => void;
}

export function TravelConnector({ minutes, onChange }: Props) {
  return (
    <div className="travel-connector">
      <div className="travel-line" />
      <div className="travel-pill">
        <MoveVertical size={12} />
        <input
          type="number"
          min={0}
          value={minutes}
          onChange={e => onChange(Math.max(0, parseInt(e.target.value) || 0))}
          className="travel-input"
          title="Travel time in minutes"
        />
        <span className="travel-unit">min travel</span>
      </div>
      <div className="travel-line" />
    </div>
  );
}
