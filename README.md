# MFLIX - Plateforme Cinématographique

## 📋 Présentation

MFLIX est une application web moderne qui permet d'explorer une vaste collection de films et d'informations cinématographiques. Cette plateforme offre une interface utilisateur intuitive et une API RESTful complète pour accéder aux données de films, commentaires et théâtres.

## ✨ Fonctionnalités principales

- **Catalogue de films** - Exploration de films avec filtres et recherche avancée
- **API documentée** - Documentation Swagger pour tester les endpoints
- **Système d'authentification** - Sécurisation des routes et des API

## 🛠️ Technologies utilisées

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: API Routes de Next.js, MongoDB
- **Authentification**: JWT (JSON Web Tokens)
- **Documentation**: Swagger UI
- **Déploiement**: Vercel

## 🚀 Installation et démarrage

### Prérequis

- Node.js 18.x ou supérieur
- MongoDB (accès à une base "sample_mflix")
- Variables d'environnement configurées (.env)

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/LiamImamovic/atl-cloud.git
cd atl-cloud

# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
cp .env.example .env
# Remplir les valeurs dans .env
```

### Démarrage en développement

```bash
pnpm dev
```

L'application sera disponible sur http://localhost:3000

### Compilation pour la production

```bash
pnpm start
pnpm build
```

## 🔑 Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes:

MONGODB_URI
JWT_SECRET
REDIS_URL

## 🌐 Structure de l'API

L'API MFLIX est organisée selon les endpoints suivants:

### Films

- `GET /api/movies` - Liste tous les films
- `GET /api/movies/:id` - Détails d'un film spécifique
- `POST /api/movies` - Ajoute un nouveau film
- `PUT /api/movies/:id` - Modifie un film existant
- `DELETE /api/movies/:id` - Supprime un film

### Commentaires

- `GET /api/movies/comments` - Liste tous les commentaires
- `GET /api/movies/comments/:id` - Détails d'un commentaire
- `POST /api/movies/comments` - Ajoute un nouveau commentaire
- `PUT /api/movies/comments/:id` - Modifie un commentaire
- `DELETE /api/movies/comments/:id` - Supprime un commentaire

### Théâtres

- `GET /api/theaters` - Liste tous les théâtres
- `GET /api/theaters/:id` - Détails d'un théâtre

### Authentification

- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/verify` - Vérification du token

## 📚 Documentation

Une documentation Swagger interactive est disponible à l'URL `/api-doc` de l'application déployée.

Pour explorer les endpoints disponibles:

1. Accédez à la page d'accueil
2. Cliquez sur "Documentation API"
3. Utilisez l'interface Swagger pour tester les différents endpoints

## 🔐 Sécurité

L'application implémente plusieurs niveaux de sécurité:

- **Authentification par JWT** pour sécuriser les routes protégées
- **Middleware d'authentification** pour les routes API
- **Limitation de taux (Rate limiting)** pour prévenir les attaques par force brute
- **Validation des entrées** pour prévenir les injections

## 👥 Auteurs

- **Liam Imamovic** - [GitHub](https://github.com/LiamImamovic)
