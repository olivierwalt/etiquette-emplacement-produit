import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import type { Zone } from "../types";
import { formatEchelle, zoneCodes } from "../utils/format";

type LabelPreviewProps = {
  zone: Zone | null;
  allee: string | null;
  echelle: number | null;
  emplacement: string | null;
  barcodeValue: string;
};

export default function LabelPreview({
  zone,
  allee,
  echelle,
  emplacement,
  barcodeValue,
}: LabelPreviewProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    svgRef.current.innerHTML = "";
    if (!barcodeValue) return;

    JsBarcode(svgRef.current, barcodeValue, {
      format: "CODE128",
      displayValue: false,
      margin: 0,
      width: 1.4,
      height: 42,
    });
  }, [barcodeValue]);

  const isReady = Boolean(zone && allee && echelle && emplacement && barcodeValue);
  const smallIndex = zone ? zoneCodes[zone] : "";
  const zoneLocation = allee && echelle ? `${allee}${formatEchelle(echelle)}` : "";

  if (!isReady) {
    return (
      <div className="preview-wrap">
        <div className="label-empty" aria-label="Aucune étiquette à afficher" />
      </div>
    );
  }

  return (
    <div className="preview-wrap">
      <div className="label-preview" aria-label="Aperçu de l’étiquette">
        <div className="label-small-index">{smallIndex}</div>
        <div className="label-zone">{zoneLocation}</div>
        <svg className="label-barcode" ref={svgRef} />
        <div className="label-location">{emplacement}</div>
      </div>
    </div>
  );
}
