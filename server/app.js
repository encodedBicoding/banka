let express = require('express'),
    config = require('./config/config.js'),
    app = express();

app = config(app);

const PORT = process.env.PORT || 2742;
app.listen(PORT, console.log(`app running on PORT ${PORT}`));

module.exports = app;