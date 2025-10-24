import { Router } from "express";
import { searchProducts } from "../services/products.service.js";
import { buildPageLink } from "../utils/buildLinks.js";
import { getCartById, ensureCart } from "../services/carts.service.js"; // <-- IMPORTANTE

const router = Router();

// Redirect / → /products (opcional)
router.get("/", (req, res) => res.redirect("/products"));

// /products → crea carrito si falta cid y renderiza lista
router.get("/products", async (req, res, next) => {
  try {
    const { cid } = req.query;
    if (!cid) {
      const cart = await ensureCart(); // crea carrito vacío
      const params = new URLSearchParams({
        ...req.query,
        cid: String(cart._id),
      });
      return res.redirect(`/products?${params.toString()}`);
    }

    const { limit = 10, page = 1, sort, query } = req.query;
    const result = await searchProducts({ limit, page, sort, query });

    const path = "/products";
    const originalQuery = { ...req.query };
    const prevLink = result.hasPrevPage
      ? buildPageLink(path, originalQuery, result.prevPage)
      : null;
    const nextLink = result.hasNextPage
      ? buildPageLink(path, originalQuery, result.nextPage)
      : null;

    return res.render("products", {
      products: result.docs,
      page: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink,
      cartId: cid, // <- NECESARIO para el botón "Agregar al carrito"
    });
  } catch (err) {
    return next(err); // deja que el errorHandler responda
  }
});

// /carts/:cid → vista con populate
router.get("/carts/:cid", async (req, res, next) => {
  try {
    const cart = await getCartById(req.params.cid);
    const items = (cart.products || []).map((l) => ({
      _id: l.product?._id,
      title: l.product?.title,
      price: l.product?.price,
      quantity: l.quantity,
      subtotal: (l.product?.price ?? 0) * l.quantity,
    }));

    const total = items.reduce((acc, it) => acc + it.subtotal, 0);

    return res.render("carts", { cartId: cart._id, items, total });
  } catch (err) {
    const code =
      err?.message === "INVALID_CID"
        ? 400
        : err?.message === "CART_NOT_FOUND"
        ? 404
        : 500;
    return res
      .status(code)
      .render("carts", { error: "No se pudo cargar el carrito" });
  }
});

export default router;
