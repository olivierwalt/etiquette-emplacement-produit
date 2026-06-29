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

export type HistoryEntry = {
  id: string;
  action: "Demande d’impression";
  zone: Zone;
  allee: string;
  echelle: string;
  emplacement: string;
  barcodeValue: string;
  createdAt: string;
};
