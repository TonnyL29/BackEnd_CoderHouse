import { Router } from "express";
import CartManager from "../Utilities/cartManager.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const cartManager = new CartManager(
  path.join(__dirname, "../Utilities/cart.json")
);

router.get("/:cid", (req, res) => {
    const cartId = req.params.cid;
    const cart = cartManager.loadCart(cartId); // Corregir aquí
    res.status(200).json({ cart });
  });
  
  router.post("/:cid/product/:pid", (req, res) => {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const { body } = req;
    
      // Verificar si se proporciona un cuerpo y no es igual a 1
      const quantity = body && body.quantity !== undefined ? body.quantity : 1;
    
      const updatedCart = cartManager.addProductToCart(cartId, productId, quantity); // Corregir aquí
    
      res.status(201).json({
        'carrito numero': cartId,
        'producto id': productId,
        'quantity': quantity,
        'products': updatedCart.products,
      });
  })


  export default router;