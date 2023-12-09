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

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../public')));

const session_secret = 'l7Hj)[=;YQ0sR<1%dhC>53q&';

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

app.use((error, req, res, next) => {
  const message = `Hubo un error desconocido: ${error.message}`;
  console.log(message);
  res.status(500).json({ status: 'error', message });
});


export default app;