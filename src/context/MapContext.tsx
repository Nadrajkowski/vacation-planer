import { createContext, useContext } from 'react';

export interface OpenMapPayload {
  embedUrl: string;
  originalUrl: string;
  name: string;
}

interface MapContextValue {
  openMap: (payload: OpenMapPayload) => void;
}

export const MapContext = createContext<MapContextValue | null>(null);

export function useMapPanel(): MapContextValue {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('useMapPanel must be used inside MapContext.Provider');
  return ctx;
}
