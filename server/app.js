import express from 'express';
import dotEnv from 'dotenv';
import debug from 'debug';
import config from './config/config';

dotEnv.config();
const logger = debug('banKa');

const app = express();

config(app);

const PORT = process.env.PORT || 2029;
app.listen(PORT, console.log(`app running on PORT ${PORT}`));

export default app;
