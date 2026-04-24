import { useState } from 'react';
import { MapPin, Euro, FileText, ExternalLink, Map, ChevronDown, ChevronUp } from 'lucide-react';
import { extractEmbedUrl } from '../utils/mapUtils';
import { useMapPanel } from '../context/MapContext';

interface Props {
  itemName: string;
  location?: string;
  priceEur?: number;
  notes?: string;
  eurToPln: number;
  onChange: (patch: { location?: string; priceEur?: number; notes?: string }) => void;
}

type InputCurrency = 'EUR' | 'PLN';

export function CardDetails({ itemName, location, priceEur, notes, eurToPln, onChange }: Props) {
  const [open, setOpen] = useState(!!(location || priceEur != null || notes));
  const [priceCurrency, setPriceCurrency] = useState<InputCurrency>('EUR');
  const { openMap } = useMapPanel();

  const embedUrl = location ? extractEmbedUrl(location) : null;

  const displayPrice = priceEur != null
    ? (priceCurrency === 'EUR' ? priceEur : +(priceEur * eurToPln).toFixed(2))
    : '';

  function handlePriceChange(raw: string) {
    const val = parseFloat(raw);
    if (isNaN(val) || raw === '') { onChange({ priceEur: undefined }); return; }
    onChange({ priceEur: priceCurrency === 'EUR' ? val : +(val / eurToPln).toFixed(4) });
  }

  const convertedPrice = priceEur != null
    ? (priceCurrency === 'EUR' ? `= zł ${(priceEur * eurToPln).toFixed(2)}` : `= €${priceEur.toFixed(2)}`)
    : null;

  return (
    <div className="card-details">
      <button className="details-toggle" onClick={() => setOpen(o => !o)}>
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        {open ? 'Hide details' : 'Details'}
      </button>

      {open && (
        <div className="details-body">
          {/* Location */}
          <div className="detail-row">
            <MapPin size={13} className="detail-icon" />
            <div className="detail-content">
              <div className="location-input-row">
                <input
                  type="url"
                  placeholder="Google Maps link"
                  value={location ?? ''}
                  onChange={e => onChange({ location: e.target.value || undefined })}
                  className="detail-input location-url-input"
                />
                {location && (
                  <a
                    href={location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="location-open-btn"
                    title="Open in Google Maps"
                  >
                    <ExternalLink size={12} />
                  </a>
                )}
                {embedUrl && (
                  <button
                    className="location-map-btn"
                    onClick={() => openMap({ embedUrl, originalUrl: location!, name: itemName })}
                    title="Show map preview"
                  >
                    <Map size={12} />
                    Preview
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="detail-row">
            <Euro size={13} className="detail-icon" />
            <div className="detail-content price-row">
              <button
                className="currency-toggle"
                onClick={() => setPriceCurrency(c => c === 'EUR' ? 'PLN' : 'EUR')}
              >
                {priceCurrency === 'EUR' ? '€' : 'zł'}
              </button>
              <input
                type="number"
                min={0}
                step={0.01}
                placeholder="0.00"
                value={displayPrice}
                onChange={e => handlePriceChange(e.target.value)}
                className="detail-input price-input"
              />
              {convertedPrice && <span className="price-converted">{convertedPrice}</span>}
            </div>
          </div>

          {/* Notes */}
          <div className="detail-row detail-row-notes">
            <FileText size={13} className="detail-icon" />
            <textarea
              placeholder="Notes…"
              value={notes ?? ''}
              onChange={e => onChange({ notes: e.target.value || undefined })}
              className="detail-notes"
              rows={2}
            />
          </div>
        </div>
      )}
    </div>
  );
}
