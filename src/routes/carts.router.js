import { Router } from "express";
import CartsManager from "../classes/cartsManager.js";

const router = Router();

const cartsFile = "./src/data/carrito.json";
const productsFile = "./src/data/productos.json";

const cartsManager = new CartsManager(cartsFile, productsFile);

(async () => {
  try {
    await cartsManager.initialize();
  } catch (error) {
    console.error(error);
  }
})();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartsManager.createCart();
    res.json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await cartsManager.getCart(cartId);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;

  try {
    const cart = await cartsManager.addProductToCart(
      cartId,
      productId,
      quantity
    );
    res.json(cart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
