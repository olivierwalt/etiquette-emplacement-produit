import { Printer, RefreshCw, Repeat2 } from "lucide-react";
import type { PrintDestination } from "../types";

type ActionButtonsProps = {
  disabled: boolean;
  onPrint: (destination: PrintDestination) => void;
  onReset: () => void;
  onReplacement: () => void;
};

export default function ActionButtons({
  disabled,
  onPrint,
  onReset,
  onReplacement,
}: ActionButtonsProps) {
  return (
    <div className="actions-grid">
      <button className="action-print" disabled={disabled} onClick={() => onPrint("PL1")}>
        <Printer size={26} />
        Imprimer à PL1
      </button>
      <button className="action-print" disabled={disabled} onClick={() => onPrint("PL2")}>
        <Printer size={26} />
        Imprimer à PL2
      </button>
      <button className="action-reset" onClick={onReset}>
        <RefreshCw size={22} />
        Réinitialiser
      </button>
      <button className="action-replace" disabled={disabled} onClick={onReplacement}>
        <Repeat2 size={22} />
        Demande de remplacement de l’étiquette
      </button>
    </div>
  );
}
