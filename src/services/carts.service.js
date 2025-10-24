import mongoose from 'mongoose';
import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';
// Crear un nuevo carrito vacío
export async function getCartById(cid) {
if (!mongoose.isValidObjectId(cid)) throw new Error('INVALID_CID');
const cart = await Cart.findById(cid).populate('products.product').lean();
if (!cart) throw new Error('CART_NOT_FOUND');
return cart;
}
// Crear un nuevo carrito vacío
export async function createCart() {
const cart = new Cart({ products: [] });
await cart.save();
return cart;
}
// Eliminar un producto del carrito
export async function deleteProductFromCart(cid, pid) {
if (!mongoose.isValidObjectId(cid)) throw new Error('INVALID_CID');
if (!mongoose.isValidObjectId(pid)) throw new Error('INVALID_PID');
const cart = await Cart.findById(cid);
if (!cart) throw new Error('CART_NOT_FOUND');
cart.products = cart.products.filter(p => p.product.toString() !== pid);
await cart.save();
return cart;
}

// Agregar un producto al carrito o incrementar su cantidad
export async function replaceCartProducts(cid, items) {
if (!mongoose.isValidObjectId(cid)) throw new Error('INVALID_CID');
if (!Array.isArray(items)) throw new Error('INVALID_ITEMS');


// Validar forma y existencia de productos
for (const it of items) {
const { product, quantity } = it || {};
if (!mongoose.isValidObjectId(product)) throw new Error('INVALID_ITEM_PRODUCT');
if (!Number.isInteger(quantity) || quantity <= 0) throw new Error('INVALID_ITEM_QTY');
const exists = await Product.exists({ _id: product });
if (!exists) throw new Error('PRODUCT_NOT_FOUND');
}


const cart = await Cart.findById(cid);
if (!cart) throw new Error('CART_NOT_FOUND');
cart.products = items.map(it => ({ product: it.product, quantity: it.quantity }));
await cart.save();
return cart;
}


export async function updateCartItemQuantity(cid, pid, quantity) {
if (!mongoose.isValidObjectId(cid)) throw new Error('INVALID_CID');
if (!mongoose.isValidObjectId(pid)) throw new Error('INVALID_PID');
if (!Number.isInteger(quantity) || quantity <= 0) throw new Error('INVALID_QTY');


const cart = await Cart.findById(cid);
if (!cart) throw new Error('CART_NOT_FOUND');
const line = cart.products.find(p => p.product.toString() === pid);
if (!line) throw new Error('LINE_NOT_FOUND');
line.quantity = quantity;
await cart.save();
return cart;
}

// Vaciar el carrito
export async function emptyCart(cid) {
if (!mongoose.isValidObjectId(cid)) throw new Error('INVALID_CID');
const cart = await Cart.findById(cid);
if (!cart) throw new Error('CART_NOT_FOUND');
cart.products = [];
await cart.save();
return cart;
}
// Asegura que el carrito exista, si no, crea uno nuevo
export async function ensureCart(cid) {
if (cid) {
if (!mongoose.isValidObjectId(cid)) throw new Error('INVALID_CID');
const found = await Cart.findById(cid);
if (found) return found;
}
const created = await Cart.create({ products: [] });
return created;
}

// Agregar un producto al carrito o incrementar su cantidad
export async function addProductToCart(cid, pid, qty = 1) {
if (!mongoose.isValidObjectId(pid)) throw new Error('INVALID_PID');
const product = await Product.findById(pid);
if (!product) throw new Error('PRODUCT_NOT_FOUND');


const cart = await ensureCart(cid);
const line = cart.products.find(p => p.product.toString() === pid);
if (line) line.quantity += qty;
else cart.products.push({ product: pid, quantity: qty });
await cart.save();
return cart;
}