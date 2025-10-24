import { Router } from 'express';
import { apiCreateCart } from '../controllers/carts.controller.js';
import {
getCart,
apiDeleteProductFromCart,
apiReplaceCartProducts,
apiUpdateCartItemQuantity,
apiEmptyCart,
apiAddProductToCart
} from '../controllers/carts.controller.js';

const router = Router();

// POST api/carts → crea un carrito nuevo
router.post("/", apiCreateCart);

// GET con populate
router.get('/:cid', getCart);


// DELETE api/carts/:cid/products/:pid → elimina del carrito
router.delete('/:cid/products/:pid', apiDeleteProductFromCart);


// PUT api/carts/:cid → reemplaza todos los productos
router.put('/:cid', apiReplaceCartProducts);


// PUT api/carts/:cid/products/:pid → actualiza SOLO cantidad
router.put('/:cid/products/:pid', apiUpdateCartItemQuantity);


// DELETE api/carts/:cid → vacía carrito
router.delete('/:cid', apiEmptyCart);


//  POST para agregar producto rápido desde vistas
router.post('/:cid/products/:pid', apiAddProductToCart);


export default router;