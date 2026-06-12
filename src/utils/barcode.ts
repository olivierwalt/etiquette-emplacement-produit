import type { Zone } from "../types";
import { formatEchelle, formatEmplacement, zoneCodes } from "./format";

const BARCODE_PREFIX = "902";

export function buildBarcodeValue(
  zone: Zone,
  allee: string,
  echelle: number,
  emplacement: string,
) {
  const formattedEmplacement = formatEmplacement(emplacement);
  if (!formattedEmplacement) return "";

  return `${BARCODE_PREFIX}${zoneCodes[zone]}${allee}${formatEchelle(echelle)}${formattedEmplacement}`;
}
