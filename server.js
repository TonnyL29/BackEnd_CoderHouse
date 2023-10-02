import express from "express";
import ProductManager from "./ProductMaganer.js"; // Asegúrate de poner la ruta correcta

const app = express();
const port = 3000;

const productManager = new ProductManager("./Product.json"); // Asegúrate de poner la ruta correcta

app.get('/', (req, res) =>{
    res.send('Inicio')
});

// Endpoint para obtener todos los productos con posible límite
app.get("/products", (req, res) => {
  const limit = req.query.limit;
  const products = limit ? productManager.getProducts().slice(0, limit) : productManager.getProducts();
  res.json({ products });
});

// Endpoint para obtener un producto por ID
app.get("/products/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductById(productId);
  res.json({ product });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});