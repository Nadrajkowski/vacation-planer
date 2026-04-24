import { Download, Plane, ArrowRight, PanelLeft } from 'lucide-react';
import type { Vacation } from '../types/vacation';

interface Props {
  vacation: Vacation;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  onTitleChange: (title: string) => void;
  onStartDateChange: (date: string) => void;
  onStartTimeChange: (time: string) => void;
  onEndDateChange: (date: string) => void;
  onEndTimeChange: (time: string) => void;
  onExchangeRateChange: (rate: number) => void;
  onExport: () => void;
}

export function VacationHeader({
  vacation, sidebarOpen, onSidebarToggle,
  onTitleChange, onStartDateChange, onStartTimeChange,
  onEndDateChange, onEndTimeChange,
  onExchangeRateChange, onExport,
}: Props) {
  const totalEur = vacation.items.reduce((s, i) => s + (i.priceEur ?? 0), 0);
  const hasPrice = vacation.items.some(i => i.priceEur != null);

  return (
    <header className="header">
      <button className="sidebar-toggle" onClick={onSidebarToggle} title={sidebarOpen ? 'Hide outline' : 'Show outline'}>
        <PanelLeft size={16} />
      </button>

      <div className="header-brand">
        <Plane size={16} className="header-logo" />
        <input
          className="header-title"
          value={vacation.title}
          onChange={e => onTitleChange(e.target.value)}
          placeholder="Trip name"
        />
      </div>

      <div className="header-field">
        Arrive
        <input type="date" value={vacation.startDate} onChange={e => onStartDateChange(e.target.value)} />
        <input type="time" value={vacation.startTime} onChange={e => onStartTimeChange(e.target.value)} />
      </div>

      <ArrowRight size={13} className="header-arrow" />

      <div className="header-field">
        Depart
        <input type="date" value={vacation.endDate ?? ''} onChange={e => onEndDateChange(e.target.value)} min={vacation.startDate} />
        <input type="time" value={vacation.endTime ?? ''} onChange={e => onEndTimeChange(e.target.value)} disabled={!vacation.endDate} />
      </div>

      <div className="header-sep" />

      <div className="header-rate">
        1 EUR =
        <input
          type="number" min={0.01} step={0.01}
          value={vacation.eurToPln}
          onChange={e => { const v = parseFloat(e.target.value); if (v > 0) onExchangeRateChange(v); }}
        />
        PLN
      </div>

      {hasPrice && (
        <>
          <div className="header-sep" />
          <div className="header-total">
            Total <strong>€{totalEur.toFixed(2)}</strong>
            <div className="sep" />
            zł {(totalEur * vacation.eurToPln).toFixed(2)}
          </div>
        </>
      )}

      <button className="export-btn" onClick={onExport}>
        <Download size={13} /> Export
      </button>
    </header>
  );
}
