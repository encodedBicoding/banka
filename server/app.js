import express from 'express';

import config from './config/config';

const app = express();

config(app);

const PORT = process.env.PORT || 2042;
app.listen(PORT, console.log(`app running on PORT ${PORT}`));

export default app;
