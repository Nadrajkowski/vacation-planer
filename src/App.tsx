import { useEffect, useRef, useState } from 'react';
import {
  DndContext, closestCenter, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useVacation } from './hooks/useVacation';
import { groupItemsByDay } from './utils/timeCalc';
import { exportJSON } from './utils/export';
import { VacationHeader } from './components/VacationHeader';
import { DaySection } from './components/DaySection';
import { Outline } from './components/Outline';
import { MapPanel } from './components/MapPanel';
import { MapContext, type OpenMapPayload } from './context/MapContext';
import type { VacationItem } from './types/vacation';
import './App.css';

export default function App() {
  const {
    vacation, times,
    updateTitle, updateStartDate, updateStartTime,
    updateEndDate, updateEndTime, updateExchangeRate,
    addEvent, addSleep, updateItem, removeItem, reorderItems,
  } = useVacation();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeMap, setActiveMap] = useState<OpenMapPayload | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`);
    });
    ro.observe(el);
    document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`);
    return () => ro.disconnect();
  }, []);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = vacation.items.findIndex(i => i.id === active.id);
    const newIndex = vacation.items.findIndex(i => i.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) reorderItems(oldIndex, newIndex);
  }

  function handleDepartureDateTimeChange(datetimeLocal: string) {
    if (!datetimeLocal) return;
    updateEndDate(datetimeLocal.slice(0, 10));
    updateEndTime(datetimeLocal.slice(11, 16));
  }

  const dayGroups = groupItemsByDay(vacation.items);
  const itemIds = vacation.items.map(i => i.id);

  return (
    <MapContext.Provider value={{ openMap: setActiveMap }}>
      <div className="app">
        <div ref={headerRef}>
          <VacationHeader
            vacation={vacation}
            sidebarOpen={sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(o => !o)}
            onTitleChange={updateTitle}
            onStartDateChange={updateStartDate}
            onStartTimeChange={updateStartTime}
            onEndDateChange={updateEndDate}
            onEndTimeChange={updateEndTime}
            onExchangeRateChange={updateExchangeRate}
            onExport={() => exportJSON(vacation)}
          />
        </div>

        <div className="body-row">
          <Outline vacation={vacation} dayGroups={dayGroups} collapsed={!sidebarOpen} />

          <div className="main-scroll">
            <div className="timeline">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                  {dayGroups.map((groupItems, dayIndex) => (
                    <DaySection
                      key={dayIndex}
                      dayIndex={dayIndex}
                      vacation={vacation}
                      items={groupItems}
                      allItems={vacation.items}
                      times={times}
                      isLastDay={dayIndex === dayGroups.length - 1}
                      eurToPln={vacation.eurToPln}
                      onUpdateItem={(id, patch) => updateItem(id, patch as Partial<VacationItem>)}
                      onDeleteItem={removeItem}
                      onAddEvent={afterId => addEvent(afterId)}
                      onAddSleep={afterId => addSleep(afterId)}
                      onUpdateStartTime={updateStartTime}
                      onDepartureDateTimeChange={handleDepartureDateTimeChange}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>

          {activeMap && (
            <MapPanel
              embedUrl={activeMap.embedUrl}
              originalUrl={activeMap.originalUrl}
              name={activeMap.name}
              onClose={() => setActiveMap(null)}
            />
          )}
        </div>
      </div>
    </MapContext.Provider>
  );
}
