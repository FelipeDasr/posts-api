if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

const express = require('express');
const router = require('./src/router');
const cors = require('cors');
const api = express();

const DBConnection = require('./src/database');

(async () => {
    try {
        require('./src/models/associations'); // Start associations
        await DBConnection.authenticate();    // Check database connection
        await DBConnection.sync();            // Sync the models with the BD
        console.log('DATABASE OK');
    }
    catch (e) {
        console.log('DATABASE ERROR:', e);
    }
})();

api.use(express.json());    // Body Parser
api.use(cors());            // Enable CORS

api.use(router);

// Start API

api.listen(3000, () => {
    console.clear();
    console.log('API IS RUNNING AT: http://127.0.0.1:3000');
});