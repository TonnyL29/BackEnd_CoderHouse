import { Router } from "express";
import prodManager from "../dao/productManager.js";

const router = Router();


router.get("/products", async (req, res) => {
    try {
        const { query = {} } = req;
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;

        const result = await prodManager.get(query, page, limit);

        const response = {
            status: "success",
            payload: result.products,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}` : null,
            nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}` : null
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor al obtener los productos' });
    }
});

// router.get('/storage-product', (req, res) =>{
//     res.render('products');
// })


router.get("/product/:pid", async (req, res) => {
    try {
        const prodId = req.params.pid;
        const product = await prodManager.getById(prodId);
        res.status(200).json({ product });
    } catch (error) {
        console.error('Error al obtener el producto:', error.message);
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

  
router.post("/product/:pid", async (req, res) => {
try {
    const prodId = req.params.pid;
    const { body } = req;

    const productData = {
        prod_id: body.prod_id, 
        quantity: body.quantity || 1,
      };

    await prodManager.updateCart(prodId, productData);

    res.status(204).end();
} catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
}
});
  

router.post("/addproduct", async (req, res) => {
    try {
        const { body } = req;
        let thumb;
        if(body.thumbnail){
            thumb = body.thumbnail
        }else{
            thumb = ''
        }
        const productData = {
            title: body.title, 
            description: body.description,
            price: body.price,
            stock: body.stock,
            category: body.category,
            thumbnail: thumb
        };

        const createdproduct = await prodManager.create(productData);

        res.status(201).json({
            prodCreate: true,
            prod_id: createdproduct._id  // Aquí obtenemos el _id del producto creado
        });
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor, al crear el carrito' });
    }
})


router.get("/productdelete/:pid", async (req, res) => {
    try {
        const prodId = req.params.pid;
        const deletedProduct = await prodManager.deleteById(prodId);
        
        if (!deletedProduct) {
            res.status(404).json({ error: `Producto con ID ${prodId} no encontrado` });
        } else {
            res.status(200).json({ message: `Se eliminó el producto con ID ${prodId} correctamente` });

        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
        res.status(500).json({ error: 'Error al eliminar el producto, el producto no existe'});
    }
});



  export default router;