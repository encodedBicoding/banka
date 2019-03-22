const express = require('express'),
      config = require('./config.js/config.js'),
      app = express();
app = config(app);
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Banka is listening on PORT ${PORT}`));