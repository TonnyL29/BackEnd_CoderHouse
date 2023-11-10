import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import CartRoute from "./Routers/cart.router.js";
import { __dirname } from "./Utilities/utilities.js";
import ProductRouter from './Routers/product.router.js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/api", CartRoute, ProductRouter);

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "handlebars");


app.use((error, req, res, next) => {
  const message = `Hubo un error desconocido: ${error.message}`;
  console.log(message);
  res.status(500).json({ status: "error", message });
});


export default app;