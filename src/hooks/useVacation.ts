import { useState, useCallback, useMemo } from 'react';
import type { Vacation, VacationItem, VacationEvent, SleepPlace } from '../types/vacation';
import { loadVacation, saveVacation } from '../utils/storage';
import { calculateTimes } from '../utils/timeCalc';
import { createId } from '../utils/ids';
import { arrayMove } from '@dnd-kit/sortable';

function persist(v: Vacation): Vacation {
  saveVacation(v);
  return v;
}

function syncSleepPlaces(v: Vacation): Vacation {
  if (!v.endDate || !v.startDate) return v;

  const start = new Date(v.startDate + 'T00:00:00');
  const end = new Date(v.endDate + 'T00:00:00');
  const nights = Math.max(0, Math.round((end.getTime() - start.getTime()) / 86_400_000));
  const currentSleepCount = v.items.filter(i => i.kind === 'sleep').length;
  const toAdd = nights - currentSleepCount;
  if (toAdd <= 0) return v;

  const items = [...v.items];
  // insert before last item (flight home)
  const insertAt = items.length - 1;
  for (let i = 0; i < toAdd; i++) {
    const sleep: SleepPlace = {
      id: createId(),
      kind: 'sleep',
      name: 'Accommodation',
      checkIn: '22:00',
      checkOut: '08:00',
    };
    items.splice(insertAt + i, 0, sleep);
  }
  return { ...v, items };
}

export function useVacation() {
  const [vacation, setVacation] = useState<Vacation>(() => loadVacation());

  const update = useCallback((updater: (v: Vacation) => Vacation) => {
    setVacation(prev => persist(updater(prev)));
  }, []);

  const updateTitle = useCallback((title: string) => {
    update(v => ({ ...v, title }));
  }, [update]);

  const updateStartDate = useCallback((startDate: string) => {
    update(v => ({ ...v, startDate }));
  }, [update]);

  const updateStartTime = useCallback((startTime: string) => {
    update(v => ({ ...v, startTime }));
  }, [update]);

  const updateEndDate = useCallback((endDate: string) => {
    update(v => syncSleepPlaces({ ...v, endDate }));
  }, [update]);

  const updateEndTime = useCallback((endTime: string) => {
    update(v => ({ ...v, endTime }));
  }, [update]);

  const updateExchangeRate = useCallback((eurToPln: number) => {
    update(v => ({ ...v, eurToPln }));
  }, [update]);

  const addEvent = useCallback((afterId?: string) => {
    const newEvent: VacationEvent = {
      id: createId(),
      kind: 'event',
      name: 'New event',
      duration: 60,
      travelBefore: 30,
    };
    update(v => {
      const items = [...v.items];
      if (afterId) {
        const idx = items.findIndex(i => i.id === afterId);
        const insertAt = idx === -1 ? items.length - 1 : idx + 1;
        items.splice(Math.min(insertAt, items.length - 1), 0, newEvent);
      } else {
        items.splice(items.length - 1, 0, newEvent);
      }
      return { ...v, items };
    });
  }, [update]);

  const addSleep = useCallback((afterId?: string) => {
    const newSleep: SleepPlace = {
      id: createId(),
      kind: 'sleep',
      name: 'Hotel',
      checkIn: '22:00',
      checkOut: '08:00',
    };
    update(v => {
      const items = [...v.items];
      if (afterId) {
        const idx = items.findIndex(i => i.id === afterId);
        const insertAt = idx === -1 ? items.length - 1 : idx + 1;
        items.splice(Math.min(insertAt, items.length - 1), 0, newSleep);
      } else {
        items.splice(items.length - 1, 0, newSleep);
      }
      return { ...v, items };
    });
  }, [update]);

  const updateItem = useCallback((id: string, patch: Partial<VacationItem>) => {
    update(v => ({
      ...v,
      items: v.items.map(item => item.id === id ? { ...item, ...patch } as VacationItem : item),
    }));
  }, [update]);

  const removeItem = useCallback((id: string) => {
    update(v => {
      const items = v.items.filter(i => i.id !== id);
      if (items.length < 2) return v;
      return { ...v, items };
    });
  }, [update]);

  const reorderItems = useCallback((oldIndex: number, newIndex: number) => {
    update(v => {
      const items = arrayMove(v.items, oldIndex, newIndex);
      if (items[0].id !== v.items[0].id || items[items.length - 1].id !== v.items[v.items.length - 1].id) {
        return v;
      }
      return { ...v, items };
    });
  }, [update]);

  const times = useMemo(() => calculateTimes(vacation), [vacation]);

  return {
    vacation,
    times,
    updateTitle,
    updateStartDate,
    updateStartTime,
    updateEndDate,
    updateEndTime,
    updateExchangeRate,
    addEvent,
    addSleep,
    updateItem,
    removeItem,
    reorderItems,
  };
}
