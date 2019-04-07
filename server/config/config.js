import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from '../routes/routes';

const config = (app) => {
  app.use(cors());
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(session({
    secret: 'password', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false,
  }));
  routes(app);
};
export default config;
