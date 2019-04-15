import express from 'express';
import dotenv from 'dotenv';
import debug from 'debug';
import config from './config/config';

dotenv.config();
const logger = debug('banka');

const app = express();

config(app);

const PORT = process.env.PORT || 2046;
app.listen(PORT, logger(`app running on PORT ${PORT}`));

export default app;
