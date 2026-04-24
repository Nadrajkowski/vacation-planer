import { X, ExternalLink, MapPin } from 'lucide-react';

interface Props {
  embedUrl: string;
  originalUrl: string;
  name: string;
  onClose: () => void;
}

export function MapPanel({ embedUrl, originalUrl, name, onClose }: Props) {
  return (
    <aside className="map-panel">
      <div className="map-panel-header">
        <div className="map-panel-title">
          <MapPin size={14} className="map-panel-icon" />
          <span>{name}</span>
        </div>
        <div className="map-panel-actions">
          <a
            href={originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="map-panel-open-btn"
            title="Open in Google Maps"
          >
            <ExternalLink size={13} /> Open in Maps
          </a>
          <button className="map-panel-close-btn" onClick={onClose} title="Close map">
            <X size={16} />
          </button>
        </div>
      </div>
      <iframe
        src={embedUrl}
        className="map-panel-iframe"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map: ${name}`}
        style={{ border: 0 }}
      />
    </aside>
  );
}
