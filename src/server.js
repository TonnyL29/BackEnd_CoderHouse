import http from "http";
import App from "./app.js";
import { init } from "./db/mongodb.js";
import { Server } from 'socket.io';

const PORT = 8080;
const server = http.createServer(App);
const io = new Server(server);


const startServer = () => {
  server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
};

const conectarDB = async () => {
  let control = false;
  for (let x = 0; x < 10; x++) {
    const dbConect = await init();
    if (dbConect) {
      control = true;
      break;
    } else {
        console.error('Ocurrio un error al intentar conectar a la db')
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }
  return control;
};

const iniciarApp = async () => {
  const dbConectado = await conectarDB();
  if (dbConectado) {
    startServer();
  } else {
    console.log('No se logra conectar a la DB, corrobore la cadena de conexión');
  }
};


io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Manejar mensajes del cliente
  socket.on('chat message', (msg) => {
    console.log('Mensaje recibido:', msg);
    io.emit('chat message', msg); // Emitir el mensaje a todos los clientes
  });

  // Manejar desconexiones
  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});



iniciarApp();

