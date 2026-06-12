import type { Zone } from "../types";
import { zones } from "../utils/format";

type ZoneSelectorProps = {
  value: Zone | null;
  onChange: (zone: Zone) => void;
};

export default function ZoneSelector({ value, onChange }: ZoneSelectorProps) {
  return (
    <div className="zone-grid">
      {zones.map((zone) => (
        <button
          className={`choice-button zone-button ${value === zone ? "active" : ""}`}
          key={zone}
          onClick={() => onChange(zone)}
        >
          {zone}
        </button>
      ))}
    </div>
  );
}
