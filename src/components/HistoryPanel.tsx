import { X } from "lucide-react";
import type { HistoryEntry } from "../types";

type HistoryPanelProps = {
  entries: HistoryEntry[];
  onClose: () => void;
  onClear: () => void;
};

export default function HistoryPanel({ entries, onClose, onClear }: HistoryPanelProps) {
  return (
    <div className="history-overlay" role="dialog" aria-modal="true" aria-label="Historique">
      <div className="history-panel">
        <div className="history-panel-header">
          <div>
            <h2>Historique</h2>
            <p>{entries.length} action{entries.length > 1 ? "s" : ""} enregistrée{entries.length > 1 ? "s" : ""}</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Fermer l’historique">
            <X size={22} />
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="empty-history">Aucune action pour le moment.</div>
        ) : (
          <div className="history-list">
            {entries.map((entry) => (
              <article className="history-item" key={entry.id}>
                <div>
                  <strong>{entry.action}</strong>
                  <span>{entry.barcodeValue}</span>
                </div>
                <time>{new Date(entry.createdAt).toLocaleString("fr-FR")}</time>
              </article>
            ))}
          </div>
        )}

        <button className="clear-history-button" onClick={onClear} disabled={entries.length === 0}>
          Vider l’historique
        </button>
      </div>
    </div>
  );
}
