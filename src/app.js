import express from 'express';
import ProdRouter from './Routers/product.router.js'
import CartRoute from './Routers/cart.router.js'

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api', ProdRouter, CartRoute);

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})