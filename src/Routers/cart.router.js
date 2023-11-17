import { Router } from "express";
import cartManager from "../dao/cartManeger.js";

const router = Router();


router.get('/carts/:cartId', async (req, res) => {
    const cartId = req.params.cartId;
  
    try {
      const cart = await cartManager.getById(cartId);
      res.status(200).json(cart);
    } catch (error) {
      console.error('Error al obtener el carrito por ID:', error.message);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });


router.get("/carts", async (req, res) => {
    try {
        const { query = {} } = req;
        const cart = await cartManager.get(query);
        res.status(200).json({ cart });
    } catch (error) {
        console.error('Error al obtener los carritos:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener los carritos' });
    }
});

router.put('/carts/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        let updatedCart;
        if(!quantity){
            updatedCart = await cartManager.updateCart(cid, pid);  
        }else{
            updatedCart = await cartManager.updateCartQuantity(cid, pid, quantity);
        }
        res.status(200).json({ message: 'Producto actualizado en el carrito correctamente', updatedCart });
    } catch (error) {
        console.error('Error al actualizar el producto en el carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar el producto en el carrito' });
    }
});

router.put('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const { body } = req;

        // Crear un objeto con los datos del producto
        const productData = {
            prod_id: body.prod_id,
            quantity: body.quantity || 1,
        };

        // Actualizar el carrito
        await cartManager.updateCart(cartId, productData);

        res.status(204).end();
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/carts/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const updatedCart = await cartManager.removeProduct(cid, pid);

        res.status(200).json({ message: 'Producto eliminado del carrito correctamente', updatedCart });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar el producto del carrito' });
    }
});

router.delete('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;

        await cartManager.removeAllProducts(cartId);

        res.status(204).end();
    } catch (error) {
        console.error('Error al eliminar todos los productos del carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar todos los productos del carrito' });
    }
});

router.post("/addcart", async (req, res) => {
    try {
        const { body } = req;

        const productData = {
            prod_id: body.prod_id, 
            quantity: body.quantity || 1,
        };

        const createdCart = await cartManager.create(productData);

        res.status(201).json({
            cartCreate: true,
            cart_id: createdCart._id  // Aquí obtenemos el _id del carrito creado
        });
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor, al crear el carrito' });
    }
});

export default router;
