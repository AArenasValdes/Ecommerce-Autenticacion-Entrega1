import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import ProductManager from "./productManager.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";

//Esto permitira utilizar rutas absolutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Crearemos el server en un objeto llamado app
const app = express();

//luego inicializamos el servidor y lo dejaremos en un objeto
const httpServer = createServer(app);

//Inicializamos Socket.IO
const io = new Server(httpServer);

const productManager = new ProductManager(
  path.join(__dirname, "..", "products.json")
);

//<----------------Middlewares------------>

//Parsers Primeros
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // agregamos el middleware para decirle que lea el contenido dentro de public

// inyecto el manager en cada request (patrón simple de dependencias)
app.use((req, _res, next) => {
  req.products = productManager;
  next();
});

//Esto hace que express pueda leer datos que vienen del body (formularios,JSON);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("io", io);

//Routers
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);

io.on("connection", async (socket) => {
  console.log("✅Cliente conectado", socket.id);

  // Enviamos la lista inicial de productos al conectar
  try {
    const products = await productManager.getAll();
    socket.emit("products:init", products);
  } catch (err) {
    console.error("Error enviando lista inicial", err.message);
  }
  socket.on("disconnect", () => {
    console.log("🛑 Cliente desconectado", socket.id);
  });
});

//<-------Handlebars------------->
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000;

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
