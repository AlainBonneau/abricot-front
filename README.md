# Abricot – Application de Gestion de Projets avec Génération Automatique de Tâches par IA (Fini à 75%)

Abricot est une application fullstack de gestion de projets collaboratifs permettant de créer, organiser et suivre des tâches.

Le projet intègre une fonctionnalité avancée de **génération automatique de tâches via IA (Mistral)**, transformant une description libre (prompt) en tâches structurées et directement exploitables dans le projet.

---

## 📌 Contexte du Projet

Dans un contexte professionnel, la création et la structuration des tâches peuvent être longues et répétitives.

L’objectif d’Abricot est de :

- Centraliser la gestion des projets
- Faciliter la collaboration entre contributeurs
- Automatiser la génération de tâches grâce à l’intelligence artificielle
- Garder le contrôle humain avant intégration en base de données

L’IA agit comme **assistant décisionnel**, et non comme acteur autonome.

---

## 🛠️ Stack Technique

### Frontend

- Next.js (App Router)
- TypeScript
- SCSS
- React Hooks
- Gestion d’état locale
- Accessibilité (ARIA, gestion focus, clavier)

### Backend (via Next.js Route Handlers)

- API Routes Next.js
- Validation Zod
- Prisma ORM
- PostgreSQL

### Intelligence Artificielle

- Mistral (LLM)
- Prompt engineering
- Réponse JSON stricte
- Validation avant insertion en base

---

## ✨ Fonctionnalités Principales

### 🔐 Authentification

- Gestion des utilisateurs
- Protection des routes
- Accès restreint aux projets

### 📂 Gestion des Projets

- Création et modification de projets
- Gestion des membres (contributeurs)

### 📝 Gestion des Tâches

- Création de tâches avec :
  - Titre
  - Description
  - Date d’échéance
  - Statut (À faire, En cours, Terminée)
- Assignation à un ou plusieurs utilisateurs
- Ajout de commentaires collaboratifs

---

## 🤖 Génération Automatique de Tâches par IA

### 1️⃣ Saisie du Prompt

L’utilisateur décrit librement son besoin dans un champ dédié.

### 2️⃣ Analyse par l’IA

Une route serveur Next.js appelle le modèle Mistral :

- Clé API sécurisée (jamais exposée côté client)
- Température contrôlée
- Format JSON strict imposé
- Pas de texte hors JSON

### 3️⃣ Validation des Données

Les données générées sont validées avec **Zod** afin de :

- Garantir le format attendu
- Éviter les champs invalides
- Assurer la cohérence métier

### 4️⃣ Prévisualisation et Modification

Avant insertion :

- Suppression possible de tâches
- Modification du titre et description
- Ajustement de la date d’échéance
- Assignation à des contributeurs

### 5️⃣ Association au Projet

Les tâches validées sont ensuite :

- Associées automatiquement au projet en cours
- Persistées en base via Prisma

---

## 🔒 Sécurité & Bonnes Pratiques

- Clé API IA stockée dans `.env.local`
- Appels IA effectués côté serveur uniquement
- Gestion des erreurs (quota, indisponibilité API, réponse invalide)
- Validation systématique des données IA
- Gestion des états de chargement
- Accessibilité (role="dialog", aria-label, gestion ESC)
