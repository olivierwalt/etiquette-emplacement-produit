# Étiquette emplacement produit

Webapp tactile React/Vite pour créer, prévisualiser et envoyer des étiquettes d'emplacement produit en Code 128.

## État actuel

- App frontend React + TypeScript + Vite.
- Interface sombre tactile, pensée pour tablette/iPad en mode paysage.
- Déploiement actuel sur Raspberry Pi :
  - hôte : `olivier@192.168.1.41`
  - dossier : `/home/olivier/etiquette-emplacement-produit`
  - URL : `http://192.168.1.41:8006`
  - service : `etiquette.service` en service utilisateur systemd
  - serveur utilisé sur Raspberry : `python3 server.py`
- Node n'était pas installé sur le Raspberry au moment du déploiement ; `server.py` sert donc la build statique `dist/`.

## Fonctionnel

L'utilisateur sélectionne :

1. Zone
2. Allée
3. Échelle
4. Emplacement via clavier numérique

Puis l'application affiche une étiquette blanche au ratio `70mm x 38mm`, génère un code-barres Code 128 et propose :

- `Réinitialiser`
- `Ajouter à l'impression`
- `Imprimer la liste`
- `Vider la liste`
- crédit `développé par @olivierdern`

La version actuelle est pensée pour fonctionner comme une simple page web sur un PC sans autorisations particulières. Elle ne dépend d'aucun endpoint backend. Les étiquettes ajoutées à l'impression sont stockées dans une file locale temporaire, vidée automatiquement à chaque ouverture de la page, puis imprimées ensemble au format figé `70mm x 38mm`.

Une version autonome hors ligne est disponible avec :

```text
etiquette-simple.html
vendor/JsBarcode.all.min.js
```

Ces deux éléments peuvent être copiés sur un PC et ouverts directement dans un navigateur. Il ne faut pas d'installation Node, pas de serveur local, pas d'accès Internet et pas de droits administrateur. Le dossier `vendor/` doit rester à côté du fichier HTML.

## Encodage Code 128

Format encodé :

```text
902 + indicatif zone + allée + échelle sur 2 chiffres + emplacement sur 3 chiffres
```

Exemples :

```text
Zone 1 - St Joseph / A / 03 / 204 => 9021A03204
Frais / S / 04 / 405              => 9024S04405
```

Correspondance des zones :

| Zone | Indicatif |
| --- | --- |
| Zone 1 - St Joseph | 1 |
| Zone 2 - St Joseph | 2 |
| Mezzanine | 8 |
| Ambiant Magasin | 3 |
| Frais | 4 |
| Surgelés | 5 |
| Fruits Légumes | 6 |
| Homogène | 6 |
| Parapharmacie | 7 |

Le code est centralisé dans :

- `src/utils/format.ts`
- `src/utils/barcode.ts`

## Rendu de l'étiquette

L'aperçu n'est affiché que lorsque les champs sont complets.

Disposition actuelle :

```json
{
  "label": { "width": "70mm", "height": "38mm" },
  "smallIndex": { "x": "4%", "y": "36%", "fontWeight": "400", "fontSize": "7%" },
  "zone": { "x": "12%", "y": "28%", "fontWeight": "400", "fontSize": "25%" },
  "barcode": { "type": "CODE128", "x": "46%", "y": "8%", "width": "43%", "height": "20%" },
  "location": { "x": "67%", "y": "83%", "fontWeight": "700", "fontSize": "54%" }
}
```

Important : pour `location`, `y=83%` est traité comme un ancrage de bas visuel, pour éviter que le grand numéro sorte de l'étiquette.

Fichiers concernés :

- `src/components/LabelPreview.tsx`
- `src/styles/app.css`

## Mise en page écran

La dernière version compacte vise à éviter le scroll sur tablette/écran paysage :

- Zone sur deux lignes en écran large.
- Allée A-Z sur deux lignes en écran large.
- Échelle sur une ligne.
- Emplacement à gauche.
- Aperçu + statut + actions à droite.

Sur écran plus étroit, la mise en page redevient verticale via media queries CSS.

## Structure des fichiers

```text
index.html
package.json
package-lock.json
server.py
server.mjs
tsconfig.json
vite.config.ts
src/
  App.tsx
  main.tsx
  types.ts
  components/
    ActionButtons.tsx
    AlleeSelector.tsx
    EchelleSelector.tsx
    EmplacementKeypad.tsx
    Header.tsx
    HistoryPanel.tsx
    LabelPreview.tsx
    SectionCard.tsx
    ZoneSelector.tsx
  styles/
    app.css
  utils/
    barcode.ts
    format.ts
    history.ts
```

## Reprendre sur un autre Mac

### Option simple : copier le dossier

Depuis l'ancien Mac, copier tout le dossier :

```text
/Users/olivier/Documents/Emplacement Produit
```

Sur le nouveau Mac :

```bash
cd "Emplacement Produit"
npm install
npm run dev
```

## Utiliser la page autonome sur un PC

Copier ce fichier sur le PC :

```text
etiquette-simple.html
vendor/JsBarcode.all.min.js
```

