import { RefreshCw, Send } from "lucide-react";

type ActionButtonsProps = {
  disabled: boolean;
  onReset: () => void;
  onPrintRequest: () => void;
};

export default function ActionButtons({
  disabled,
  onReset,
  onPrintRequest,
}: ActionButtonsProps) {
  return (
    <div className="actions-grid">
      <button className="action-reset" onClick={onReset}>
        <RefreshCw size={22} />
        Réinitialiser
      </button>
      <button className="action-request" disabled={disabled} onClick={onPrintRequest}>
        <Send size={22} />
        Demande d’impression
      </button>
    </div>
  );
}
