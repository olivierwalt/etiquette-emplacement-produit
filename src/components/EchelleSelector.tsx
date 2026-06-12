import { echelles } from "../utils/format";

type EchelleSelectorProps = {
  value: number | null;
  onChange: (echelle: number) => void;
};

export default function EchelleSelector({ value, onChange }: EchelleSelectorProps) {
  return (
    <div className="echelle-grid">
      {echelles.map((echelle) => (
        <button
          className={`choice-button echelle-button ${value === echelle ? "active" : ""}`}
          key={echelle}
          onClick={() => onChange(echelle)}
        >
          {echelle}
        </button>
      ))}
    </div>
  );
}
