import "dotenv/config.js";
import express from "express";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { engine } from "express-handlebars";

import "./db/mongo.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import errorHandler from "./middlewares/errorHandler.js";
import methodOverride from "method-override";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ?? 3000;

// Middlewares base
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(methodOverride("_method"));

// Handlebars
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    helpers: {
      eq: (a, b) => String(a) === String(b),
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Error handler (al final)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});
