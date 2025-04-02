const Encore = require('@symfony/webpack-encore');
const { DefinePlugin } = require('webpack');

// Charger les variables d'environnement

Encore
    // Répertoire de sortie
    .setOutputPath('public/build/')
    .setPublicPath('/build')

    // Fichier principal d'entrée
    .addEntry('app', './assets/js/app.js')

    // Active Vue.js
    .enableVueLoader()

    // Active Sass si tu utilises des fichiers SCSS
    .enableSassLoader()

    // Active le "runtime chunk" (recommandé)
    .enableSingleRuntimeChunk()

    // Ajoute les notifications (facultatif)
    .enableBuildNotifications()

    // Active le découpage du code en plusieurs fichiers
    .splitEntryChunks()

    // Nettoie les anciens fichiers avant de builder
    .cleanupOutputBeforeBuild()

    // Active les maps en dev pour le débogage
    .enableSourceMaps(!Encore.isProduction())

    // Active la version pour le cache en production
    .enableVersioning(Encore.isProduction())

    // Injection des variables d'environnement dans le frontend
    .addPlugin(new DefinePlugin({
        'process.env': JSON.stringify(process.env)
    }))
;

module.exports = Encore.getWebpackConfig();
