export type Zone =
  | "Zone 1 - St Joseph"
  | "Zone 2 - St Joseph"
  | "Mezzanine"
  | "Ambiant Magasin"
  | "Frais"
  | "Surgelés"
  | "Fruits Légumes"
  | "Homogène"
  | "Parapharmacie";

export type PrintDestination = "PL1" | "PL2";

export type HistoryEntry = {
  id: string;
  action: "Impression PL1" | "Impression PL2" | "Demande de remplacement";
  zone: Zone;
  allee: string;
  echelle: string;
  emplacement: string;
  barcodeValue: string;
  createdAt: string;
};
