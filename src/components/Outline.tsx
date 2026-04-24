import { useEffect, useRef, useState } from 'react';
import type { Vacation, VacationItem } from '../types/vacation';
import { formatDate, getDayDate } from '../utils/timeCalc';

interface Props {
  vacation: Vacation;
  dayGroups: VacationItem[][];
  collapsed: boolean;
}

const DOT_COLORS: Record<string, string> = {
  arrival:   '#5a9e6a',
  event:     '#e8b840',
  sleep:     '#9b70cc',
  departure: '#e06040',
};

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function Outline({ vacation, dayGroups, collapsed }: Props) {
  const [activeDay, setActiveDay] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveDay(parseInt(visible[0].target.getAttribute('data-day-index') ?? '0'));
        }
      },
      { rootMargin: '0px 0px -75% 0px', threshold: 0 },
    );
    document.querySelectorAll<HTMLElement>('[data-day-index]').forEach(el =>
      observerRef.current!.observe(el)
    );
    return () => observerRef.current?.disconnect();
  }, [dayGroups.length]);

  return (
    <nav className={`sidebar${collapsed ? ' collapsed' : ''}`} aria-label="Trip outline">
      {dayGroups.map((items, dayIndex) => {
        const dayDate = getDayDate(vacation, dayIndex);
        const isActive = dayIndex === activeDay;

        return (
          <div key={dayIndex} className="sidebar-day">
            <button
              className={`sidebar-day-btn${isActive ? ' active' : ''}`}
              onClick={() => scrollTo(`day-${dayIndex}`)}
            >
              <span className="sidebar-day-num">Day {dayIndex + 1}</span>
              <span className="sidebar-day-date">{formatDate(dayDate)}</span>
            </button>

            <ul className="sidebar-items">
              {items.map(item => {
                const allIdx = vacation.items.indexOf(item);
                const isFirst = allIdx === 0;
                const isLast = allIdx === vacation.items.length - 1;
                const dotColor = item.kind === 'sleep'
                  ? DOT_COLORS.sleep
                  : isFirst ? DOT_COLORS.arrival
                  : isLast  ? DOT_COLORS.departure
                  : DOT_COLORS.event;

                return (
                  <li key={item.id}>
                    <button
                      className={`sidebar-item-btn${item.kind === 'sleep' ? ' sleep' : ''}`}
                      onClick={() => scrollTo(`item-${item.id}`)}
                    >
                      <span className="sidebar-dot" style={{ background: dotColor }} />
                      <span className="sidebar-item-name">{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
