import type { Zone } from "../types";

export const zones: Zone[] = [
  "Zone 1 - St Joseph",
  "Zone 2 - St Joseph",
  "Mezzanine",
  "Ambiant Magasin",
  "Frais",
  "Surgelés",
  "Fruits Légumes",
  "Homogène",
  "Parapharmacie",
];

export const allees = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const echelles = Array.from({ length: 15 }, (_, i) => i + 1);

export const zoneCodes: Record<Zone, string> = {
  "Zone 1 - St Joseph": "1",
  "Zone 2 - St Joseph": "2",
  Mezzanine: "8",
  "Ambiant Magasin": "3",
  Frais: "4",
  Surgelés: "5",
  "Fruits Légumes": "6",
  Homogène: "6",
  Parapharmacie: "7",
};

export function formatEchelle(value: number) {
  return String(value).padStart(2, "0");
}

export function formatEmplacement(value: string) {
  const number = Number(value);
  if (!number || number < 1 || number > 999) return null;
  return String(number).padStart(3, "0");
}

export function getLabelAddress(zone: Zone, allee: string, echelle: number) {
  return `${zoneCodes[zone]} ${allee} ${formatEchelle(echelle)}`;
}