Puis ouvrir `etiquette-simple.html` dans Chrome, Edge, Firefox ou un autre navigateur moderne.

Flux d'utilisation :

1. Renseigner zone, allée, échelle et emplacement.
2. Vérifier l'aperçu de l'étiquette.
3. Cliquer sur `Ajouter à l'impression`.
4. Répéter pour toutes les étiquettes voulues.
5. Retirer une étiquette ajoutée par erreur avec la croix `×`, si besoin.
6. Cliquer sur `Imprimer la liste`.
7. Choisir `Oui` ou `Non` directement dans l'interface quand le bouton d'impression demande si la file d'attente doit être vidée après impression.

L'impression ouvre la boîte d'impression du navigateur avec une planche de 20 emplacements maximum : 4 colonnes de `70mm` et 5 lignes de `38mm`. La grille est faite pour un A4 paysage à taille réelle : 280mm de largeur utile et 190mm de hauteur utile. Chaque étiquette a un contour gris clair de `1pt` pour faciliter le découpage.

Le CSS d'impression demande donc un A4 paysage :

```css
@page {
  size: A4 landscape;
  margin: 10mm 8.5mm;
}

.print-sheet {
  width: 280mm;
  height: 190mm;
  display: grid;
  grid-template-columns: repeat(4, 70mm);
  grid-template-rows: repeat(5, 38mm);
}

.print-label {
  width: 70mm;
  height: 38mm;
}
```

Important : pour garder les étiquettes réellement en `70mm x 38mm`, la boîte d'impression doit rester en A4 paysage avec une échelle à `100 %`. Ne pas choisir `adapter à la page`, car cela réduit les dimensions physiques.

Selon le navigateur, le pilote et l'imprimante, il peut être nécessaire de confirmer manuellement :

- format papier : `A4`
- orientation : `paysage`
- marges : utiliser les marges CSS / par défaut, sans marge supplémentaire côté pilote
- échelle : 100 %

L'app locale sera accessible via l'URL affichée par Vite, généralement :

```text
http://127.0.0.1:5173/
```

### Option propre : Git

Dans ce dossier :

```bash
git init
git add .
git commit -m "Initial webapp etiquette emplacement produit"
```

Puis pousser vers un dépôt GitHub/GitLab privé et cloner sur l'autre Mac.

Le `.gitignore` exclut `node_modules/` et `dist/`, donc il faudra relancer :

```bash
npm install
npm run build
```

## Commandes locales utiles

Installer :

```bash
npm install
```

Développement :

```bash
npm run dev
```

Build production :

```bash
npm run build
```

Prévisualisation Vite :

```bash
npm run preview
```

Serveur Node statique local, si Node est disponible :

```bash
PORT=8006 npm start
```

## Redéployer sur le Raspberry

Prérequis :

- accès SSH fonctionnel vers `olivier@192.168.1.41`
- service utilisateur déjà créé
- Python 3 disponible sur le Raspberry

Depuis le Mac :

```bash
npm run build
tar -czf /tmp/etiquette-emplacement-produit.tar.gz dist server.py server.mjs package.json
scp /tmp/etiquette-emplacement-produit.tar.gz olivier@192.168.1.41:/home/olivier/etiquette-emplacement-produit/deploy.tar.gz
ssh olivier@192.168.1.41 'cd /home/olivier/etiquette-emplacement-produit && rm -rf dist && tar -xzf deploy.tar.gz && rm deploy.tar.gz && find . -name "._*" -delete && systemctl --user restart etiquette.service && systemctl --user is-active etiquette.service'
```

Tester :

```bash
curl -I http://192.168.1.41:8006
```

## Service Raspberry

Service utilisateur :

```text
/home/olivier/.config/systemd/user/etiquette.service
```

Contenu :

```ini
[Unit]
Description=Étiquette emplacement produit webapp
After=network.target

[Service]
Type=simple
WorkingDirectory=/home/olivier/etiquette-emplacement-produit
Environment=HOST=0.0.0.0
Environment=PORT=8006
ExecStart=/usr/bin/python3 /home/olivier/etiquette-emplacement-produit/server.py
Restart=always
RestartSec=3

[Install]
WantedBy=default.target
```

Commandes de service :

```bash
ssh olivier@192.168.1.41 'systemctl --user status etiquette.service'
ssh olivier@192.168.1.41 'systemctl --user restart etiquette.service'
ssh olivier@192.168.1.41 'journalctl --user -u etiquette.service -n 100 --no-pager'
```

Pour un démarrage plus fiable au boot sans ouvrir de session :

```bash
sudo loginctl enable-linger olivier
```

Cette commande doit être lancée sur le Raspberry avec le mot de passe sudo.

## Points à continuer

- Définir un vrai circuit de traitement des demandes d'impression si plusieurs postes doivent les consulter.
- Ajouter un export CSV/JSON de l'historique si les demandes doivent être récupérées hors du navigateur.
- Tester sur l'iPad/tablette cible en mode plein écran.
- Ajuster finement le rendu étiquette si une nouvelle photo de référence révèle un écart.
- Éventuellement remplacer le service utilisateur par un service système si `sudo` est disponible.
