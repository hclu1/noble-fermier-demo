// Path: src/config/appConfig.ts

// Importe la version directement depuis package.json.
// C'est la source unique de vérité pour la version de l'application.
// Pour mettre à jour la version : modifier "version" dans package.json uniquement.
import pkg from '../../package.json'

export const APP_VERSION: string = pkg.version
