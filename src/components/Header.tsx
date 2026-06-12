import { History } from "lucide-react";

type HeaderProps = {
  onHistoryClick: () => void;
};

export default function Header({ onHistoryClick }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="barcode-logo" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div>
          <h1>ÉTIQUETTE EMPLACEMENT PRODUIT</h1>
          <p>Générez vos étiquettes d’emplacement en quelques secondes</p>
        </div>
      </div>
      <button className="history-button" onClick={onHistoryClick}>
        <History size={20} />
        Historique
      </button>
    </header>
  );
}
