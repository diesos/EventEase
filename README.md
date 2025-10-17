# EventEase

Application mobile React Native permettant à l'association EventEase de gérer ses événements (conférences, ateliers, sorties). Les membres et bénévoles peuvent consulter les événements, en créer de nouveaux et gérer leur participation.

## 🚀 Fonctionnalités

### ✅ Fonctionnalités obligatoires implémentées

- **Authentification** : Connexion et inscription simplifiées
- **Gestion des événements** : Affichage de la liste complète des événements
- **CRUD événements** : Ajout, modification et suppression d'événements
- **Participation** : Marquer un événement comme "participé"
- **Persistance locale** : Sauvegarde des données avec AsyncStorage

### 🎯 Fonctionnalités bonus implémentées

- **Calendrier** : Affichage des événements sur un calendrier (react-native-calendars)
- **API Météo** : Intégration de l'API OpenWeather pour afficher la météo du jour de l'événement
- **Interface améliorée** : Thème cohérent et navigation fluide

## 🛠 Technologies utilisées

- **Framework** : React Native avec Expo
- **Navigation** : React Navigation (Tab Navigation)
- **Persistance** : AsyncStorage
- **Calendrier** : react-native-calendars
- **API externe** : OpenWeather API
- **Langage** : TypeScript

## 📱 Structure du projet

```
EventEase/
├── app/                    # Écrans principaux avec Expo Router
│   └── (tabs)/            # Navigation par onglets
├── features/              # Fonctionnalités par domaine
│   ├── auth/             # Authentification
│   ├── events/           # Gestion des événements
│   └── weather/          # Service météo
├── screens/              # Écrans de l'application
├── components/           # Composants réutilisables
├── types/               # Définitions TypeScript
└── constants/           # Constantes et thèmes
```

## 🏗 Architecture technique

**Architecture modulaire** : Organisation par fonctionnalités (features) avec séparation des responsabilités :

- **Services** : Logique métier et appels API
- **Components** : Interface utilisateur réutilisable
- **Hooks** : Logique d'état personnalisée
- **Types** : Typage TypeScript strict

**Choix techniques** :

- Expo pour un développement rapide et cross-platform
- AsyncStorage pour la persistance locale simple
- Architecture en couches pour la maintenabilité
- API REST pour l'intégration météo

## 🚀 Installation et lancement

1. **Installation des dépendances**

   ```bash
   npm install
   ```

2. **Démarrage de l'application**

   ```bash
   npx expo start
   ```

3. **Options de lancement**
   - Expo Go (smartphone)
   - Émulateur Android
   - Simulateur iOS
   - Navigateur web

## 📋 Utilisation

1. **Connexion/Inscription** : Créez un compte ou connectez-vous
2. **Consulter les événements** : Parcourez la liste ou le calendrier
3. **Créer un événement** : Ajoutez titre, description, date et lieu
4. **Météo** : Consultez les prévisions météo pour chaque événement
5. **Participation** : Marquez votre participation aux événements

## 🎯 Développement (4 jours)

- **Jour 1** : ✅ Mise en place projet, écrans de base, navigation
- **Jour 2** : ✅ Gestion CRUD des événements
- **Jour 3** : ✅ Calendrier, API météo, amélioration design
- **Jour 4** : ✅ Finalisation et tests

## 📦 Dépendances principales

```json
{
  "@react-native-async-storage/async-storage": "2.2.0",
  "@react-navigation/bottom-tabs": "^7.4.0",
  "react-native-calendars": "^1.1313.0",
  "expo": "~54.0.13",
  "react-native": "0.81.4"
}
```

## 🏆 Conformité au cahier des charges

- ✅ Application React Native avec Expo
- ✅ React Navigation implémenté
- ✅ Persistance locale fonctionnelle
- ✅ Code structuré et organisé
- ✅ Toutes les fonctionnalités obligatoires
- ✅ Fonctionnalités bonus
