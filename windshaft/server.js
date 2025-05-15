const express = require('express');
var Redis = require('redis');
var Windshaft = require('windshaft').default || require('windshaft');
var healthCheck = require('./healthCheck');
var driver = require('./driver.js');

// Crée une instance d'Express
const app = express();

var dbUser = process.env.WINDSHAFT_DB_USER || 'prooftag';
var dbHost = process.env.DRIVER_DB_HOST || 'localhost';
var dbPort = process.env.DRIVER_DB_PORT || 5432;
var dbPassword = process.env.WINDSHAFT_DB_PASSWORD || '1234';
var redisHost = process.env.DRIVER_REDIS_HOST || 'localhost';
var redisPort = process.env.DRIVER_REDIS_PORT || 6379;
var redisConfig = {
    host: redisHost,
    port: redisPort
};

// Crée une connexion au client redis (db #2) pour les recherches de clé de tuiles
console.log('Creating redis client\n');
var redisClient = Redis.createClient(redisConfig.port, redisConfig.host);
redisClient.select(2);

var config = {
    useProfiler: true,
    base_url: '/tiles/table/:tablename/id/:id',
    base_url_notable: '/tiles/table/:tablename',
    req2params: function(req, callback) {
        try {
            driver.setRequestParameters(req, callback, redisClient);
        } catch (err) {
            console.error('req2params error: ');
            console.error(err);
            callback(err, null);
        }
    },
    grainstore: {
        default_layergroup_ttl: 3600,
        datasource: {
            user: dbUser,
            password: dbPassword,
            host: dbHost,
            port: dbPort,
            geometry_field: 'geom',
            srid: 4326
        }
    },
    renderCache: {
        ttl: 60000
    },
    mapnik: {
        metatile: 4,
        bufferSize: 64
    },
    redis: redisConfig,
    enable_cors: true
};

// Maintenant que `grainstore` est défini, tu peux définir `rendererOptions`
config.rendererOptions = {
    renderer: {
        mapnik: config.mapnik
    },
    grainstore: config.grainstore,
    renderCache: config.renderCache
};

// Initialise Windshaft avec la configuration
var ws = Windshaft.factory(config);

// Définir la route de vérification de la santé
app.get('/health-check', healthCheck(config));

// Utiliser Windshaft comme middleware pour gérer les requêtes des tuiles
app.use(config.base_url, (req, res, next) => {
    // Si ws.getTileHandler n'est pas disponible, utilise directement ws
    ws.getTile(req, res, next);  // méthode à vérifier dans la doc de Windshaft pour servir les tuiles
});

// Démarrer le serveur HTTP
app.listen(5000, () => {
    console.log("Server is running on http://localhost:5000");
});
console.log("map tiles are now being served out of: http://localhost:5000" + config.base_url + '/:z/:x/:y.*');
