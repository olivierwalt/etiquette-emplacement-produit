import { allees } from "../utils/format";

type AlleeSelectorProps = {
  value: string | null;
  onChange: (allee: string) => void;
};

export default function AlleeSelector({ value, onChange }: AlleeSelectorProps) {
  return (
    <div className="allee-grid">
      {allees.map((allee) => (
        <button
          className={`choice-button allee-button ${value === allee ? "active" : ""}`}
          key={allee}
          onClick={() => onChange(allee)}
        >
          {allee}
        </button>
      ))}
    </div>
  );
}
