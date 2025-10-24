import {
  getCartById,
  deleteProductFromCart,
  replaceCartProducts,
  updateCartItemQuantity,
  emptyCart,
  addProductToCart,
  ensureCart,
} from "../services/carts.service.js";

export async function getCart(req, res, next) {
  try {
    const { cid } = req.params;
    const cart = await getCartById(cid);
    return res.json({ status: "success", payload: cart });
  } catch (err) {
    if (err?.message === "INVALID_CID")
      return res
        .status(400)
        .json({ status: "error", error: "invalid cart id" });
    if (err?.message === "CART_NOT_FOUND")
      return res.status(404).json({ status: "error", error: "cart not found" });
    return next(err);
  }
}

export async function apiCreateCart(req, res, next) {
  try {
    const cart = await ensureCart();
    return res.status(201).json({ status: "success", payload: cart });
  } catch (err) {
    return next(err);
  }
}

export async function apiDeleteProductFromCart(req, res, next) {
  try {
    const { cid, pid } = req.params;
    const cart = await deleteProductFromCart(cid, pid);
    return res.json({ status: "success", payload: cart });
  } catch (err) {
    const map = {
      INVALID_CID: [400, "invalid cart id"],
      INVALID_PID: [400, "invalid product id"],
      CART_NOT_FOUND: [404, "cart not found"],
    };
    const m = map[err?.message];
    if (m) return res.status(m[0]).json({ status: "error", error: m[1] });
    return next(err);
  }
}

export async function apiReplaceCartProducts(req, res, next) {
  try {
    const { cid } = req.params;
    const items = req.body?.products ?? [];
    const cart = await replaceCartProducts(cid, items);
    return res.json({ status: "success", payload: cart });
  } catch (err) {
    const map = {
      INVALID_CID: [400, "invalid cart id"],
      INVALID_ITEMS: [
        400,
        "body must be { products: [{ product, quantity }] }",
      ],
      INVALID_ITEM_PRODUCT: [400, "invalid product id in items"],
      INVALID_ITEM_QTY: [400, "quantity must be integer > 0"],
      PRODUCT_NOT_FOUND: [404, "a product in items does not exist"],
      CART_NOT_FOUND: [404, "cart not found"],
    };
    const m = map[err?.message];
    if (m) return res.status(m[0]).json({ status: "error", error: m[1] });
    return next(err);
  }
}

export async function apiUpdateCartItemQuantity(req, res, next) {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await updateCartItemQuantity(cid, pid, Number(quantity));
    return res.json({ status: "success", payload: cart });
  } catch (err) {
    const map = {
      INVALID_CID: [400, "invalid cart id"],
      INVALID_PID: [400, "invalid product id"],
      INVALID_QTY: [400, "quantity must be integer > 0"],
      CART_NOT_FOUND: [404, "cart not found"],
      LINE_NOT_FOUND: [404, "product not in cart"],
    };
    const m = map[err?.message];
    if (m) return res.status(m[0]).json({ status: "error", error: m[1] });
    return next(err);
  }
}

export async function apiEmptyCart(req, res, next) {
  try {
    const { cid } = req.params;
    const cart = await emptyCart(cid);
    return res.json({ status: "success", payload: cart });
  } catch (err) {
    const map = {
      INVALID_CID: [400, "invalid cart id"],
      CART_NOT_FOUND: [404, "cart not found"],
    };
    const m = map[err?.message];
    if (m) return res.status(m[0]).json({ status: "error", error: m[1] });
    return next(err);
  }
}
// agregar producto rápidamente desde la vista
export async function apiAddProductToCart(req, res, next) {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body || {};
    const cart = await addProductToCart(cid, pid, Number(quantity));
    return res.json({ status: "success", payload: cart });
  } catch (err) {
    const map = {
      INVALID_PID: [400, "invalid product id"],
      PRODUCT_NOT_FOUND: [404, "product not found"],
    };
    const m = map[err?.message];
    if (m) return res.status(m[0]).json({ status: "error", error: m[1] });
    return next(err);
  }
}
