import { Router } from 'express';
import {v4 as uuiav4} from 'uuid'
import ProductManager from '../Utilities/ProductMaganer.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const productManager = new ProductManager(path.join(__dirname, '../Utilities/product.json'));

router.get('/products', (req, res) => {
  const limit = req.query.limit;
  const products = limit
    ? productManager.getProducts().slice(0, limit)
    : productManager.getProducts();
  res.json({ products });
});

router.post('/product', (req, res) => {
  const{ body } = req;
  const newProduct = {
    id: uuiav4(),
    ...body,
}
  productManager.addProduct(newProduct)
  res.status(201).json(newProduct)
  console.log('Producto agregado correctamente')
});


router.get('/product/:pid', (req, res) => {
  const productId = req.params.pid;
  const product = productManager.getProductById(productId);
  res.status(200).json({ product });
});

router.put('/product/:pid', (req, res) => {
  const productId = (req.params.pid);
  console.log(productId)
  const { body } = req;

  const updatedProduct = {id: productId, ...body};
  const updatedProductResult = productManager.updateProduct(productId, updatedProduct);

  if (updatedProductResult) {
    res.status(201).json({ product: updatedProduct });
    console.log(`Producto editado correctamente ${JSON.stringify(updatedProduct)}`);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
    console.error("Producto no encontrado.");
  }
});

router.delete('/product/:pid', (req, res) => {
  const productId = req.params.pid;
  console.log("ProductId recibido:", productId); // Agrega esta línea para depuración
  const deleteProductResult = productManager.deleteProduct(productId);

  if (deleteProductResult) {
    res.status(201).json({ product: deleteProductResult });
    console.log(`Producto eliminado correctamente ${JSON.stringify(deleteProductResult)}`);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
    console.error("Producto no encontrado.");
  }
});

export default router;
