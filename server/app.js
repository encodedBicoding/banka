let express = require('express'),
    config = require('./config/config.js'),
    app = express();
app = config(app);

const PORT = process.env.PORT || 3020;

app.listen(PORT, console.log(`Banka is on port ${PORT}`));
module.exports = app;