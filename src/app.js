import express from "express";
import handlebars from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import ProdRouter from "./Routers/product.router.js";
import CartRoute from "./Routers/cart.router.js";
import { __dirname } from "./Utilities/utilities.js";
import realtimeproduct from "./Routers/realtime.router.js";
import  ProductManager  from './Utilities/ProductMaganer.js'

const productManager = new ProductManager(path.resolve(__dirname, './Product.json'));

const PORT = 8080;

const app = express();
const server = http.createServer(app);

const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use("/api", ProdRouter, CartRoute, realtimeproduct);

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "handlebars");

app.use((error, req, res, next) => {
  const message = `Hubo un error desconocido: ${error.message}`;
  console.log(message);
  res.status(500).json({ status: "error", message });
});

// Maneja la conexión de Socket.io
io.on("connection", (socket) => {
  console.log("Usuario conectado");

  // Escucha el evento de agregar producto desde el cliente
  socket.on("addProduct", async (newProduct) => {
    const addedProduct = await productManager.addProduct(newProduct);
  
    if (addedProduct !== null) {
      io.emit("productAdded", { addedProduct });
      console.log("Producto agregado correctamente:", addedProduct);
    } else {
      console.error("Error al agregar el producto.");
    }
  });

  socket.on('deleteProduct', async ({ productId }) => {
    try {
        const deletedProduct = await productManager.deleteProduct(productId);
        if (deletedProduct !== null) {
            io.emit("productDeleted", { productId });
            console.log("Producto eliminado correctamente:", deletedProduct);
        } else {
            console.error("Error al eliminar el producto.");
        }
    } catch (error) {
        console.error('Error al manejar evento "deleteProduct":', error);
    }
});
  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
