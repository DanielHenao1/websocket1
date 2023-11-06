import { Router } from "express";
import ProductManager from "../classes/productManager.js";

const router = Router();
const productsFile = "./src/data/productos.json";
const productManager = new ProductManager(productsFile);

// Inicializar el administrador de productos
productManager.initialize();

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts(limit);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar los productos" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productManager.getProductById(productId);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProductData = req.body;
    const newProduct = await productManager.addProduct(newProductData);
    res.json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Faltan campos obligatorios o el # code ya existe" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProductData = req.body;
    const updatedProduct = await productManager.updateProduct(productId, updatedProductData);
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    await productManager.deleteProduct(productId);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

export default router;
