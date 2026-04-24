import { Clock } from 'lucide-react';
import { formatTime } from '../utils/timeCalc';

interface Props {
  time: Date;
}

export function TimeChip({ time }: Props) {
  return (
    <span className="time-chip">
      <Clock size={12} />
      {formatTime(time)}
    </span>
  );
}
