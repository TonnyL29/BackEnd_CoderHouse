import express from 'express';
import passport from 'passport';
import handlebars from 'express-handlebars';
import path from 'path';
import CartRoute from './Routers/cart.router.js';
import { __dirname } from './Utilities/utilities.js';
import ProductRouter from './Routers/product.router.js'
import sessionRouter from './Routers/session.router.js'
import expressSession from 'express-session'
import { init as initLocal} from './config/passport.config.js'
import { URI } from './db/mongodb.js'
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
dotenv.config()

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../public')));

const session_secret = process.env.SECRETSESSION;

app.use(expressSession({
  secret: session_secret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: URI,
    mongoOptions: {},
    ttl: 120,
  }), 
}));

app.use('/api', CartRoute, ProductRouter, sessionRouter);

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'handlebars');

initLocal();

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.render('error404')
});

app.use((error, req, res, next) => {
    const message = `Hubo un error desconocido: ${error.message}`;
    console.log(message);
    res.render('error500')
  });

export default app;