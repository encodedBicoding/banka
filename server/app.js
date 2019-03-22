const express = require('express'),
    config = require('./config.js/config.js'),
    app = express();
app = config(app);
const PORT = process.env.PORT || 3000;