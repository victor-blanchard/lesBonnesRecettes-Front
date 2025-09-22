## Les Bonnes Recettes — Frontend (Next.js)

Frontend de l’application Les Bonnes Recettes. Développé avec Next.js 12 et React 18, UI avec Ant Design, état global via Redux Toolkit + redux-persist.

### Prérequis

- Node.js 18+
- Yarn ou npm

### Installation

```bash
cd Frontend/lesbonnesrecettes
yarn
# ou
npm install
```

### Configuration (.env.local)

Créez un fichier `.env.local` à la racine de `lesbonnesrecettes/`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Lancement

```bash
yarn dev
# ou
npm run dev
```

L’interface est disponible sur `http://localhost:3001` (cf. `package.json`).

### Points clés

- Les appels API utilisent `process.env.NEXT_PUBLIC_API_URL` et `credentials: "include"` pour envoyer les cookies JWT.
- L’upload d’images (création/édition de recette) utilise `FormData`. Les tableaux `steps` et `ingredients` sont envoyés en `JSON.stringify`.
- Protégez certaines pages via le hook `hooks/useAuthGuard.js` si nécessaire.

### Scripts

- `dev`: Next en mode développement (port 3001)
- `build`: build de production
- `start`: serveur Next en production

### Pages principales

- `pages/index.js` — accueil / recherche de recettes
- `pages/connexion.js` — inscription/connexion
- `pages/likes.js` — recettes aimées (auth requise)
- `pages/profil.js` — profil + MAJ/suppression compte (auth)
- `pages/recipe/[id].js` — détail recette
- `pages/recipe/create.js` — création recette (auth)
- `pages/recipe/edit/[id].js` — édition recette (auth)

### Dépannage

- Si les appels échouent avec 401/403: vérifier que vous êtes connecté et que le backend autorise l’origine (`CORS_ORIGIN`) et les `credentials`.
- Si les images ne s’uploadent pas: vérifier les champs `FormData` et la configuration Cloudinary côté backend.
- Si rien ne s’affiche: confirmer `NEXT_PUBLIC_API_URL` et que l’API répond (http://localhost:3000).
