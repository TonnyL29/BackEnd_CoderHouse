import express from "express";
import handlebars from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import ProdRouter from "./Routers/product.router.js";
import CartRoute from "./Routers/cart.router.js";
import { __dirname } from "./Utilities/utilities.js";
import realtimeproduct from "./Routers/realtime.router.js";

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

  // Maneja el evento editarProducto
  socket.on("editarProducto", ({ productId }) => {
    // Aquí debes implementar la lógica para editar el producto con el ID proporcionado
    console.log(`Editar producto con ID: ${productId}`);
    
    // Emite un evento a todos los clientes para que actualicen la información
    io.emit("productoEditado", { productId });
  });

  // ... (otros eventos y lógica de Socket.io)

  // Desconexión del usuario
  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
