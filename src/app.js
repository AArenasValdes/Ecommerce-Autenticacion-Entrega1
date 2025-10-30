// Cargar variables de entorno
import "dotenv/config";

import express from "express";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { engine } from "express-handlebars";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";

// Passport + Routers
import passport from "./config/passport.js";
import { sessionsRouter } from "./routes/sessions.router.js";
import { usersRouter } from "./routes/users.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

// Middlewares propios
import errorHandler from "./middlewares/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ?? 3000;

/* ---------- Middlewares globales ---------- */
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "../public")));

// Passport
app.use(passport.initialize());

/* ---------- Handlebars ---------- */
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

/* ---------- Routers ---------- */
// API
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Views
app.use("/", viewsRouter);

/* ---------- Error handler ---------- */
app.use(errorHandler);

/* ---------- Conexión a Mongo y arranque ---------- */
await mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 5000,
});
console.log("✅ Conectado a MongoDB");

app.listen(PORT, () => {
  console.log(`API lista en http://localhost:${PORT}`);
});
