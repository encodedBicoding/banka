let express = require('express'),
    config = require('./server/config/config.js'),
    app = express();
app = config(app);
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Banka listening on PORT ${PORT}`))
module.exports = app;