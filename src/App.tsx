import { useMemo, useState } from "react";
import ActionButtons from "./components/ActionButtons";
import AlleeSelector from "./components/AlleeSelector";
import EchelleSelector from "./components/EchelleSelector";
import EmplacementKeypad from "./components/EmplacementKeypad";
import Header from "./components/Header";
import HistoryPanel from "./components/HistoryPanel";
import LabelPreview from "./components/LabelPreview";
import SectionCard from "./components/SectionCard";
import ZoneSelector from "./components/ZoneSelector";
import type { HistoryEntry, PrintDestination, Zone } from "./types";
import { buildBarcodeValue } from "./utils/barcode";
import { formatEchelle, formatEmplacement } from "./utils/format";
import { loadHistory, saveHistory } from "./utils/history";

const DEFAULT_STATUS = "Sélectionnez les 4 champs pour activer les actions.";

export default function App() {
  const [zone, setZone] = useState<Zone | null>(null);
  const [allee, setAllee] = useState<string | null>(null);
  const [echelle, setEchelle] = useState<number | null>(null);
  const [emplacement, setEmplacement] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [status, setStatus] = useState(DEFAULT_STATUS);

  const formattedEmplacement = useMemo(() => formatEmplacement(emplacement), [emplacement]);
  const barcodeValue = useMemo(() => {
    if (!zone || !allee || !echelle || !formattedEmplacement) return "";
    return buildBarcodeValue(zone, allee, echelle, emplacement);
  }, [allee, echelle, emplacement, formattedEmplacement, zone]);

  const isComplete = Boolean(zone && allee && echelle && formattedEmplacement);
  const displayStatus =
    status === DEFAULT_STATUS && isComplete && barcodeValue
      ? `Étiquette prête : ${barcodeValue}.`
      : status;

  function handleKeypadPress(value: string) {
    if (emplacement.length >= 3) return;
    setStatus(DEFAULT_STATUS);
    setEmplacement((current) => `${current}${value}`.slice(0, 3));
  }

  function handleReset() {
    setZone(null);
    setAllee(null);
    setEchelle(null);
    setEmplacement("");
    setStatus("Formulaire réinitialisé.");
  }

  function addHistoryEntry(action: HistoryEntry["action"]) {
    if (!zone || !allee || !echelle || !formattedEmplacement || !barcodeValue) return;

    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      action,
      zone,
      allee,
      echelle: formatEchelle(echelle),
      emplacement: formattedEmplacement,
      barcodeValue,
      createdAt: new Date().toISOString(),
    };
    const nextHistory = [entry, ...history].slice(0, 30);
    setHistory(nextHistory);
    saveHistory(nextHistory);
  }

  async function postPayload(url: string, payload: Record<string, unknown>) {
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // The local history keeps the tactile prototype useful before backend wiring.
    }
  }

  async function printLabel(destination: PrintDestination) {
    if (!zone || !allee || !echelle || !formattedEmplacement || !barcodeValue) return;

    const payload = {
      destination,
      zone,
      allee,
      echelle: formatEchelle(echelle),
      emplacement: formattedEmplacement,
      barcodeValue,
    };

    addHistoryEntry(destination === "PL1" ? "Impression PL1" : "Impression PL2");
    setStatus(`Étiquette ${barcodeValue} envoyée vers ${destination}.`);
    await postPayload("/api/print-label", payload);
  }

  async function requestReplacement() {
    if (!zone || !allee || !echelle || !formattedEmplacement || !barcodeValue) return;

    const payload = {
      zone,
      allee,
      echelle: formatEchelle(echelle),
      emplacement: formattedEmplacement,
      barcodeValue,
      createdAt: new Date().toISOString(),
    };

    addHistoryEntry("Demande de remplacement");
    setStatus(`Demande de remplacement créée pour ${barcodeValue}.`);
    await postPayload("/api/replacement-request", payload);
  }

  function clearHistory() {
    setHistory([]);
    saveHistory([]);
  }

  return (
    <main className="app-shell">
      <Header onHistoryClick={() => setIsHistoryOpen(true)} />

      <SectionCard number={1} title="Zone">
        <ZoneSelector
          value={zone}
          onChange={(nextZone) => {
            setStatus(DEFAULT_STATUS);
            setZone(nextZone);
          }}
        />
      </SectionCard>

      <SectionCard number={2} title="Allée">
        <AlleeSelector
          value={allee}
          onChange={(nextAllee) => {
            setStatus(DEFAULT_STATUS);
            setAllee(nextAllee);
          }}
        />
      </SectionCard>

      <SectionCard number={3} title="Échelle">
        <EchelleSelector
          value={echelle}
          onChange={(nextEchelle) => {
            setStatus(DEFAULT_STATUS);
            setEchelle(nextEchelle);
          }}
        />
      </SectionCard>

      <div className="lower-workspace">
        <SectionCard number={4} title="Emplacement">
          <EmplacementKeypad
            value={emplacement}
            formattedValue={formattedEmplacement}
            onPress={handleKeypadPress}
            onClear={() => {
              setStatus(DEFAULT_STATUS);
              setEmplacement("");
            }}
          />
        </SectionCard>

        <div className="preview-actions">
          <SectionCard number={5} title="Aperçu de l’étiquette">
            <LabelPreview
              zone={zone}
              allee={allee}
              echelle={echelle}
              emplacement={formattedEmplacement}
              barcodeValue={barcodeValue}
            />
          </SectionCard>

          <div className="status-line" role="status">
            {displayStatus}
          </div>

          <ActionButtons
            disabled={!isComplete}
            onPrint={printLabel}
            onReset={handleReset}
            onReplacement={requestReplacement}
          />
        </div>
      </div>

      {isHistoryOpen && (
        <HistoryPanel
          entries={history}
          onClose={() => setIsHistoryOpen(false)}
          onClear={clearHistory}
        />
      )}
    </main>
  );
}
